import { GraphNode } from '../graph/graph';
import { Problem } from './problem';

export class FindingPathProblem extends Problem {

  private readonly graph: GraphNode[];

  constructor(initial: string, goal: string, graph: GraphNode[]) {
    super(initial, goal);
    this.graph = graph;
  }

  get getInitial(): string {
    return this.initial;
  }

  get getInitialNode(): GraphNode {
    return this.getNode(this.initial);
  }

  actions(state: string): GraphNode[] {
    return this.getNode(state).Neighbors;
  }

  goal_test(state: string): boolean {
    return state === this.goal;
  }

  pathCost(c: number, state1: string, action: GraphNode, state2: string): number {
    const childDistance = this.getChildNode(state1, state2)!.D;
    return c + childDistance
  }

  result(state: any, action: GraphNode): GraphNode {
    return action;
  }

  private getNode(state: string): GraphNode {
    return this.graph.find(n => n.State === state);
  }

  private getChildNode(parent: string, child: string): Partial<GraphNode> {
    const parentNode = this.getNode(parent);
    if (parentNode) {
      return parentNode.Neighbors.find(n => n.State === child);
    }
    return null;
  }
}
