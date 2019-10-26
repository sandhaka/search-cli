export interface GraphNode {
  State: string,
  D: number,
  Neighbors: GraphNode[]
}

export class Graph {

  private readonly dict: GraphNode[];

  protected constructor(sourceGraph: GraphNode[], directed: boolean = false) {
    this.dict = sourceGraph;
    this.graphInit(sourceGraph, directed);
  }

  static make(graph: GraphNode[]): Graph {
    return new Graph(graph, true);
  }

  static makeUndirected(graph: GraphNode[]): Graph {
    return new Graph(graph, false);
  }

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
        D: 0,
        Neighbors: [
          {
            State: ANode.State,
            D: BNode.D,
            Neighbors: []
          }
        ]
      });
    } else if (!d.Neighbors.find(i => i.State === ANode.State)) {
      d.Neighbors.push({
        State: ANode.State,
        D: BNode.D,
        Neighbors: []
      });
    }
  }
}
