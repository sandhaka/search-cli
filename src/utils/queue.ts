import { Utility } from './utility';

export class Queue<T> {

  private _seq: T[];
  private readonly _compareFn: (a:T, b:T) => number;
  private readonly _autoSorter: boolean = false;

  constructor(items: T[], compareFn: (a:T, b:T) => number = null, autoSorter: boolean = false) {
    this._compareFn = compareFn;
    this._autoSorter = autoSorter;
    this._seq = [...items];
  }

  get length(): number {
    return this._seq.length;
  }

  find(predicate: (value: T, index: number, obj: T[]) => boolean): T {
    return this._seq.find(predicate);
  }

  clear(): void {
    this._seq = [];
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

  sort(compareFn: (a:T, b:T) => number): void {
    this._seq.sort(compareFn);
  }

  tail(): T {
    if (this._seq.length === 0) {
      return null;
    }
    return this._seq[0];
  }

  head(): T {
    if (this._seq.length === 0) {
      return null;
    }
    return this._seq[this._seq.length - 1];
  }
}
