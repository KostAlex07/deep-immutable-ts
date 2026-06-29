import { Immutable, ImmutableArray, ImmutableMap, ImmutableObject, ImmutableSet, ImmutableTypedArray } from "../types/immutable";
import { TypedArray } from "../types/readonlyTypedArray";

// *==============================================================
// *                     deepFreeze
// *==============================================================

export interface DeepFreezeOptions {
  ignoredConstructors?: (new (...args: any[]) => any)[];
}

export function deepFreeze<T>(obj: T, options?: DeepFreezeOptions): Immutable<T> {
  return deepFreezeFunc(obj, options);
}

function deepFreezeFunc(obj: any, options?: DeepFreezeOptions): any {
  if (Array.isArray(obj)) {
    Object.freeze(obj);
    return obj.map(o => deepFreezeFunc(o, options));
  }

  const isIgnored = options?.ignoredConstructors?.some(ctor => obj instanceof ctor) ?? false;
  
  if (obj != null && obj instanceof Object && !Object.isFrozen(obj)
    && !isIgnored && !isArrayBuffer(obj) && !isTypedArray(obj)) {

    for (const key of Object.keys(obj)) {
      deepFreezeFunc(obj[key], options);
    }

    return Object.freeze(obj);
  }

  return obj;
};

function isTypedArray(value: unknown): value is TypedArray {
  return ArrayBuffer.isView(value)
    && !(value instanceof DataView);
}

function isArrayBuffer(value: unknown): value is ArrayBuffer {
  return value instanceof ArrayBuffer;
}

// *==============================================================
// *                     MutableCopy
// *==============================================================

const defaultCloneDeep = <T>(obj: T): T => {
  if (typeof structuredClone === "function") {
    return structuredClone(obj);
  }

  throw new Error(
    "structuredClone is not available. Provide a custom clone function."
  );
};

type CloneFunc = <T>(value: T) => T;

export interface MutableCopy {
  <T extends TypedArray>(value: ImmutableTypedArray<T>, clone?: CloneFunc): T; 
  <T>(value: ImmutableArray<T>, clone?: CloneFunc): T[];
  <K, V>(value: ImmutableMap<K, V>, clone?: CloneFunc): Map<K, V>;
  <T>(value: ImmutableSet<T>, clone?: CloneFunc): Set<T>;
  <T>(value: ImmutableObject<T>, clone?: CloneFunc): T;
}

export function createMutableCopier(clone: CloneFunc): MutableCopy {
  return ((value: CloneFunc) => clone(value)) as MutableCopy; 
}

export const mutableCopy = createMutableCopier(defaultCloneDeep);

