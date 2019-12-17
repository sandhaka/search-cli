import { Problem } from '../problem/problem';
import { SearchBase } from './search-base';

export class AdvancedSearch extends SearchBase {

  // Schedule function constants
  private readonly L: number = 0.005;
  private readonly K: number = 20;

  constructor(
    debug: (text: string) => void,
    warning: (text: string) => void,
    highlighted: (text: string) => void,
    program: any,
    start: string,
    target: string
  ) {
    super(debug, warning, highlighted, program, start, target);
  }

  simulatedAnnealing(problem: Problem): any {
    // Initial state
    let current = problem.getInitial;
    // Delta error
    let delta_e = 0.0;

    let counter = 0;

    while (true) {
      const t = this.schedule(++counter);
      if (t === 0) {
        break;
      }
      // Get available actions for the current state
      const actions = problem.actions(current);
      if (actions.length === 0) {
        break;
      }
      const action = actions[0]; // TODO RANDOM CHOICE
      const nextState = problem.result(current, action);
      const currentValue = problem.value(current);
      const nextValue = problem.value(nextState);
      delta_e = nextValue - currentValue;
      //if delta_e > 0 ||       // TODO PROB. EVAL.
      current = nextState;
    }

    return current;
  }

  private schedule(c: number): number {
    return Math.pow(this.L * c, 2) * this.K;
  }
}
