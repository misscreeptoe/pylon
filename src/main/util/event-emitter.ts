import { EventEmitter } from 'events';

interface EventMapRecord {
  [key: string]: unknown[];
}
type EventKey<T extends EventMapRecord> = keyof T & string;

type EventHandler<T> = (args: T) => void;

export class TypedEventEmitter<E extends EventMapRecord> {
  private emitter = new EventEmitter();

  public emit<K extends EventKey<E>>(eventName: K, ...eventArg: E[K]) {
    this.emitter.emit(eventName, ...eventArg);
  }

  public once<K extends EventKey<E>>(
    eventName: K,
    handler: EventHandler<E[K]>,
  ) {
    this.emitter.once(eventName, handler);
  }

  public on<K extends EventKey<E>>(eventName: K, handler: EventHandler<E[K]>) {
    this.emitter.on(eventName, handler);
  }

  public off<K extends EventKey<E>>(eventName: K, handler: EventHandler<E[K]>) {
    this.emitter.off(eventName, handler);
  }
}
