import { performance } from 'perf_hooks';
import { Graph, GraphNode } from './graph/graph';
import { Node } from './node/node';
import { FindingPathProblem } from './problem/finding-path-problem';
import {
  NorthItalyDirectedGraph, RomaniaLocations,
  RomaniaRoadMap
} from './resources/input-data';
import { FifoQ } from './utils/fifo-queue';
import { Utility } from './utils/utility';
import program from 'commander';

//#region Cli Setup

const demos = ['bfs', 'ucs', 'dfs', 'iddfs', 'as', 'rbfs'];
const maps = ['romania', 'north-italy'];

let demo: string = '-';
let map: GraphNode[];
let start: string;
let target: string;
const algConfigs: {key: any, value: any}[] = [];

program
  .name('node index.js')
  .description('AI.Js learning project - Collection about AI demos' + Utility.header)
  .command('demo <name>', 'Demo to run')
  .option('-c, --configs <params>',
    'Configurations (syntax: \'par1=value1,par2=value2...\')',
    (configs: string) => {
      const algoParams = configs.split(',');
      algoParams.forEach((parameter: string) => {
        if (!parameter.match('.*?=.{1}')) {
          warning(`Unable to set this config: ${parameter}`);
          return;
        }
        const config = parameter.split('=');
        algConfigs.push({ key: config[0], value: config[1] });
      });
    })
  .action((cmd, arg) => {
    if (!demos.find(d => d === arg)) {
      warning('Unknown demo / Check command line parameters.');
      process.exit(-1);
    }
    demo = arg;
  })
  .option('-m, --map <name>', 'Map to use')
  .option('-l, --list', 'Demo list')
  .option('-d, --debug', 'Enable debug logs')
  .version('0.1');

program.parse(process.argv);

if (program.list) {
  console.log('Available demos: ');
  demos.forEach(d => {
    console.log(d);
  });
  console.log('Available maps (problems): ');
  maps.forEach(d => {
    console.log(d);
  });
  process.exit(0);
}

switch (program.map) {
  case 'romania': {
    map = RomaniaRoadMap;
    start = 'Arad';
    target = 'Bucharest';
    break;
  }
  default: {
    program.map = 'north-italy';
    map = NorthItalyDirectedGraph;
    start = 'Milano';
    target = 'Venezia';

    // Sanity checks
    if (demo === 'as' || demo === 'rbfs') {
      warning('A*|rbfs searches cannot be used with north-italy since locations for this maps has not been implemented.');
      process.exit(-1);
    }
  }
}

goalConfigHandler(algConfigs);

//#endregion

//#region Console

function debug(message: string): void {
  if (program.debug) {
    console.log('\x1b[33m%s\x1b[0m', `[DEBUG] ${message}`);
  }
}

function warning(message: string) {
  console.log('\x1b[31m%s\x1b[0m', message);
}

function highlighted(message: string) {
  console.log('\x1b[32m%s\x1b[0m', message);
}

//#endregion

//#region Common

function goalConfigHandler(configs: {key: any, value: any}[]): void {
  const startConf = configs.find(c => c.key === 'state.start');
  if (startConf && startConf.value && startConf.value !== '') {
    start = startConf.value;
  }
  const targetConf = configs.find(c => c.key === 'state.target');
  if (targetConf && targetConf.value && targetConf.value !== '') {
    target = targetConf.value;
  }
}

function getUndirectedGraphOfCurrentMap(): Graph {
  return Graph.makeUndirected(Utility.makeCopy(map) as GraphNode[]);
}

function getMapLocation(mapName: string): any[] {
  if (mapName === 'romania') {
    return RomaniaLocations;
  }

  return [];
}

