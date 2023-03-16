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

  public findIndex(findFn: (item: T) => boolean): number {
    return this.innerArray.findIndex(findFn);
  }

  public removeByIndex(indexToRemove: number): ImmutableArray<T> {
    if (indexToRemove > this.length - 1 || indexToRemove < 0) {
      return new ImmutableArray(this.innerArray);
    }

    return new ImmutableArray([
      ...this.innerArray.slice(0, indexToRemove),
      ...this.innerArray.slice(indexToRemove + 1),
    ]);
  }
}
