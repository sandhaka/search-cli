import { Node } from '../node/node';
import { FindingPathProblem } from '../problem/finding-path-problem';
import { FifoQ } from '../utils/fifo-queue';
import { Utility } from '../utils/utility';

/**
 * The collection of standard graph/tree search algorithms
 */
export class Search {

  /**
   * Logging actions
   */
  private readonly debug: (text: string) => void;
  private readonly warning: (text: string) => void;
  private readonly highlighted: (text: string) => void;

  /**
   * Commander instance
   */
  private readonly program: any;

  /**
   * Goal config
   */
  private readonly start: string;
  private readonly target: string;

  constructor(
    debug: (text: string) => void,
    warning: (text: string) => void,
    highlighted: (text: string) => void,
    program: any,
    start: string,
    target: string
  ) {
    this.debug = debug;
    this.warning = warning;
    this.highlighted = highlighted;
    this.program = program;
    this.start = start;
    this.target = target;
  }

  private bestFirstGraphSearch(
    pathCostFunc: (node: Node, target: string) => number,
    problem: FindingPathProblem,
    queue: FifoQ<Node>,
    algoName: string) {

    const frontier = queue;
    let iteration = 0;
    const exploredSet: string[] = [];

    while (frontier.length > 0) {
      iteration++;
      const node = frontier.dequeue();
      exploredSet.push(node.state);
      this.debug(`Visit node ${node.state}`);
      if (problem.goal_test(node.state)) {
        const result = Utility.ExplodePathInPlainText(0, 0, node.solution());
        const solutionPath = result.path.split('.');
        this.highlighted(`
        Goal reached '${node.state}' at depth: ${solutionPath.length}, using: ${algoName} in ${iteration} iterations. 
        Path: ${solutionPath.reverse().join(' -> ')}. 
        Total cost: ${result.cost}
        `);
        return;
      }
      const addToFrontier = node.expand(problem);
      this.debug(`Is not a goal, then expanding it in: ${addToFrontier.map(n => n.state).join(', ')}`);
      addToFrontier.forEach((node: Node) => {
        if ( // Avoid path repetitions
          !exploredSet.find(s => s === node.state) &&
          !frontier.find(s => s.state === node.state)
        ) {
          frontier.enqueue(node);
        } else {
          const toReplace = frontier.find(i =>
            i.state === node.state && pathCostFunc(i, this.target) > pathCostFunc(node, this.target));
          if (toReplace) {
            this.debug(`Replace node ${node.state} in frontier, new path is less expensive, new path cost: ${node.path_cost}, old one: ${toReplace.path_cost}`);
            frontier.replace(toReplace, node);
          } else {
            this.debug(`Discard node ${node.state} hasn't a lower path cost`);
          }
        }
      });
    }
    this.warning(`\nSolution not found! After ${iteration} iterations.\n`);
  }

  private recursiveDls(
    depth: number,
    node: Node,
    problem: FindingPathProblem,
    limit: number,
    exploredSet: string[]
  ): Node {
    this.debug(`Entering tree at depth ${depth}`);
    exploredSet.push(node.state);
    this.debug(`Visit node ${node.state}`);
    if (problem.goal_test(node.state)) {
      return node;
    } else {
      if (limit - depth === 0) {
        this.debug('Depth limit reached');
        return null;
      }
      const nodes = node.expand(problem);
      this.debug(`Is not a goal, then expanding it in: ${nodes.map(n => n.state).join(', ')}`);
      let found = null;
      for (let i = 0; i < nodes.length; i++) {
        if (exploredSet.find(n => n === nodes[i].state)) {
          continue;
        }
        found = this.recursiveDls(depth + 1, nodes[i], problem, limit, exploredSet);
        if (found) {
          break;
        }
      }
      this.debug(`Go back to depth level: ${depth - 1}`);
      return found;
    }
  }

