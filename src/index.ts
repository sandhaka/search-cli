import { performance } from 'perf_hooks';
import { Graph, GraphNode } from './graph/graph';
import { Node } from './node/node';
import { FindingPathProblem } from './problem/finding-path-problem';
import {
  NorthItalyDirectedGraph,
  RomaniaRoadMap
} from './resources/input-data';
import { FifoQ } from './utils/fifo-queue';
import { Utility } from './utils/utility';
import program from 'commander';

//#region Cli Setup

const demos = ['bfs', 'ucs', 'dfs', 'iddfs'];
const maps = ['romania', 'north-italy'];

let demo: string = '-';
let map: GraphNode[];
let start: string;
let target: string;
const algConfigs: {key: any, value: any}[] = [];

program
  .name('AI.Js learning project')
  .description('Collection about AI demos')
  .command('demo <name>', 'Demo to run')
  .option('-c, --configs <params>',
    'Configurations (syntax: \'par1=value1,par2=value2...\')',
    (configs: string) => {
      const algoParams = configs.split(',');
      algoParams.forEach((parameter: string) => {
        if (!parameter.match('.*?=.{1}')) {
          console.warn(`Unable to set this config: ${parameter}`);
          return;
        }
        const config = parameter.split('=');
        algConfigs.push({ key: config[0], value: config[1] });
      });
    })
  .action((cmd, arg) => {
    if (!demos.find(d => d === arg)) {
      console.error('Unknown demo / Check command line parameters.');
      process.exit(-1);
    }
    demo = arg;
  })
  .option('-m, --map <name>', 'Map to use')
  .option('-l, --list', 'Demo list')
  .version('0.1')
  .parse(process.argv);

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
  }
}

console.log(`Play '${demo}' demo, using map: '${program.map}'`);
if (algConfigs.length > 0) {
  console.log(`With config: ${JSON.stringify(algConfigs, null, 2)}`);
}

//#endregion

//#region Find best Path with 'Breadth First Search'

const bfsDemo = () => {
  let iteration: number = 0;
  const algoName = 'Breadth First Search';
  const directedGraph = Utility.makeCopy(map) as GraphNode[];
  const solutionTree = Graph.makeUndirected(directedGraph);
  const problem = new FindingPathProblem(start, target, solutionTree.nodes);

  const exploredSet: string[] = [];
  const frontier = new FifoQ<Node>([new Node(problem.getInitial, problem.getInitialNode)]);

  while(frontier.length > 0) {
    iteration++;
    const node = frontier.dequeue();
    exploredSet.push(node.state);
    if (problem.goal_test(node.state)) {
      const result = Utility.ExplodePathInPlainText(0, 0, node.solution());
      console.log(`
        Goal reached '${node.state}', using: ${algoName} in ${iteration} iterations. 
        Path: ${result.path.split('.').reverse().join(' -> ')}. 
        Total cost: ${result.cost}
        `);
      return;
    }
    const addToFrontier = node.expand(problem);
    addToFrontier.forEach((node: Node) => {
      if ( // Avoid path repetitions
        !exploredSet.find(s => s === node.state) &&
        !frontier.find(s => s.state === node.state)
      ) {
        frontier.enqueue(node);
      }
    });
  }
  console.log(`\nSolution not found! After ${iteration} iterations.\n`);
};

//#endregion

//#region Find best Path with 'Uniform Cost Search'

const ucsDemo = () => {
  let iteration: number = 0;
  const algoName = 'Uniform Cost Search';
  const directedGraph = Utility.makeCopy(map) as GraphNode[];
  const solutionTree = Graph.makeUndirected(directedGraph);
  const problem = new FindingPathProblem(start, target, solutionTree.nodes);
  const exploredSet: string[] = [];

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

  while(frontier.length > 0) {
    iteration++;
    const node = frontier.dequeue();
    exploredSet.push(node.state);
    if (problem.goal_test(node.state)) {
      const result = Utility.ExplodePathInPlainText(0, 0, node.solution());
      console.log(`
        Goal reached '${node.state}', using: ${algoName} in ${iteration} iterations. 
        Path: ${result.path.split('.').reverse().join(' -> ')}. 
        Total cost: ${result.cost}
        `);
      return;
    }
    const addToFrontier = node.expand(problem);
    addToFrontier.forEach((node: Node) => {
      if ( // Avoid path repetitions
        !exploredSet.find(s => s === node.state) &&
        !frontier.find(s => s.state === node.state)
      ) {
        frontier.enqueue(node);
      } else {
        const toReplace = frontier.find(i =>
          i.state === node.state && i.path_cost > node.path_cost);
        if (toReplace) {
          frontier.replace(toReplace, node);
        }
      }
    });
  }
  console.log(`\nSolution not found! After ${iteration} iterations.\n`);
};

//#endregion

//#region Find best Path with 'Depth First Search'

const recursiveDls = (node: Node, problem: FindingPathProblem, limit: number, exploredSet: string[]): Node => {
  exploredSet.push(node.state);
  if (problem.goal_test(node.state)) {
    return node;
  } else {
    const nodes = node.expand(problem);
    let found = null;
    for (let i = 0; i < nodes.length; i++) {
      if (exploredSet.find(n => n === nodes[i].state)) {
        continue;
      } else if (limit - 1 === 0) {
        break;
      }
      found = recursiveDls(nodes[i], problem, limit - 1, exploredSet);
      if (found) {
        break;
      }
    }
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
    new Node(problem.getInitial, problem.getInitialNode), problem, parseInt(limit), exploredSet
  );
  if (node) {
    const result = Utility.ExplodePathInPlainText(0, 0, node.solution());
    const solutionPath = result.path.split('.');
    console.log(`
            Goal reached '${node.state}' at depth ${solutionPath.length}, using: ${algoName} (Depth limit: ${limit}). 
            Path: ${solutionPath.reverse().join(' -> ')}. 
            Total cost: ${result.cost}
          `);
  } else {
    console.log(`\nSolution not found!.\n`);
  }
};

//#endregion

//#region Find best Path with 'Iterative Deepening Depth First Search'

const iddfs = () => {
  // Looking for valid config for the current algorithm
  const limitConfig = algConfigs.find(k => k.key === 'limit');
  const maxLimit = limitConfig ? limitConfig!.value : 10;

  const algoName = 'Iterative Depth First Search';
  const directedGraph = Utility.makeCopy(map) as GraphNode[];
  const solutionTree = Graph.makeUndirected(directedGraph);
  const problem = new FindingPathProblem(start, target, solutionTree.nodes);

  for (let i = 1; i <= maxLimit; i++) {
    const exploredSet: string[] = [];
    const node = recursiveDls(
      new Node(problem.getInitial, problem.getInitialNode), problem, i, exploredSet
    );
    if (node) {
      const result = Utility.ExplodePathInPlainText(0, 0, node.solution());
      const solutionPath = result.path.split('.');
      console.log(`
            Goal reached '${node.state}' at depth ${solutionPath.length}, using: ${algoName}. 
            Path: ${solutionPath.reverse().join(' -> ')}. 
            Total cost: ${result.cost}
          `);
      return;
    }
  }
  console.log(`\nSolution not found!.\n`);
};

//#endregion

//#region Main

const t0 = performance.now();

switch (demo) {
  case 'bfs': {
    bfsDemo();
    break;
  }
  case 'ucs': {
    ucsDemo();
    break;
  }
  case 'dfs': {
    dfsDemo();
    break;
  }
  case 'iddfs': {
    iddfs();
    break;
  }
}

console.log(`Demo end in ${((performance.now() - t0)/1000).toFixed(6)} seconds`);
process.exit(0);

//#endregion
