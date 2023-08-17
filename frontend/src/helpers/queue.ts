export class Queue<T> {
  length: number = 0;
  private _head: INode<T> | null = null;
  private _tail: INode<T> | null = null;

  constructor(col: Array<T> | Queue<T>) {
    if (col instanceof Array) {
      for (const item of col) {
        this.enqueue(item);
      }
    } else {
      while (col.length > 0) {
        this.enqueue(col.dequeue());
      }
    }
  }

  public enqueue(value: T): void {
    this.length++;
    let newNode: INode<T> = { value, next: null }
    if (this._head === null) {
      this._head = newNode;
    }
    if (this._tail === null) {
      this._tail = newNode;
    } else {
      this._tail.next = newNode;
      this._tail = newNode;
    }
  }
  public dequeue(): T {
    if (this._head === null) {
      throw new Error("Invalid Operation, the queue is empty.");
    }
    let result = this._head;
    this._head = this._head?.next || null;
    if (this._head === null) {
      this._tail = null;
    }
    this.length--;
    return result.value;
  }
}

interface INode<T> {
  value: T;
  next: INode<T> | null;
}