// 'Best First Graph search' has a priority queue and some pre-knowledge defined
// at startup in order to choose the best path during graph/tree exploration
function bestFirstGraphSearch(
  pathCostFunc: (node: Node, target: string) => number,
  problem: FindingPathProblem,
  queue: FifoQ<Node>,
  algoName: string) {

  const frontier = queue;
  let iteration = 0;
  const exploredSet: string[] = [];

  while(frontier.length > 0) {
    iteration++;
    const node = frontier.dequeue();
    exploredSet.push(node.state);
    debug(`Visit node ${node.state}`);
    if (problem.goal_test(node.state)) {
      const result = Utility.ExplodePathInPlainText(0, 0, node.solution());
      const solutionPath = result.path.split('.');
      highlighted(`
        Goal reached '${node.state}' at depth: ${solutionPath.length}, using: ${algoName} in ${iteration} iterations. 
        Path: ${solutionPath.reverse().join(' -> ')}. 
        Total cost: ${result.cost}
        `);
      return;
    }
    const addToFrontier = node.expand(problem);
    debug(`Is not a goal, then expanding it in: ${addToFrontier.map(n => n.state).join(', ')}`);
    addToFrontier.forEach((node: Node) => {
      if ( // Avoid path repetitions
        !exploredSet.find(s => s === node.state) &&
        !frontier.find(s => s.state === node.state)
      ) {
        frontier.enqueue(node);
      } else {
        const toReplace = frontier.find(i =>
          i.state === node.state && pathCostFunc(i, target) > pathCostFunc(node, target));
        if (toReplace) {
          debug(`Replace node ${node.state} in frontier, new path is less expensive, new path cost: ${node.path_cost}, old one: ${toReplace.path_cost}`);
          frontier.replace(toReplace, node);
        } else {
          debug(`Discard node ${node.state} hasn't a lower path cost`);
        }
      }
    });
  }
  warning(`\nSolution not found! After ${iteration} iterations.\n`);
}

//#endregion

//#region Uninformed Search

//#region Find best Path with 'Breadth First Search'

const bfsDemo = () => {
  let iteration: number = 0;
  const algoName = 'Breadth First Search';
  const solutionTree = getUndirectedGraphOfCurrentMap();
  const problem = new FindingPathProblem(start, target, solutionTree.nodes);

  const exploredSet: string[] = [];
  const frontier = new FifoQ<Node>([new Node(problem.getInitial, problem.getInitialNode)]);

  while(frontier.length > 0) {
    iteration++;
    const node = frontier.dequeue();
    exploredSet.push(node.state);
    debug(`Visit node ${node.state}`);
    if (problem.goal_test(node.state)) {
      const result = Utility.ExplodePathInPlainText(0, 0, node.solution());
      const solutionPath = result.path.split('.');
      highlighted(`
        Goal reached '${node.state}' at depth: ${solutionPath.length}, using: ${algoName} in ${iteration} iterations. 
        Path: ${solutionPath.reverse().join(' -> ')}. 
        Total cost: ${result.cost}
        `);
      return;
    }
    const addToFrontier = node.expand(problem);
    debug(`Is not a goal, then expanding it in: ${addToFrontier.map(n => n.state).join(', ')}`);
    addToFrontier.forEach((node: Node) => {
      if ( // Avoid path repetitions
        !exploredSet.find(s => s === node.state) &&
        !frontier.find(s => s.state === node.state)
      ) {
        debug(`Enqueue node ${node.state} in frontier`);
        frontier.enqueue(node);
      } else {
        debug(`Discard node ${node.state}, has already been visited`);
      }
    });
  }
  warning(`\nSolution not found! After ${iteration} iterations.\n`);
};

//#endregion

//#region Find best Path with 'Uniform Cost Search'

const ucsDemo = () => {
  const algoName = 'Uniform Cost Search';
  const solutionTree = getUndirectedGraphOfCurrentMap();
  const problem = new FindingPathProblem(start, target, solutionTree.nodes);

  // Create a FIFO queue with priority (by path cost).
  const frontier = new FifoQ<Node>(
    [new Node(problem.getInitial, problem.getInitialNode)],
    (a,b) => {
      if (a.path_cost > b.path_cost) {
        return 1;
      } else if (a.path_cost < b.path_cost) {
        return -1
      }
      return 0;
    },
    true);

  bestFirstGraphSearch(
    // Uniform Cost Search use just the node path cost as is
    (n: Node, target: string):number => {
      return n.path_cost;
    },
    problem,
    frontier,
    algoName);
};

//#endregion

//#region Find best Path with 'Depth First Search'

const recursiveDls = (
  depth: number,
  node: Node,
  problem: FindingPathProblem,
  limit: number,
  exploredSet: string[]
): Node => {
  debug(`Entering tree at depth ${depth}`);
  exploredSet.push(node.state);
  debug(`Visit node ${node.state}`);
  if (problem.goal_test(node.state)) {
    return node;
  } else {
    if (limit - depth === 0) {
      debug('Depth limit reached');
      return null;
    }
    const nodes = node.expand(problem);
    debug(`Is not a goal, then expanding it in: ${nodes.map(n => n.state).join(', ')}`);
    let found = null;
    for (let i = 0; i < nodes.length; i++) {
      if (exploredSet.find(n => n === nodes[i].state)) {
        continue;
      }
      found = recursiveDls(depth + 1, nodes[i], problem, limit, exploredSet);
      if (found) {
        break;
      }
    }
    debug(`Go back to depth level: ${depth - 1}`);
    return found;
  }
};

