import { GraphNode } from '../graph/graph';
import { Problem } from './problem';

/**
 * "Find the best path" problem
 */
export class FindingPathProblem extends Problem {

  private readonly graph: GraphNode[];

  constructor(initial: string, goal: string, graph: GraphNode[]) {
    super(initial, goal);
    this.graph = graph;
  }

  /**
   * Initial state getter
   */
  get getInitial(): string {
    return this.initial;
  }

  /**
   * First graph node getter
   */
  get getInitialNode(): GraphNode {
    return this.getNode(this.initial);
  }

  /**
   * Return the associated actions for given state.
   * The actions of a graph node are his neighbors.
   * @param state
   */
  actions(state: string): GraphNode[] {
    return this.getNode(state).Neighbors;
  }

  /**
   * Test if the current state is the goal
   * @param state
   */
  goal_test(state: string): boolean {
    return state === this.goal;
  }

  /**
   * Calc the path cost
   * @param c Initial (previous) cost
   * @param state1 From state
   * @param action Action associated to go from state1 to state2
   * @param state2 To state
   */
  pathCost(c: number, state1: string, action: GraphNode, state2: string): number {
    const childDistance = this.getChildNode(state1, state2)!.Cost;
    return c + childDistance
  }

  /**
   * Return result of the action, is just the reached node
   * @param state
   * @param action
   */
  result(state: any, action: GraphNode): GraphNode {
    return action;
  }

  private getNode(state: string): GraphNode {
    return this.graph.find(n => n.State === state);
  }

  private getChildNode(parent: string, child: string): GraphNode {
    const parentNode = this.getNode(parent);
    if (parentNode) {
      return parentNode.Neighbors.find(n => n.State === child);
    }
    return null;
  }
}
