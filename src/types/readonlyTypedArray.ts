export type TypedArray =
  | UintArray
  | IntArray
  | FloatArray;

export type UintArray =
  | Uint8Array
  | Uint16Array
  | Uint32Array
  | Uint8ClampedArray
  | BigUint64Array;

export type IntArray =
  | Int8Array
  | Int16Array
  | Int32Array
  | BigInt64Array;
  
export type FloatArray =
  | Float32Array
  | Float64Array;


type TypedArrayValue<T extends TypedArray> =
  T extends BigInt64Array | BigUint64Array
    ? bigint
    : number;
    
type MutableTypedArrayMethods =
  | "copyWithin"
  | "fill"
  | "reverse"
  | "set"
  | "sort";

export type ReadonlyTypedArray<T extends TypedArray> =
  Omit<T, MutableTypedArrayMethods> & {
    readonly [index: number]: TypedArrayValue<T>;
  };
