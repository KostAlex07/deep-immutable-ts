# deep-immutable-ts

Deep immutable TypeScript types with runtime helpers.

The library provides:

- **Deep immutable types** (`Immutable<T>`)
- **Runtime deep freezing**
- **Mutable copies** of immutable objects

✅ Zero runtime dependencies.

## Requirements

- TypeScript 5+
- Node.js 18+ (default `structuredClone()` implementation)

If your runtime doesn't provide `structuredClone`, you can configure any cloning function (for example `lodash.cloneDeep`).

## Installation

```bash
npm install deep-immutable-ts
```

## Why?

JavaScript provides `Object.freeze()`, but it only protects objects at runtime.

Likewise, `Readonly<T>` only provides compile-time type safety.

`deep-immutable-ts` combines both approaches by providing recursive immutable types and runtime deep freezing.


## Immutable types

Convert any type into its deep immutable equivalent.

```ts
import { Immutable } from "deep-immutable-ts";

interface ISize { 
  width: number;
  height: number;
}

interface IPoint {
  x: number;
  y: number;
}

interface IImage {
  name: string;
  imageType: 'jpeg' | 'png';
  data: Uint8Array;
}

interface IMetaData {
  imageIndex: number;
  size: ISize;
  color: string;
  positions: IPoint[];
}

interface IImageInfo {
  image: IImage;
  metaData: IMetaData;
}

type ImmutableImageInfo = Immutable<IImageInfo>;
```

Result:

```ts
type ImmutableImageInfo = {
  readonly image: {
    readonly name: string;
    readonly imageType: "jpeg" | "png";
    readonly data: ReadonlyTypedArray<Uint8Array>;
  };

  readonly metaData: {
    readonly imageIndex: number;

    readonly size: {
      readonly width: number;
      readonly height: number;
    };

    readonly color: string;

    readonly positions: readonly {
      readonly x: number;
      readonly y: number;
    }[];
  };
};
```


## deepFreeze

Recursively freezes an object and returns its immutable type.

```ts
import { deepFreeze } from "deep-immutable-ts";

const imageInfo = loadImageInfo();

imageInfo.image.name = "New name";
imageInfo.metaData.positions.push(point);   // ✅ allowed

const immutableImageInfo = deepFreeze(imageInfo);

immutableImageInfo.image.name = "New name"; // ❌ TypeScript error
immutableImageInfo.metaData.positions.push(point); // ❌ TypeScript error

(immutableImageInfo as IImageInfo).image.name = "Test"; 
// TypeError: Cannot assign to read only property
(immutableImageInfo as IImageInfo).metaData.positions.push(point);
// TypeError: Cannot assign to read only property
```

## DeepFreezeOptions

Some objects cannot be frozen because they rely on internal mutable state (for example `Observable` from `rxjs`).

```ts
import { Observable } from "rxjs";
import {
  deepFreeze as deepFreezeLib,
  DeepFreezeOptions
} from "deep-immutable-ts";

const deepFreezeOptions: DeepFreezeOptions = {
  ignoredConstructors: [Observable]
};

export function deepFreeze<T>(value: T): Immutable<T> {
  return deepFreezeLib(value, deepFreezeOptions);
}

```
Objects whose constructor is listed in `ignoredConstructors` are left unchanged while the rest of the object graph is frozen.

## Mutable copies

Sometimes a mutable copy is required.

```ts
import { mutableCopy } from "deep-immutable-ts";

const editableImage = mutableCopy(imageService.imageInfo);
//The returned object is a deep mutable clone.

editableImage.image.name = "New name";
editableImage.metaData.positions.push({ x: 10, y: 20 });
```

The original immutable object remains frozen and unchanged.

## Custom clone function

`mutableCopy()` uses `structuredClone()` by default.

If your project already uses another cloning library (for example `lodash.cloneDeep`), create a copier once:

```ts
import cloneDeep from "lodash.clonedeep";
import { createMutableCopier } from "deep-immutable-ts";

export const mutableCopy = createMutableCopier(cloneDeep);
```

Then use it everywhere:

```ts
const editable = mutableCopy(imageService.imageInfo);
```


## Service example

A common usage pattern is to store immutable state inside a service.

```ts
import { Immutable, deepFreeze } from "deep-immutable-ts";

export class ImageService {

  private _imageInfo: Immutable<IImageInfo> | undefined;

  get imageInfo(): Immutable<IImageInfo> | undefined {
    return this._imageInfo;
  }

  updateImageInfo(imageInfo: IImageInfo): void {
    this._imageInfo = deepFreeze(imageInfo);
  }

}
```

Consumers cannot accidentally modify the state.


## Supported types

The library supports:

- Objects
- Arrays
- Tuples
- Maps
- Sets
- Typed arrays
- Primitive values
- Date
- RegExp
- Error

---

## Typed arrays

```ts
interface IData {
  pixels: Uint8Array;
}

type ImmutableData = Immutable<IData>;
```

`pixels` keeps the Uint8Array API while all mutating methods (set, fill, sort, etc.) are removed from the type.

---


## License

MIT

