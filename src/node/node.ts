import { Problem } from '../problem/problem';

/**
 * Tree structure implementation
 */
export class Node {

  /**
   * Node linked state
   */
  readonly state: any;
  /**
   * Link to parent node
   */
  readonly parent: Node;
  /**
   * Linked action
   */
  readonly action: any;
  /**
   * 'Cost' to go from the parent node to this one
   */
  readonly path_cost: number;

  /**
   * Dynamic cost utility used by heuristic algs
   */
  f: number = 0;

  constructor(state: any, action: any, parent: Node = null, path_cost: number = 0) {
    this.state = state;
    this.action = action;
    this.parent = parent;
    this.path_cost = path_cost;
  }

  /**
   * Given a problem expand the search tree from this node
   * In other words, create the child nodes from this one
   */
  expand(problem: Problem): Node[] {
    const actions = problem.actions(this.state);
    const nodes = [];
    actions.forEach((action: any) => {
      nodes.push(this.child_node(problem, action));
    });
    return nodes;
  }

  /**
   * Return solution as sequence of actions to solve the problem
   */
  solution(): any[] {
    return this.path().map(n => n.action);
  }

  private child_node(problem: Problem, action: any): Node {
    const next_state = problem.result(this.state, action);
    return new Node(
      next_state.State,       // Child state
      action,                 // Action
      this,                   // Parent
      problem.pathCost(this.path_cost, this.state, action, next_state.State)
    );
  }

  private path(): Node[] {
    const path_back = [];
    let node: Node = this;
    while (node) {
      path_back.push(node);
      node = node.parent;
    }
    return path_back;
  }
}
