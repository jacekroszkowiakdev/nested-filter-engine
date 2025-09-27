import "reflect-metadata";
import { FILTER_FIELDS_METADATA } from "./metadata.js";
import { FieldType, FilterOperator, FilterFieldMetadata } from "../lib/types.js";

export function Filterable(
  operators: FilterOperator[],
  type: FieldType = 'string',
  enumValues?: string[]
) {
  return (target: any, propertyKey: string) => {
    const existingMetadata: Record<string, FilterFieldMetadata> =
      Reflect.getMetadata(FILTER_FIELDS_METADATA, target.constructor) || {};

    existingMetadata[propertyKey] = {
      type,
      operators,
      enumValues,
    };

    Reflect.defineMetadata(FILTER_FIELDS_METADATA, existingMetadata, target.constructor);
  };
}