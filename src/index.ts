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
      Cost: 0,
      Neighbors: [
        {
          State: "Monza",
          Cost: 26,
          Neighbors: []
        },
        {
          State: "Treviglio",
          Cost: 64,
          Neighbors: []
        },
        {
          State: "Crema",
          Cost: 46,
          Neighbors: []
        },
        {
          State: "Piacenza",
          Cost: 67,
          Neighbors: []
        },
        {
          State: "Rozzano",
          Cost: 13,
          Neighbors: []
        }
      ]
    },
    {
      State: "Monza",
      Cost: 0,
      Neighbors: [
        {
          State: "Bergamo",
          Cost: 45,
          Neighbors: []
        },
      ]
    },
    {
      State: "Rozzano",
      Cost: 0,
      Neighbors: [
        {
          State: "Pavia",
          Cost: 33,
          Neighbors: []
        },
      ]
    },
    {
      State: "Treviglio",
      Cost: 0,
      Neighbors: [
        {
          State: "Brescia",
          Cost: 57,
          Neighbors: []
        },
      ]
    },
    {
      State: "Crema",
      Cost: 0,
      Neighbors: [
        {
          State: "Cremona",
          Cost: 42,
          Neighbors: []
        },
      ]
    },
    {
      State: "Piacenza",
      Cost: 0,
      Neighbors: [
        {
          State: "Cremona",
          Cost: 43,
          Neighbors: []
        },
      ]
    },
    {
      State: "Brescia",
      Cost: 0,
      Neighbors: [
        {
          State: "Verona",
          Cost: 74,
          Neighbors: []
        },
        {
          State: "Mantua",
          Cost: 101,
          Neighbors: []
        }
      ]
    },
    {
      State: "Cremona",
      Cost: 0,
      Neighbors: [
        {
          State: "Mantua",
          Cost: 72,
          Neighbors: []
        }
      ]
    },
    {
      State: "Verona",
      Cost: 0,
      Neighbors: [
        {
          State: "Vicenza",
          Cost: 58,
          Neighbors: []
        },
        {
          State: "Padova",
          Cost: 88,
          Neighbors: []
        },
        {
          State: "Mantua",
          Cost: 48,
          Neighbors: []
        }
      ]
    },
    {
      State: "Vicenza",
      Cost: 0,
      Neighbors: [
        {
          State: "Treviso",
          Cost: 58,
          Neighbors: []
        },
        {
          State: "Venezia",
          Cost: 70,
          Neighbors: []
        }
      ]
    },
    {
      State: "Padova",
      Cost: 0,
      Neighbors: [
        {
          State: "Venezia",
          Cost: 39,
          Neighbors: []
        }
      ]
    },
    {
      State: "Treviso",
      Cost: 0,
      Neighbors: [
        {
          State: "Venezia",
          Cost: 41,
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
