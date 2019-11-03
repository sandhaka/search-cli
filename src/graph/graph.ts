
export interface GraphNode {
  /**
   * State
   */
  State: string,
  /**
   * Cost of the link
   */
  Cost: number,
  /**
   * Connected nodes
   */
  Neighbors: GraphNode[]
}

export interface GraphPoint {
  x: number;
  y: number;
}

export class Graph {

  private readonly dict: GraphNode[];

  protected constructor(sourceGraph: GraphNode[], directed: boolean = false) {
    this.dict = sourceGraph;
    this.graphInit(sourceGraph, directed);
  }

  /**
   * Make a directed graph (no actions needed),
   * directed graph is the needed input
   * @param graph
   */
  static make(graph: GraphNode[]): Graph {
    return new Graph(graph, true);
  }

  /**
   * Create the "backward" connections of the graph
   * @param graph
   */
  static makeUndirected(graph: GraphNode[]): Graph {
    return new Graph(graph, false);
  }

  /**
   * Retrieve the graph nodes
   */
  get nodes(): GraphNode[] {
    return this.dict;
  }

  private graphInit(sourceGraph: GraphNode[], directed: boolean) {
    if (!directed) {
      sourceGraph.forEach((node: GraphNode) => {
        node.Neighbors!.forEach((childNode: GraphNode) => {
          this.connect(node, childNode);
        });
      });
    }
  }

  private connect(ANode: GraphNode, BNode: GraphNode) {
    const d = this.dict.find(i => i.State === BNode.State);
    if (!d) {
      this.dict.push({
        State: BNode.State,
        Cost: 0,
        Neighbors: [
          {
            State: ANode.State,
            Cost: BNode.Cost,
            Neighbors: []
          }
        ]
      });
    } else if (!d.Neighbors.find(i => i.State === ANode.State)) {
      d.Neighbors.push({
        State: ANode.State,
        Cost: BNode.Cost,
        Neighbors: []
      });
    }
  }
}
