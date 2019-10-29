export abstract class Queue<T> {

  protected _seq: T[];

  protected constructor(items: T[]) {
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

  replace(oldItem: T, newItem: T): void {
    const index = this._seq.indexOf(oldItem);
    this._seq.splice(index, 1, newItem);
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