const dfsDemo = () => {
  // Looking for valid config for the current algorithm
  const limitConfig = algConfigs.find(k => k.key === 'limit');
  const limit = limitConfig ? limitConfig!.value : 10;

  const algoName = 'Depth First Search';
  const directedGraph = Utility.makeCopy(map) as GraphNode[];
  const solutionTree = Graph.makeUndirected(directedGraph);
  const problem = new FindingPathProblem(start, target, solutionTree.nodes);
  const exploredSet: string[] = [];

  const node = recursiveDls(
    1, new Node(problem.getInitial, problem.getInitialNode), problem, parseInt(limit), exploredSet
  );
  if (node) {
    const result = Utility.ExplodePathInPlainText(0, 0, node.solution());
    const solutionPath = result.path.split('.');
    highlighted(`
            Goal reached '${node.state}' at depth ${solutionPath.length}, using: ${algoName} (Depth limit: ${limit}). 
            Path: ${solutionPath.reverse().join(' -> ')}. 
            Total cost: ${result.cost}
          `);
  } else {
    warning(`\nSolution not found!.\n`);
  }
};

//#endregion

//#region Find best Path with 'Iterative Deepening Depth First Search'

const iddfs = () => {
  // Looking for valid config for the current algorithm
  const limitConfig = algConfigs.find(k => k.key === 'limit');
  const maxLimit = limitConfig ? limitConfig!.value : 10;
  const algoName = 'Iterative Deepening Depth First Search';
  const solutionTree = getUndirectedGraphOfCurrentMap();
  const problem = new FindingPathProblem(start, target, solutionTree.nodes);

  for (let i = 1; i <= maxLimit; i++) {
    debug(`Start iteration with limit ${i}`);
    const exploredSet: string[] = [];
    const node = recursiveDls(
      1, new Node(problem.getInitial, problem.getInitialNode), problem, i, exploredSet
    );
    if (node) {
      const result = Utility.ExplodePathInPlainText(0, 0, node.solution());
      const solutionPath = result.path.split('.');
      highlighted(`
            Goal reached '${node.state}' at depth ${solutionPath.length}, using: ${algoName}. 
            Path: ${solutionPath.reverse().join(' -> ')}. 
            Total cost: ${result.cost}
          `);
      return;
    }
    debug(`Limit increasing`);
  }
  warning(`\nSolution not found!.\n`);
};

//#endregion

//#endregion

//#region Informed Search

//#region Find best Path with 'A* Search'

const as = () => {
  const algoName = 'A-star Search';
  const solutionTree = getUndirectedGraphOfCurrentMap();
  const problem = new FindingPathProblem(start, target, solutionTree.nodes);
  const heuristicData = getMapLocation(program.map);

  const heuristicPathCost = (node: Node, target: string): number => {
    const nLoc = heuristicData.find(l => l.state === node.state);
    const gLoc = heuristicData.find(l => l.state === target);
    return node.path_cost + Utility.distanceOnGraph(
      {x: nLoc.x, y: nLoc.y},
      {x: gLoc.x, y: gLoc.y}
    );
  };
  // Create a FIFO queue with priority (by path cost + heuristic knowledge).
  const frontier = new FifoQ<Node>(
    [new Node(problem.getInitial, problem.getInitialNode)],
    // Compare function define how to define the 'priority' queue
    (a,b) => {
      const aCost = heuristicPathCost(a,target);
      const bCost = heuristicPathCost(b, target);
      if (aCost > bCost) {
        return 1;
      } else if (aCost < bCost) {
        return -1;
      }
      return 0;
    },
    // Apply priority automatically
    true);

  bestFirstGraphSearch(
    // A* Search use the node path cost and some heuristic knowledge
    (n: Node, target: string):number => {
      return heuristicPathCost(n, target);
    },
    problem,
    frontier,
    algoName);
};

//#endregion

//#region Find best path with 'Recursive Best First Search'

interface RbfsResult {
  /**
   * Node
   */
  node: Node,
  /**
   * A total cost (path cost + heuristic cost) of the discovered path
   */
  fCost: number
}

