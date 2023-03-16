import { BehaviorSubject, distinctUntilChanged, map, Observable } from 'rxjs';

export type Selector<T, R> = (state: T) => R;

export abstract class Store<T> {
  private readonly stateSubject: BehaviorSubject<T>;
  private readonly stateObservable: Observable<T>;

  constructor(initialState?: T | null) {
    this.stateSubject = new BehaviorSubject(initialState);
    this.stateObservable = this.stateSubject.asObservable();
  }

  protected get state(): T {
    return this.stateSubject.getValue();
  }

  protected get state$(): Observable<T> {
    return this.stateObservable;
  }

  protected select<R>(selector: Selector<T, R>): Observable<R> {
    return this.state$.pipe(map(selector), distinctUntilChanged());
  }

  protected setState<K extends keyof T, E extends Partial<Pick<T, K>>>(
    setStateFn: (state: T) => E,
  ): void {
    const reducedState = setStateFn(this.state);

    const newState = {
      ...this.state,
      ...reducedState,
    };

    this.stateSubject.next(newState);
  }
}
