import { ReadonlyTypedArray, TypedArray } from "./readonlyTypedArray";

// *==============================================================
// *                     Immutable types
// *==============================================================

type Primitive = undefined | null | boolean | string | number | bigint | symbol;
type Builtin = Primitive | Function | Date | RegExp | Error;

export type Immutable<T> =
  T extends Builtin ? T :
  T extends readonly unknown[] 
    ? number extends T['length'] 
      ? ImmutableArray<T[number]> 
      : ImmutableTuple<T> :
  T extends TypedArray ? ImmutableTypedArray<T> :
  T extends Map<infer K, infer V> ? ImmutableMap<K, V> :
  T extends Set<infer M> ? ImmutableSet<M> : ImmutableObject<T>;

export type ImmutableTuple<T extends readonly unknown[]> = Immutable<T>;
export type ImmutableArray<T> = ReadonlyArray<Immutable<T>>;
export type ImmutableTypedArray<T extends TypedArray> = ReadonlyTypedArray<T>;
export type ImmutableMap<K, V> = ReadonlyMap<Immutable<K>, Immutable<V>>;
export type ImmutableSet<T> = ReadonlySet<Immutable<T>>;
export type ImmutableObject<T> = { readonly [K in keyof T]: Immutable<T[K]> };

// *==============================================================
// *                     Mutable types
// *==============================================================

export type Mutable<T> =
  T extends Builtin ? T :
  T extends ReadonlyArray<infer U> ? Mutable<U>[] :
  T extends TypedArray ? MutableTypedArray<T> :
  T extends ReadonlyMap<infer K, infer V> ? MutableMap<K, V> :
  T extends ReadonlySet<infer M> ? MutableSet<M> : MutableObject<T>;

export type MutableArray<T> = T[];
export type MutableTypedArray<T> = T;
export type MutableMap<K, V> = Map<Mutable<K>, Mutable<V>>;
export type MutableSet<T> = Set<Mutable<T>>;
export type MutableObject<T> = { -readonly [K in keyof T]: Mutable<T[K]> };


export { }