const rbfs = () => {
  let iterations = 0;
  const algoName = 'Recursive Best First Search';
  const solutionTree = getUndirectedGraphOfCurrentMap();
  const problem = new FindingPathProblem(start, target, solutionTree.nodes);
  const heuristicData = getMapLocation(program.map);

  const heuristicPathCost = (node: Node, target: string): number => {
    const nLoc = heuristicData.find(l => l.state === node.state);
    const gLoc = heuristicData.find(l => l.state === target);
    return node.path_cost + Utility.distanceOnGraph(
      {x: nLoc.x, y: nLoc.y},
      {x: gLoc.x, y: gLoc.y}
    );
  };

  const compareFn = (a: Node, b: Node) => {
    if (a.f > b.f) {
      return 1;
    } else if (a.f < b.f) {
      return -1;
    }
    return 0;
  };

  const recursiveRbfs = (problem: FindingPathProblem, node: Node, f_limit: number): RbfsResult => {
    iterations++;

    debug(`Visit node ${node.state}`);
    if (problem.goal_test(node.state)) {
      return { node: node, fCost: node.f };
    }

    const successors = node.expand(problem);
    if (successors.length === 0) {
      return { node: null, fCost: Infinity };
    }
    debug(`Is not a goal, then expanding it in: 
  ${successors.map(n => n.state).join(', ')}`);
    successors.forEach((child: Node) => {
      const childF = heuristicPathCost(child, target);
      child.f = Math.max(childF, node.f);
    });

    while (true) {
      successors.sort(compareFn);
      debug(`Evaluate next nodes by path cost + heuristic function, 
  now are: |${successors.map(s => `${s.state}(${s.f.toFixed(2)})`).join('|')}|`);
      let alternativeCost: number;
      const best = successors[0];
      if (best) {
        debug(`Selected best node: ${best.state} with estimated cost to goal: ${best.f.toFixed(2)}`);
      } else {
        debug('Frontier is empty');
        return { node: null, fCost: Infinity };
      }
      if (best.f > f_limit) {
        debug(`Discard this best path via ${best.state} due to worst cost: 
  (new -> ${best.f.toFixed(2)}) > (prev -> ${f_limit.toFixed(2)})`);
        return { node: null, fCost: best.f };
      }
      if (successors.length > 1) {
        alternativeCost = successors[1].f;
        debug(`Selected an alternative path via ${successors[1].state} 
  with estimated cost to goal: ${alternativeCost.toFixed(2)}`);
      } else {
        debug('Last node of the frontier reached');
        alternativeCost = Infinity;
      }
      const res = recursiveRbfs(problem, best, Math.min(f_limit, alternativeCost));
      best.f = res.fCost;
      if (res.node) {
        return { node: res.node, fCost: best.f };
      } else {
        debug(`Go back and select the alternative path from the frontier`);
      }
    }
  };

  const startNode = new Node(problem.getInitial, problem.getInitialNode);
  startNode.f = heuristicPathCost(startNode, target);
  const res = recursiveRbfs(problem, startNode, Infinity);

  if (res.node) {
    const result = Utility.ExplodePathInPlainText(0, 0, res.node.solution());
    const solutionPath = result.path.split('.');
    highlighted(`
        Goal reached '${res.node.state}' at depth: ${solutionPath.length}, using: ${algoName}, total recursive iterations: ${iterations}. 
        Path: ${solutionPath.reverse().join(' -> ')}. 
        Total cost: ${result.cost}
        `);
    return;
  } else {
    warning(`\nSolution not found!\n`);
  }
};

//#endregion

//#endregion

//#region Main

const t0 = performance.now();
let f: () => void;

switch (demo) {
  case 'bfs': {
    f = bfsDemo;
    break;
  }
  case 'ucs': {
    f = ucsDemo;
    break;
  }
  case 'dfs': {
    f = dfsDemo;
    break;
  }
  case 'iddfs': {
    f = iddfs;
    break;
  }
  case 'as': {
    f = as;
    break;
  }
  case 'rbfs': {
    f = rbfs;
    break;
  }
  case '-': {
    console.error('No demo chosen, see --help output for details');
    process.exit(-1);
  }
}

console.log(`Play '${demo}' demo, using map: '${program.map}'`);
if (algConfigs.length > 0) {
  console.log(`With config: ${JSON.stringify(algConfigs, null, 2)}`);
}

f();

console.log(`Demo end in ${((performance.now() - t0)/1000).toFixed(6)} seconds`);
process.exit(0);

//#endregion
