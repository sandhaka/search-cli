import test from 'ava';
import { NQueensProblem } from './nqueens-problem';

test('Create NQueens Problem', t => {
  const problem = new NQueensProblem([1,3,4,5,2,7,6,5]);
  t.assert(problem);
});
