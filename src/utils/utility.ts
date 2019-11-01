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
    const next = this.ExplodePathInPlainText(++index, node.Cost, nodes);
    return {
      path: `${node.State}`.concat(next.path === '' ? '' : `.${next.path}`),
      cost: cost + next.cost
    };
  }

  static makeCopy(object: any): any {
    if (Array.isArray(object)) {
      const copy = [];
      const obj = object as any[];
      obj.forEach((i: any) => {
        copy.push(this.makeCopy(i));
      });
      return copy;
    } else if (this.isObject(object)) {
      const copy = {};
      Object.keys(object).forEach((prop: string) => {
        if (object.hasOwnProperty(prop)) {
          copy[prop] = this.makeCopy(object[prop]);
        }
      });
      return copy;
    } else {
      return object;
    }
  }

  static isObject(obj: any): boolean {
    return obj != null && obj.constructor.name === 'Object';
  }

  static get header(): string {
    return `
  
                          _
                       _ooOoo_
                      o8888888o
                      88" . "88
                      (| -_- |)
                      O\\  =  /O
                   ____/\`---'\\____
                 .'  \\\\|     |//  \`.
                /  \\\\|||  :  |||//  \\
               /  _||||| -:- |||||_  \\
               |   | \\\\\\  -  /'| |   |
               | \\_|  '\\'---'//  |_/ |
               \\  .-\\__ \`-. -'__/-.  /
             ___\`. .'  /--.--\\  \`. .'___
          ."" '<  \`.___\\_<|>_/___.' _> \\"".
         | | :  '- \\'. ;'. _/; .'/ /  .' ; |
         \\  \\ '-.   \\_\\_'. _.'_/_/  -' _.' /
==========='-.'___'-.__\\ \\___  /__.-'_.'_.-'================
                       '=--=-'                    hjw
______________________________________________________________ 
                      Waheguru Ji
______________________________________________________________                         
`;
  }
}
