export abstract class SearchBase {
  /**
   * Logging actions
   */
  protected readonly debug: (text: string) => void;
  protected readonly warning: (text: string) => void;
  protected readonly highlighted: (text: string) => void;

  /**
   * Commander instance
   */
  protected readonly program: any;

  /**
   * Goal config
   */
  protected readonly start: any;
  protected readonly target: any;

  protected constructor(
    debug: (text: string) => void,
    warning: (text: string) => void,
    highlighted: (text: string) => void,
    program: any,
    start: string,
    target: string
  ) {
    this.debug = debug;
    this.warning = warning;
    this.highlighted = highlighted;
    this.program = program;
    this.start = start;
    this.target = target;
  }
}
