import test from 'ava';
import { Console } from 'inspector';
import { NQueensProblem } from './problem/nqueens-problem';
import { Search } from './search/search';
import { Utility } from './utils/utility';

/**
 * A collection of manual test using ava
 */

test('Try To solve the NQueens problem with Breadth First Search', t => {
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
