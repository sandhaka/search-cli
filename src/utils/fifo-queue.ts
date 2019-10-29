import { Queue } from './queue';
import { Utility } from './utility';

export class FifoQ<T> extends Queue<T> {

  private readonly _compareFn: (a:T, b:T) => number;
  private readonly _autoSorter: boolean = false;

  constructor(items: T[], compareFn: (a:T, b:T) => number = null, autoSorter: boolean = false) {
    super(items);
    this._compareFn = compareFn;
    this._autoSorter = autoSorter;
  }

  enqueue(item: T): void {
    this._seq.push(Utility.makeCopy(item));
    if (this._autoSorter) {
      this.sort(this._compareFn);
    }
  }

  dequeue(): T {
    if (this._seq.length === 0) {
      return null;
    }
    const itemCopied = Utility.makeCopy(this._seq[0]);
    this._seq.splice(0,1);
    return itemCopied;
  }

}