  /**
   * Breadth First Search
   * expands the shallowest nodes first; it is complete, optimal
   * for unit step costs, but has exponential space complexity.
   */
  breadthFirstSearch(problem: FindingPathProblem): void {
    let iteration: number = 0;
    const algoName = 'Breadth First Search';

    const exploredSet: string[] = [];
    const frontier = new FifoQ<Node>([new Node(problem.getInitial, problem.getInitialNode)]);

    while (frontier.length > 0) {
      iteration++;
      const node = frontier.dequeue();
      exploredSet.push(node.state);
      this.debug(`Visit node ${node.state}`);
      if (problem.goal_test(node.state)) {
        const result = Utility.ExplodePathInPlainText(0, 0, node.solution());
        const solutionPath = result.path.split('.');
        this.highlighted(`
        Goal reached '${node.state}' at depth: ${solutionPath.length}, using: ${algoName} in ${iteration} iterations. 
        Path: ${solutionPath.reverse().join(' -> ')}. 
        Total cost: ${result.cost}
        `);
        return;
      }
      const addToFrontier = node.expand(problem);
      this.debug(`Is not a goal, then expanding it in: ${addToFrontier.map(n => n.state).join(', ')}`);
      addToFrontier.forEach((node: Node) => {
        if ( // Avoid path repetitions
          !exploredSet.find(s => s === node.state) &&
          !frontier.find(s => s.state === node.state)
        ) {
          this.debug(`Enqueue node ${node.state} in frontier`);
          frontier.enqueue(node);
        } else {
          this.debug(`Discard node ${node.state}, has already been visited`);
        }
      });
    }
    this.warning(`\nSolution not found! After ${iteration} iterations.\n`);
  }

  /**
   * Uniform-cost search
   * expands the node with lowest path cost, g(n), and is optimal
   * for general step costs.
   */
  uniforCostSearch(problem: FindingPathProblem): void {

    const algoName = 'Uniform Cost Search';

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

    this.bestFirstGraphSearch(
      // Uniform Cost Search use just the node path cost as is
      (n: Node, target: string):number => {
        return n.path_cost;
      },
      problem,
      frontier,
      algoName);
  }

  /**
   * Depth-first search
   * expands the deepest unexpanded node first. It is neither complete
   * nor optimal, but has linear space complexity. Depth-limited search adds a
   * depth bound.
   */
  depthFirstSearch(problem: FindingPathProblem, limit: number): void {
    const algoName = 'Depth First Search';
    const exploredSet: string[] = [];

    const node = this.recursiveDls(
      1, new Node(problem.getInitial, problem.getInitialNode), problem, limit, exploredSet
    );
    if (node) {
      const result = Utility.ExplodePathInPlainText(0, 0, node.solution());
      const solutionPath = result.path.split('.');
      this.highlighted(`
            Goal reached '${node.state}' at depth ${solutionPath.length}, using: ${algoName} (Depth limit: ${limit}). 
            Path: ${solutionPath.reverse().join(' -> ')}. 
            Total cost: ${result.cost}
          `);
    } else {
      this.warning(`\nSolution not found!.\n`);
    }
  }

  /**
   * Iterative deepening search
   * calls depth-first search with increasing depth limits * until a goal is found.
   * It is complete, optimal for unit step costs, has time complexity
   * comparable to breadth-first search, and has linear space complexity.
   */
  iterativeDeepeningDepthFirstSearch(problem: FindingPathProblem, maxLimit: number): void {
    const algoName = 'Iterative Deepening Depth First Search';
    for (let i = 1; i <= maxLimit; i++) {
      this.debug(`Start iteration with limit ${i}`);
      const exploredSet: string[] = [];
      const node = this.recursiveDls(
        1, new Node(problem.getInitial, problem.getInitialNode), problem, i, exploredSet
      );
      if (node) {
        const result = Utility.ExplodePathInPlainText(0, 0, node.solution());
        const solutionPath = result.path.split('.');
        this.highlighted(`
            Goal reached '${node.state}' at depth ${solutionPath.length}, using: ${algoName}. 
            Path: ${solutionPath.reverse().join(' -> ')}. 
            Total cost: ${result.cost}
          `);
        return;
      }
      this.debug(`Limit increasing`);
    }
    this.warning(`\nSolution not found!.\n`);
  }

