export class ImmutableArray<T> implements Iterable<T> {
  private innerArray: T[];

  constructor(initialElements = []) {
    this.innerArray = initialElements;
  }
  public get length(): number {
    return this.innerArray.length;
  }

  [Symbol.iterator](): Iterator<T, any, undefined> {
    return this.innerArray[Symbol.iterator]();
  }

  public get(index: number): T | null {
    return this.innerArray[index] ?? null;
  }

  public push(item: T): ImmutableArray<T> {
    return new ImmutableArray([...this.innerArray, item]);
  }

  public find(findFn: (item: T) => boolean): T {
    return this.innerArray.find(findFn);
  }

  public findIndex(findFn: (item: T) => boolean): number {
    return this.innerArray.findIndex(findFn);
  }

  public reduce<U>(reduceFn: (accum: U, item: T) => U, init: U): U {
    return this.innerArray.reduce(reduceFn, init);
  }

  public removeByIndex(indexToRemove: number): ImmutableArray<T> {
    if (this.isOutOfBounds(indexToRemove)) {
      return new ImmutableArray(this.innerArray);
    }

    return new ImmutableArray([
      ...this.innerArray.slice(0, indexToRemove),
      ...this.innerArray.slice(indexToRemove + 1),
    ]);
  }

  public replaceByIndex(indexToReplace: number, item: T): ImmutableArray<T> {
    if (this.isOutOfBounds(indexToReplace)) {
      return new ImmutableArray(this.innerArray);
    }

    return new ImmutableArray([
      ...this.innerArray.slice(0, indexToReplace),
      item,
      ...this.innerArray.slice(indexToReplace + 1),
    ]);
  }

  private isOutOfBounds(index: number): boolean {
    return index > this.length - 1 || index < 0;
  }
}
