import test from 'ava';
import { NQueensProblem } from './problem/nqueens-problem';
import { Search } from './search/search';

/**
 * A collection of manual test using ava
 */

test('Try To solve the NQueens problem', t => {
  // Setup
  const problem = new NQueensProblem(5);
  const s = new Search(
    console.log,
    console.log,
    console.log,
    null,
    '',
    '');

  // Act
  s.breadthFirstSearch(problem);

  // Dummy verify
  t.assert(s.breadthFirstSearch);
});
