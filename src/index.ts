import { performance } from 'perf_hooks';
import { Graph } from './graph/graph';
import { Node } from './node/node';
import { Queue } from 'queue-typescript';
import { FindingPathProblem } from './problem/finding-path-problem';
import { Utility } from './utils/utility';
import program from 'commander';

//#region Setup

const demos = ['bfs'];

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
  const directedGraphMap = [
    {
      State: "Milano",
      D: 0,
      Neighbors: [
        {
          State: "Monza",
          D: 26,
          Neighbors: []
        },
        {
          State: "Treviglio",
          D: 64,
          Neighbors: []
        },
        {
          State: "Crema",
          D: 46,
          Neighbors: []
        },
        {
          State: "Piacenza",
          D: 67,
          Neighbors: []
        },
        {
          State: "Rozzano",
          D: 13,
          Neighbors: []
        }
      ]
    },
    {
      State: "Monza",
      D: 0,
      Neighbors: [
        {
          State: "Bergamo",
          D: 45,
          Neighbors: []
        },
      ]
    },
    {
      State: "Rozzano",
      D: 0,
      Neighbors: [
        {
          State: "Pavia",
          D: 33,
          Neighbors: []
        },
      ]
    },
    {
      State: "Treviglio",
      D: 0,
      Neighbors: [
        {
          State: "Brescia",
          D: 57,
          Neighbors: []
        },
      ]
    },
    {
      State: "Crema",
      D: 0,
      Neighbors: [
        {
          State: "Cremona",
          D: 42,
          Neighbors: []
        },
      ]
    },
    {
      State: "Piacenza",
      D: 0,
      Neighbors: [
        {
          State: "Cremona",
          D: 43,
          Neighbors: []
        },
      ]
    },
    {
      State: "Brescia",
      D: 0,
      Neighbors: [
        {
          State: "Verona",
          D: 74,
          Neighbors: []
        },
        {
          State: "Mantua",
          D: 101,
          Neighbors: []
        }
      ]
    },
    {
      State: "Cremona",
      D: 0,
      Neighbors: [
        {
          State: "Mantua",
          D: 72,
          Neighbors: []
        }
      ]
    },
    {
      State: "Verona",
      D: 0,
      Neighbors: [
        {
          State: "Vicenza",
          D: 58,
          Neighbors: []
        },
        {
          State: "Padova",
          D: 88,
          Neighbors: []
        },
        {
          State: "Mantua",
          D: 48,
          Neighbors: []
        }
      ]
    },
    {
      State: "Vicenza",
      D: 0,
      Neighbors: [
        {
          State: "Treviso",
          D: 58,
          Neighbors: []
        },
        {
          State: "Venezia",
          D: 70,
          Neighbors: []
        }
      ]
    },
    {
      State: "Padova",
      D: 0,
      Neighbors: [
        {
          State: "Venezia",
          D: 39,
          Neighbors: []
        }
      ]
    },
    {
      State: "Treviso",
      D: 0,
      Neighbors: [
        {
          State: "Venezia",
          D: 41,
          Neighbors: []
        }
      ]
    }
  ];
  const algoName = "Breadth First Search";
  const solutionTree = Graph.makeUndirected(directedGraphMap);
  const problem = new FindingPathProblem('Milano', 'Venezia', solutionTree.nodes);

  const exploredSet: string[] = [];
  const frontier = new Queue<Node>(new Node(problem.getInitial, problem.getInitialNode));

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
        !frontier.toArray().find(s => s.state === node.state)
      ) {
        frontier.enqueue(node);
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
