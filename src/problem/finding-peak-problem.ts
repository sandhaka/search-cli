import { Problem } from './problem';

export interface Direction {
  label: string;
  value: { x: number, y: number }
}

/**
 * Finding maximum peak in a 2D area problem
 */
export class FindingPeakProblem extends Problem {

  private readonly directions: Direction[] = [
    {
      label: 'W',
      value: {
        x: -1,
        y: 0
      }
    },
    {
      label: 'NW',
      value: {
        x: -1,
        y: 1
      }
    },
    {
      label: 'N',
      value: {
        x: 0,
        y: 1
      }
    },
    {
      label: 'NE',
      value: {
        x: 1,
        y: 1
      }
    },
    {
      label: 'E',
      value: {
        x: 1,
        y: 0
      }
    },
    {
      label: 'SE',
      value: {
        x: 1,
        y: -1
      }
    },
    {
      label: 'S',
      value: {
        x: 0,
        y: -1
      }
    },
    {
      label: 'SW',
      value: {
        x: -1,
        y: -1
      }
    }
  ];
  private readonly area: number[][];
  private current: {x: number, y: number};
  private readonly gMaxX: number;
  private readonly gMaxY: number;

  constructor(area: number[][], initialPosition: {x:number, y:number} = {x: 0, y: 0}) {
    super(initialPosition, null);
    this.area = area;
    this.current = initialPosition;
    this.gMaxX = this.area.length - 1;
    this.gMaxY = this.area[0].length -1;
  }

  actions(state: any): Direction[] {
    const allowed_actions = [];
    this.directions.forEach((d: Direction) => {
      const nextPos = {
        x: this.current.x + d.value.x,
        y: this.current.y + d.value.y
      };
      if (nextPos.x >= 0 &&
        nextPos.y >= 0 &&
        nextPos.x <= this.gMaxX &&
        nextPos.y <= this.gMaxY) {
        allowed_actions.push(d);
      }
    });
    return allowed_actions;
  }

  get getInitial(): {x:number, y:number} {
    return this.initial;
  }

  get getInitialNode(): any {
    // This is not used with simulated annealing
    throw 'Not usable for this problem';
  }

  goal_test(state: any): boolean {
    // This is not used with simulated annealing
    throw 'Not usable for this problem';
  }

  pathCost(c: number, state1: any, action: any, state2: any): number {
    return 1;
  }

  result(state: {x:number, y:number}, action: Direction): {x:number, y:number} {
    return {
      x: state.x + action.value.x,
      y: state.y + action.value.y
    };
  }
}
