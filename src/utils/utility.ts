import { GraphPoint } from '../graph/graph';

export class Utility {

  //#region Common

  static ExplodePathInPlainText(
    index: number,
    cost: number,
    nodes: any[]): {path: string, cost: number} {
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

  static genStochastic(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  static randomOf<T>(seq: T[]): T {
    if (!seq || seq.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * seq.length);
    return seq[randomIndex];
  }

  //#endregion

  //#region Math

  static distanceOnGraph(a: GraphPoint, b: GraphPoint): number {
    /* Apply hypotenuse calculation to graph points */
    return Math.hypot((a.x - b.x), (a.y - b.y));
  }

  static eggholderFn(x: number, y: number): number {
    return - (y + 47) * Math.sin(Math.sqrt(Math.abs(x / 2 + (y + 47)))) - x * Math.sin(Math.sqrt(Math.abs(x - (y + 47))));
  }

  //#endregion

  //#region Others

  public static hideTermCursor(): void {
    process.stderr.write('\x1B[?25l');
  }

  public static showTermCursor(): void {
    process.stderr.write('\x1B[?25h');
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

  //#endregion
}
