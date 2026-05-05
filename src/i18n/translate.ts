import { type Dict, type Locale, dictionaries } from "./config";

type Path<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${Path<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

type PluralBase<T> = T extends object
  ? {
      [K in keyof T]: K extends `${infer Base}_one`
        ? T extends Record<`${Base}_other`, string>
          ? Base
          : never
        : never;
    }[keyof T]
  : never;

type PluralPath<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${PluralPath<T[K]>}` | `${K}.${PluralBase<T[K]>}`
          : never
        : never;
    }[keyof T]
  : never;

export type TKey = Path<Dict> | PluralPath<Dict>;

interface InterpolateValues {
  [k: string]: string | number;
}

function interpolate(template: string, values?: InterpolateValues): string {
  if (!values) return template;
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) =>
    values[k] !== undefined ? String(values[k]) : `{{${k}}}`,
  );
}

function resolve(dict: Dict, key: string): string | undefined {
  const segments = key.split(".");
  let cursor: unknown = dict;
  for (const seg of segments) {
    if (cursor && typeof cursor === "object" && seg in cursor) {
      cursor = (cursor as Record<string, unknown>)[seg];
    } else {
      return undefined;
    }
  }
  return typeof cursor === "string" ? cursor : undefined;
}

export function makeT(locale: Locale) {
  const dict = dictionaries[locale];
  return function t(key: TKey, values?: InterpolateValues): string {
    // Plural support: tries `${key}_one` / `${key}_other` based on values.count.
    if (values && typeof values.count === "number") {
      const suffix = values.count === 1 ? "_one" : "_other";
      const pluralKey = `${key}${suffix}` as string;
      const resolved = resolve(dict, pluralKey);
      if (resolved) return interpolate(resolved, values);
    }
    const direct = resolve(dict, key);
    if (direct) return interpolate(direct, values);
    return key;
  };
}

export type Translator = ReturnType<typeof makeT>;
