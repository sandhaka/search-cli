import { GraphNode } from '../graph/graph';

export class Utility {
  static ExplodePathInPlainText(
    index: number,
    cost: number,
    nodes: GraphNode[]): {path: string, cost: number} {
    if (index >= nodes.length) {
      return {
        cost: 0,
        path: ''
      };
    }
    const node = nodes[index];
    const next = this.ExplodePathInPlainText(++index, node.D, nodes);
    return {
      path: `${node.State}`.concat(next.path === '' ? '' : `.${next.path}`),
      cost: cost + next.cost
    };
  }
}
