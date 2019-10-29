import { Queue } from './queue';
import { Utility } from './utility';

export class FiloQ<T> extends Queue<T> {

  pop(): T {
    return this._seq.pop();
  }

  push(item: T): void {
    this._seq.push(Utility.makeCopy(item));
  }

}
