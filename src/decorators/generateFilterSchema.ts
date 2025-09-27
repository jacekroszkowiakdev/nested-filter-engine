import { FieldDefinition, FilterSchema, FilterFieldMetadata } from "../lib/types";
import { FILTER_FIELDS_METADATA } from "./metadata.js";


export function generateFilterSchema(target: Function): FilterSchema {
    const metadata = Reflect.getMetadata(FILTER_FIELDS_METADATA, target) as Record<string, FilterFieldMetadata>  || {};

    const schema: FilterSchema = {};

    for (const [fieldName, options] of Object.entries(metadata)) {
        schema[fieldName] = {
            name: fieldName,
            type: options.type ?? 'string',
            filterable: true,
            operators: options.operators,
            enumValues: options.enumValues,
        } as FieldDefinition;
    }

    return schema;
}