import { SearchBase } from './search-base';

export class AdvancedSearch extends SearchBase {

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

}
