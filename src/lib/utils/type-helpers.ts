type Join<K, P> = K extends string | number
  ? P extends string | number
  ? `${K}${"" extends P ? "" : "."}${P}`
  : never
  : never;

export type Paths<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
  ? {
    [K in keyof T]-?: K extends string | number
    ? `${K}` | Join<K, Paths<T[K], Prev[D]>>
    : never;
  }[keyof T]
  : "";

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export type ConstructorObject<T, D extends keyof T = never> =
  Omit<T, D> & Partial<Pick<T, D>>;

export function assignDefaults<T>(target: T, source: Partial<T>) {
  (Object.keys(source) as Array<keyof T>).forEach((key) => {
    const value = source[key];
    if (value !== undefined) target[key] = value;
  });
}
