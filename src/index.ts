import { performance } from 'perf_hooks';
import { Graph, GraphNode } from './graph/graph';
import { Node } from './node/node';
import { FindingPathProblem } from './problem/finding-path-problem';
import { NorthItalyDirectedGraph } from './resources/input-data';
import { Queue } from './utils/queue';
import { Utility } from './utils/utility';
import program from 'commander';

//#region Setup

const demos = ['bfs', 'ucs'];

program
  .name('AI.Js learning project')
  .description('Collection about AI demos')
  .option('-d, --demo <name>,', 'Demo to run')
  .option('-l, --list', 'Demo list')
  .version('0.1')
  .parse(process.argv);

if (program.list) {
  console.log("Available demos: ");
  demos.forEach(d => {
    console.log(d);
  });
  process.exit(0);
}

if (!program.demo) {
  handleError('Missing demo parameter');
}

console.log(`Play "${program.demo}" demo`);

//#endregion

//#region Find best Path with "Breadth First Search"

const bfsDemo = () => {
  let iteration: number = 0;
  const algoName = "Breadth First Search";
  const directedGraph = Utility.makeCopy(NorthItalyDirectedGraph) as GraphNode[];
  const solutionTree = Graph.makeUndirected(directedGraph);
  const problem = new FindingPathProblem('Milano', 'Venezia', solutionTree.nodes);

  const exploredSet: string[] = [];
  const frontier = new Queue<Node>([new Node(problem.getInitial, problem.getInitialNode)]);

  while(frontier.length > 0) {
    iteration++;
    const node = frontier.dequeue();
    exploredSet.push(node.state);
    if (problem.goal_test(node.state)) {
      const result = Utility.ExplodePathInPlainText(0, 0, node.solution());
      console.log(`
        Goal reached "${node.state}", using: ${algoName} in ${iteration} iterations. 
        Path: ${result.path.split('.').reverse().join(' -> ')}. 
        Total cost: ${result.cost}
        `);
      break;
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
};

//#endregion

//#region Find best Path with "Uniform Cost Search"

const ucsDemo = () => {
  let iteration: number = 0;
  const algoName = "Uniform Cost Search";
  const directedGraph = Utility.makeCopy(NorthItalyDirectedGraph) as GraphNode[];
  const solutionTree = Graph.makeUndirected(directedGraph);
  const problem = new FindingPathProblem('Milano', 'Venezia', solutionTree.nodes);
  const exploredSet: string[] = [];

  // Create a FIFO queue with priority (by path cost).
  const frontier = new Queue<Node>(
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
        Goal reached "${node.state}", using: ${algoName} in ${iteration} iterations. 
        Path: ${result.path.split('.').reverse().join(' -> ')}. 
        Total cost: ${result.cost}
        `);
      break;
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
};

//#endregion

//#region Main

const t0 = performance.now();

switch (program.demo) {
  case 'bfs': {
    bfsDemo();
    break;
  }
  case 'ucs': {
    ucsDemo();
    break;
  }
  default: {
    handleError('Unknown demo: ' + program.demo);
  }
}

console.log(`Demo end in ${((performance.now() - t0)/1000).toFixed(6)} seconds`);
process.exit(0);

function handleError(error: string) {
  console.error(error);
  process.exit(-1);
}

//#endregion
