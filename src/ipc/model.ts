export type IpcListener<T = never> = (payload: T) => void;

export type IpcUnsubscribe = () => void;
