import { describe, it, expect } from "vitest";

import { Validator } from '../../src/lib/validator.js';
import { generateFilterSchema } from "../../src/decorators/generateFilterSchema.js";
import { UserFilter } from '../../src/api/models/userFilter.js';
import type { FilterOperator } from "../../src/lib/types.js";

const schema = generateFilterSchema(UserFilter);
const validator = new Validator(schema);

describe("Validator", () => {

  describe("Field Access Control", () => {
    it("should accept filterable fields", () => {
      expect(() =>
        validator.validate({ field: "email", operator: "contains", value: "example" })
      ).not.toThrow();
    });

    it("should reject non-filterable fields", () => {
      expect(() =>
        validator.validate({
          field: "updatedAt",
          operator: "eq",
          value: "2025-01-01",
        })
      ).toThrowError("Field 'updatedAt' is not filterable");
    });
  });

  describe("Operator Validation", () => {
    it("should accept valid operators for a field", () => {
      expect(() =>
        validator.validate({ field: "age", operator: "eq", value: 30 })
      ).not.toThrow();
    });

    it("should reject invalid operators for a field", () => {
      expect(() =>
        validator.validate({
          field: "email",
          operator: "gt",
          value: "30",
        })
      ).toThrowError("Operator 'gt' is not allowed for field 'email'");
    });

    describe("'between' operator", () => {
      it("should accept correct number of values (array of 2)", () => {
        expect(() =>
          validator.validate({
            field: "age",
            operator: "between",
            value: [20, 30],
          })
        ).not.toThrow();
      });

      it("should reject incorrect number of values", () => {
        expect(() =>
          validator.validate({
            field: "age",
            operator: "between",
            value: [20],
          })
        ).toThrowError("Operator 'between' requires exactly two values for field 'age'");
      });

      it("should reject non-array value", () => {
        expect(() =>
          validator.validate({
            field: "age",
            operator: "between",
            value: "20,30",
          })
        ).toThrowError("Operator 'between' requires exactly two values for field 'age'");
      });

      it("should reject when used with enum fields", () => {
        expect(() =>
          validator.validate({
            field: "role",
            operator: "between",
            value: ["ADMIN", "INVALID"],
          })
        ).toThrowError("Operator 'between' is not allowed for field 'role'");
      });
    });

    describe("'in' operator", () => {
      it("should accept valid enum values", () => {
        expect(() =>
          validator.validate({
            field: "role",
            operator: "in",
            value: ["ADMIN", "USER"],
          })
        ).not.toThrow();
      });

      it("should reject invalid enum values", () => {
        expect(() =>
          validator.validate({
            field: "role",
            operator: "in",
            value: ["ADMIN", "INVALID"],
          })
        ).toThrowError("Invalid value 'INVALID' for field 'role'");
      });
    });

    describe("'is_null' operator", () => {
      it("should accept without value", () => {
        expect(() =>
          validator.validate({ field: "email", operator: "is_null" })
        ).not.toThrow();
      });

      it("should reject when value is provided", () => {
        expect(() =>
          validator.validate({ field: "email", operator: "is_null", value: "oops" })
        ).toThrowError("Operator 'is_null' must not have a value for field 'email'");
      });
    });

    describe("'is_not_null' operator", () => {
      it("should accept without value", () => {
        expect(() =>
          validator.validate({ field: "email", operator: "is_not_null" })
        ).not.toThrow();
      });

      it("should reject when value is provided", () => {
        expect(() =>
          validator.validate({ field: "email", operator: "is_not_null", value: "oops" })
        ).toThrowError("Operator 'is_not_null' must not have a value for field 'email'");
      });
    });
  });

  describe("Type Validation", () => {
    describe("Number type", () => {
      it("should accept valid number", () => {
        expect(() =>
          validator.validate({ field: "age", operator: "eq", value: 25 })
        ).not.toThrow();
      });

      it("should reject string instead of number", () => {
        expect(() =>
          validator.validate({ field: "age", operator: "eq", value: "25" })
        ).toThrowError("Field 'age' must be a number");
      });

      it("should accept numeric values in 'between' operator", () => {
        expect(() =>
          validator.validate({
            field: "age",
            operator: "between",
            value: [20, 30],
          })
        ).not.toThrow();
      });
    });

    describe("UUID type", () => {
      it("should accept valid UUID", () => {
        expect(() =>
          validator.validate({
            field: "id",
            operator: "eq",
            value: "123e4567-e89b-12d3-a456-426614174000",
          })
        ).not.toThrow();
      });

      it("should reject invalid UUID format", () => {
        expect(() =>
          validator.validate({
            field: "id",
            operator: "eq",
            value: "not-a-uuid",
          })
        ).toThrowError("Field 'id' must be a valid UUID");
      });
    });

    describe("Boolean type", () => {
      it("should accept valid boolean", () => {
        expect(() =>
          validator.validate({ field: "isActive", operator: "eq", value: true })
        ).not.toThrow();
      });

      it("should reject string instead of boolean", () => {
        expect(() =>
          validator.validate({ field: "isActive", operator: "eq", value: "yes" })
        ).toThrowError("Field 'isActive' must be a boolean");
      });
    });

    describe("Enum type", () => {
      it("should accept valid enum value", () => {
        expect(() =>
          validator.validate({
            field: "role",
            operator: "eq",
            value: "ADMIN",
          })
        ).not.toThrow();
      });

      it("should reject invalid enum value", () => {
        expect(() =>
          validator.validate({
            field: "role",
            operator: "eq",
            value: "INVALID",
          })
        ).toThrowError("Invalid value 'INVALID' for field 'role'");
      });
    });
  });

  describe("Complex Filter Groups", () => {
    it("should validate nested 'and' groups", () => {
      const group = {
        and: [
          { field: "age", operator: "gte" as FilterOperator, value: 20 },
          { field: "isActive", operator: "eq" as FilterOperator, value: true },
        ],
      };
      expect(() => validator.validate(group)).not.toThrow();
    });

    it("should validate nested 'and/or' groups", () => {
      const group = {
        and: [
          { field: "age", operator: "eq", value: 25 },
          {
            or: [
              { field: "isActive", operator: "eq" as FilterOperator, value: true },
              { field: "role", operator: "eq" as FilterOperator, value: "ADMIN" },
            ],
          },
        ],
      };
      expect(() => validator.validate(group)).not.toThrow();
    });
  });

});