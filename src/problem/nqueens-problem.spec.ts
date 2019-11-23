import test from 'ava';
import { NQueensProblem } from './nqueens-problem';

test('Create NQueens Problem', t => {
  const problem = new NQueensProblem(4);

  t.assert(problem.getInitial);
  t.assert(problem.getInitial.length === 4);
  t.assert(problem);
});
