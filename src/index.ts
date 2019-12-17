import { performance } from 'perf_hooks';
import { Graph, GraphNode } from './graph/graph';
import { FindingPathProblem } from './problem/finding-path-problem';
import { FindingPeakProblem } from './problem/finding-peak-problem';
import { NQueensProblem } from './problem/nqueens-problem';
import { Problem } from './problem/problem';
import {
  NorthItalyDirectedGraph, RomaniaLocations,
  RomaniaRoadMap
} from './resources/input-data';
import { AdvancedSearch } from './search/advanced-search';
import { Search } from './search/search';
import { Utility } from './utils/utility';
import program from 'commander';

//#region Cli Setup

const demos = ['bfs', 'ucs', 'dfs', 'iddfs', 'as', 'rbfs', 'sima'];
const maps = ['romania', 'north-italy', 'nqueens'];

let demo: string = '-';
let map: GraphNode[];
let problem: Problem;
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
  console.log('Available problems: ');
  maps.forEach(d => {
    console.log(d);
  });
  process.exit(0);
}

switch (program.map) {
  case 'north-italy': {
    program.map = 'north-italy';
    map = NorthItalyDirectedGraph;
    start = 'Milano';
    target = 'Venezia';
    goalConfigHandler(algConfigs);

    problem = new FindingPathProblem(start, target, getUndirectedGraphOfCurrentMap().nodes);

    // Sanity checks
    if (demo === 'as' || demo === 'rbfs') {
      warning('A*|rbfs searches cannot be used with north-italy since locations for this maps has not been implemented.');
      process.exit(-1);
    }

    break;
  }
  case 'nqueens': {
    // Looking for valid config for the current algorithm
    const sizeConfig = algConfigs.find(k => k.key === 'size');
    const size = sizeConfig ? parseInt(sizeConfig!.value) : 8;

    // Sanity checks
    if (demo === 'ucs' || demo === 'as' || demo === 'rbfs') {
      warning('A*|rbfs|ucs searches cannot be used with NQueens problem.');
      process.exit(-1);
    }

    problem = new NQueensProblem(size);

    break;
  }
  default: {
    map = RomaniaRoadMap;
    start = 'Arad';
    target = 'Bucharest';
    goalConfigHandler(algConfigs);

    problem = new FindingPathProblem(start, target, getUndirectedGraphOfCurrentMap().nodes);

    break;
  }
}

const search: Search = new Search(
  debug, warning, highlighted, program, start, target
);

const advSearch: AdvancedSearch = new AdvancedSearch(
  debug, warning, highlighted, program, start, target
);

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

//#endregion

//#region Uninformed Search

const bfsDemo = () => {
  search.breadthFirstSearch(problem);
};

const ucsDemo = () => {
  search.uniforCostSearch(problem);
};

const dfsDemo = () => {
  // Looking for valid config for the current algorithm
  const limitConfig = algConfigs.find(k => k.key === 'limit');
  const limit = limitConfig ? parseInt(limitConfig!.value) : 10;
  search.depthFirstSearch(problem, limit);
};

const iddfs = () => {
  // Looking for valid config for the current algorithm
  const limitConfig = algConfigs.find(k => k.key === 'limit');
  const maxLimit = limitConfig ? limitConfig!.value : 10;
  search.iterativeDeepeningDepthFirstSearch(problem, maxLimit);
};

//#endregion

//#region Informed Search

const as = () => {
  const heuristicData = getMapLocation(program.map);
  search.astarSearch(problem, heuristicData);
};

const rbfs = () => {
  const heuristicData = getMapLocation(program.map);
  search.recursiveBestFirstSearch(problem, heuristicData);
};

//#endregion

//#region Advanced search

const sima = () => {
  const area: number[][] = []; // TODO init
  const initialPosition: {x:number, y:number} = {x: 1, y: 1}; // TODO Random
  advSearch.simulatedAnnealing(new FindingPeakProblem(area, initialPosition));
};

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
  case 'sima': {
    program.map = null;
    f = sima;
    break;
  }
  case '-': {
    console.error('No demo chosen, see --help output for details');
    process.exit(-1);
  }
}

console.log(`Play '${demo}' demo`);

if (program.map) {
  console.log(`Using map: '${program.map}'`);
}

if (algConfigs.length > 0) {
  console.log(`With config: ${JSON.stringify(algConfigs, null, 2)}`);
}

f();

console.log(`Demo end in ${((performance.now() - t0)/1000).toFixed(6)} seconds`);
process.exit(0);

//#endregion
