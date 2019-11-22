import { Utility } from '../utils/utility';
import { Problem } from './problem';

export class NQueensProblem extends Problem {

  /**
   * Board size -> NxN
   */
  private readonly _n: number;
  /**
   * Board model
   * A state is represented as an n-element array, where the a value of r in
   * the c-th entry means there is a queen at column c, and row r, and a value
   * of -1 means that the c-th column has not been filled yet.
   */
  private readonly _boardModel: number[];

  constructor(initial: number[]) {
    super(
      initial,   // Initial board config
      null  // The goal si dynamically obtained
    );
  }

  actions(state: number[]): number[] {
    // If there aren't any unassigned column no actions are possible
    if (!state.find(n => n === -1)) {
      return [];
    }
    // Get the first empty column
    const col = state.indexOf(-1);
    const acts = [];
    // Return possible positions
    for (let r = 0; r < this._n; r++) {
      if (!this.getConflict(r, col)) {
        acts.push(r);
      }
    }
    return acts;
  }

  goal_test(state: any): boolean {
    // Board is not complete
    if (state.indexOf(-1)) {
      return false;
    }
    let goalReached = true;
    state.forEach((r: number, col: number) => {
      if (this.getConflict(r, col)) {
        goalReached = false;
        return;
      }
    });
    return goalReached;
  }

  pathCost(c: number, state1: number[], action: any, state2: any): number {
    return c + 1;
  }

  result(state: number[], action: number): any {
    const row = action;

    const col = state.indexOf(-1);
    const newState = Utility.makeCopy(state);
    newState[col] = row;
    return newState;
  }

  private getConflict(row: number, col: number): boolean {
    for (let c = 0; c < col; c++) {
      if (this.conflict(row, col, this._boardModel[c], c)) {
        return true;
      }
    }
    return false;
  }

  private conflict(row1: number, col1: number, row2: number, col2: number): boolean {
    return row1 === row2 ||
      col1 === col2 ||
      row1 - col1 === row2 - col2 ||
      row1 + col1 === row2 + col2;
  }
}