  /**
   * A∗ search
   * expands nodes with minimal f(n) = g(n) + h(n). A∗ is complete and
   * optimal, provided that h(n) is admissible (for TREE-SEARCH) or consistent
   * (for GRAPH-SEARCH). The space complexity of A∗ is still prohibitive.
   */
  astarSearch(problem: FindingPathProblem, heuristicData: any[]): void {
    const algoName = 'A-star Search';
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
        const aCost = heuristicPathCost(a,this.target);
        const bCost = heuristicPathCost(b, this.target);
        if (aCost > bCost) {
          return 1;
        } else if (aCost < bCost) {
          return -1;
        }
        return 0;
      },
      // Apply priority automatically
      true);

    this.bestFirstGraphSearch(
      // A* Search use the node path cost and some heuristic knowledge
      (n: Node, target: string):number => {
        return heuristicPathCost(n, target);
      },
      problem,
      frontier,
      algoName);
  }

  /**
   * RBFS (recursive best-first search) and SMA∗ (simplified memory-bounded A∗)
   * are robust, optimal search algorithms that use limited amounts of memory; give
   * enough time, they can solve problems that A∗ cannot solve because it runs out of memory.
   */
  recursiveBestFirstSearch(problem: FindingPathProblem, heuristicData: any[]): void {
    let iterations = 0;
    const algoName = 'Recursive Best First Search';

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

      this.debug(`Visit node ${node.state}`);
      if (problem.goal_test(node.state)) {
        return { node: node, fCost: node.f };
      }

      const successors = node.expand(problem);
      if (successors.length === 0) {
        return { node: null, fCost: Infinity };
      }
      this.debug(`Is not a goal, then expanding it in: 
  ${successors.map(n => n.state).join(', ')}`);
      successors.forEach((child: Node) => {
        const childF = heuristicPathCost(child, this.target);
        child.f = Math.max(childF, node.f);
      });

      while (true) {
        successors.sort(compareFn);
        this.debug(`Evaluate next nodes by path cost + heuristic function, 
  now are: |${successors.map(s => `${s.state}(${s.f.toFixed(2)})`).join('|')}|`);
        let alternativeCost: number;
        const best = successors[0];
        if (best) {
          this.debug(`Selected best node: ${best.state} with estimated cost to goal: ${best.f.toFixed(2)}`);
        } else {
          this.debug('Frontier is empty');
          return { node: null, fCost: Infinity };
        }
        if (best.f > f_limit) {
          this.debug(`Discard this best path via ${best.state} due to worst cost: 
  (new -> ${best.f.toFixed(2)}) > (prev -> ${f_limit.toFixed(2)})`);
          return { node: null, fCost: best.f };
        }
        if (successors.length > 1) {
          alternativeCost = successors[1].f;
          this.debug(`Selected an alternative path via ${successors[1].state} 
  with estimated cost to goal: ${alternativeCost.toFixed(2)}`);
        } else {
          this.debug('Last node of the frontier reached');
          alternativeCost = Infinity;
        }
        const res = recursiveRbfs(problem, best, Math.min(f_limit, alternativeCost));
        best.f = res.fCost;
        if (res.node) {
          return { node: res.node, fCost: best.f };
        } else {
          this.debug(`Go back and select the alternative path from the frontier`);
        }
      }
    };

    const startNode = new Node(problem.getInitial, problem.getInitialNode);
    startNode.f = heuristicPathCost(startNode, this.target);
    const res = recursiveRbfs(problem, startNode, Infinity);

    if (res.node) {
      const result = Utility.ExplodePathInPlainText(0, 0, res.node.solution());
      const solutionPath = result.path.split('.');
      this.highlighted(`
        Goal reached '${res.node.state}' at depth: ${solutionPath.length}, using: ${algoName}, total recursive iterations: ${iterations}. 
        Path: ${solutionPath.reverse().join(' -> ')}. 
        Total cost: ${result.cost}
        `);
      return;
    } else {
      this.warning(`\nSolution not found!\n`);
    }
  }
}

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
