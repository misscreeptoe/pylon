import { EventEmitter } from 'events';

interface EventMap {
  [key: string]: (...args: unknown[]) => void;
}
type EventKey<T extends EventMap> = Extract<keyof T, string>;

export class TypedEventEmitter<E extends EventMap> {
  private emitter = new EventEmitter();

  public emit<K extends EventKey<E>>(
    eventName: K,
    ...eventArg: Parameters<E[K]>
  ): boolean {
    return this.emitter.emit(eventName, ...eventArg);
  }

  public once<K extends EventKey<E>>(eventName: K, handler: E[K]): this {
    this.emitter.once(eventName, handler);
    return this;
  }

  public on<K extends EventKey<E>>(eventName: K, handler: E[K]): this {
    this.emitter.on(eventName, handler);
    return this;
  }

  public off<K extends EventKey<E>>(eventName: K, handler: E[K]): this {
    this.emitter.off(eventName, handler);
    return this;
  }
}
