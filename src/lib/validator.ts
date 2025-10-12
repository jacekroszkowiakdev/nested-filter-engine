import { FilterCondition, FilterGroup, FieldDefinition } from "./types.js";

export class Validator {
  private schema: Record<string, FieldDefinition>;

  constructor(schema: Record<string, FieldDefinition>) {
    this.schema = schema;
  }

  // When a filter request comes in, the Validator uses this schema to check
  // 1. Does schema[fieldName] exist? If not, the field isn't filterable
  // 2. Is the requested operator in the allowed operators array?
  // 3. Does the value match the field's type?
  validate(filter: FilterGroup | FilterCondition): void {
    if ("field" in filter && "operator" in filter) {
      this.validateCondition(filter);
    } else {
      if (filter.and) filter.and.forEach((sub) => this.validate(sub));
      if (filter.or) filter.or.forEach((sub) => this.validate(sub));
    }
  }

  private validateCondition(condition: FilterCondition): void {
    const { field, operator, value } = condition;
    const fieldDef = this.schema[field];

    // check if field is filterable and defined in schema
    if (!fieldDef || !fieldDef.filterable) {
      throw new Error(`Field '${field}' is not filterable`);
    }

    if (!fieldDef.operators.includes(operator)) {
      throw new Error(
        `Operator '${operator}' is not allowed for field '${field}'`
      );
    }

    // special rules
    switch (operator) {
      // between must have exactly 2 values in an array
      case "between":
        if (!Array.isArray(value) || value.length !== 2) {
          throw new Error(
            `Operator 'between' requires exactly two values for field '${field}'`
          );
        }
        // Validate each value in the between array
        this.validateType(fieldDef, value[0], field);
        this.validateType(fieldDef, value[1], field);
        // Validate enum values if applicable
        if (fieldDef.enumValues) {
          this.validateEnumValue(fieldDef, value[0], field);
          this.validateEnumValue(fieldDef, value[1], field);
        }
        break;

      // in must have an array value
      case "in":
        if (!Array.isArray(value)) {
          throw new Error(
            `Operator 'in' requires an array value for field '${field}'`
          );
        }
        value.forEach((v) => {
          this.validateType(fieldDef, v, field);
          if (fieldDef.enumValues) {
            this.validateEnumValue(fieldDef, v, field);
          }
        });
        break;


      // is_null and is_not_null must not have a value
      case "is_null":
      case "is_not_null":
        if (value !== undefined) {
          throw new Error(
            `Operator '${operator}' must not have a value for field '${field}'`
          );
        }
        break;

      default:
        this.validateType(fieldDef, value, field);
        if (fieldDef.enumValues && value !== null && value !== undefined) {
          this.validateEnumValue(fieldDef, value, field);
        }
    }
  }

  private validateType(fieldDef: FieldDefinition, value: any, field: string) {
    if (value === undefined || value === null) return;

    switch (fieldDef.type) {
      case "string":
        if (typeof value !== "string")
          throw new Error(`Field '${field}' must be a string`);
        break;

      case "number":
        if (typeof value !== "number")
          throw new Error(`Field '${field}' must be a number`);
        break;

      case "boolean":
        if (typeof value !== "boolean")
          throw new Error(`Field '${field}' must be a boolean`);
        break;

      case "date":
        if (isNaN(Date.parse(value)))
          throw new Error(`Field '${field}' must be a valid date string`);
        break;

      case "uuid":
        if (
          typeof value !== "string" ||
          !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            value
          )
        ) {
          throw new Error(`Field '${field}' must be a valid UUID`);
        }
        break;
    }
  }

  private validateEnumValue(fieldDef: FieldDefinition, value: any, field: string): void {
    if (!fieldDef.enumValues || value === null || value === undefined) return;

    // If the field has enumValues (like role having ['USER', 'ADMIN', 'MODERATOR']), check if the provided value is in that list
    if (!fieldDef.enumValues.includes(value)) {
      throw new Error(
        `Invalid value '${value}' for field '${field}'. ` +
        `Allowed values: ${fieldDef.enumValues.join(', ')}`
      );
    }
  }
}