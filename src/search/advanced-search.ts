import { Problem } from '../problem/problem';
import { Utility } from '../utils/utility';
import { SearchBase } from './search-base';

export class AdvancedSearch extends SearchBase {

  // Schedule function constants
  private readonly L: number = 0.005;
  private readonly K: number = 20;
  private readonly  tempLimit: number = 200;

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

  simulatedAnnealing(problem: Problem, target: number): void {
    // Initial state
    let current = problem.getInitial;
    this.debug(`Start simulated annealing with initial state: ${JSON.stringify(current)}`);
    // Delta error
    let delta_e = 0.0;

    let counter = 0;
    let t = 0;
    let currentValue = 0;

    while (true) {
      t = this.schedule(++counter);
      this.debug(`Loop n°${counter}, Schedule temperature: ${t}`);
      if (t === 0) {
        this.debug('Temperature is 0, break');
        break;
      }
      this.debug(`Get available actions for the current state:`);
      const actions = problem.actions(current);

      if (actions.length > 0) {
        actions.forEach(act => { this.debug(JSON.stringify(act)) });
      } else {
        this.warning('No actions available, break');
        break;
      }

      const action = Utility.randomOf(actions);
      this.debug(`Get random action -> ${JSON.stringify(action)}`);
      const nextState = problem.result(current, action);
      this.debug(`Calculate state: ${JSON.stringify(current)} + ${JSON.stringify(action)} action => ${JSON.stringify(nextState)} state`);
      currentValue = problem.value(current);
      this.debug(`Value found: ${currentValue}`);
      const nextValue = problem.value(nextState);
      this.debug(`Next value: ${nextValue}`);
      delta_e = nextValue - currentValue;
      this.debug(`Δ: ${delta_e}`);
      if (delta_e > 0 || AdvancedSearch.probability(delta_e / t)) {
        current = nextState;
        this.debug(`Set current state to the new one due to Δ value or probability `);
      }
    }

    this.highlighted(`
    Simulated annealing end after ${counter} iterations and temperature: ${t}.
    With value: ${currentValue} as result, target was: ${target}`);
  }

  private schedule(t: number): number {
    return t < this.tempLimit ? Math.exp(- this.L * t) * this.K : 0;
  }

  private static probability(p: number): boolean {
    return p > Utility.genStochastic(0.0, 0.1);
  }
}
