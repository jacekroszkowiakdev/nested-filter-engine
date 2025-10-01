import { describe, it, expect } from "vitest";
import { QueryConverter } from '../../src/lib/queryConverter.js';
import type { FilterCondition, FilterGroup } from "../../src/lib/types.js";

describe("QueryConverter", () => {

  describe("Equality Operators", () => {
    it("should convert 'eq' operator", () => {
      const condition: FilterCondition = { field: "age", operator: "eq", value: 30 };
      expect(QueryConverter.convert(condition)).toEqual({ age: 30 });
    });

    it("should convert 'neq' operator", () => {
      const condition: FilterCondition = { field: "age", operator: "neq", value: 25 };
      expect(QueryConverter.convert(condition)).toEqual({ age: { not: 25 } });
    });
  });

  describe("Comparison Operators", () => {
    describe("Greater than / Less than", () => {
      it("should convert 'gt' operator", () => {
        expect(QueryConverter.convert({ field: "age", operator: "gt", value: 20 }))
          .toEqual({ age: { gt: 20 } });
      });

      it("should convert 'lt' operator", () => {
        expect(QueryConverter.convert({ field: "age", operator: "lt", value: 40 }))
          .toEqual({ age: { lt: 40 } });
      });
    });

    describe("Greater than or equal / Less than or equal", () => {
      it("should convert 'gte' operator", () => {
        expect(QueryConverter.convert({ field: "age", operator: "gte", value: 20 }))
          .toEqual({ age: { gte: 20 } });
      });

      it("should convert 'lte' operator", () => {
        expect(QueryConverter.convert({ field: "age", operator: "lte", value: 40 }))
          .toEqual({ age: { lte: 40 } });
      });
    });
  });

  describe("Collection Operators", () => {
    it("should convert 'in' operator", () => {
      const condition: FilterCondition = { field: "role", operator: "in", value: ["ADMIN", "USER"] };
      expect(QueryConverter.convert(condition)).toEqual({ role: { in: ["ADMIN", "USER"] } });
    });

    it("should convert 'between' operator", () => {
      const condition: FilterCondition = { field: "age", operator: "between", value: [20, 30] };
      expect(QueryConverter.convert(condition)).toEqual({
        AND: [{ age: { gte: 20 } }, { age: { lte: 30 } }],
      });
    });
  });

  describe("String Operators", () => {
    it("should convert 'contains' operator", () => {
      expect(QueryConverter.convert({ field: "email", operator: "contains", value: "test" }))
        .toEqual({ email: { contains: "test" } });
    });

    it("should convert 'starts_with' operator", () => {
      expect(QueryConverter.convert({ field: "email", operator: "starts_with", value: "john" }))
        .toEqual({ email: { startsWith: "john" } });
    });

    it("should convert 'ends_with' operator", () => {
      expect(QueryConverter.convert({ field: "email", operator: "ends_with", value: "@example.com" }))
        .toEqual({ email: { endsWith: "@example.com" } });
    });
  });

  describe("Null Check Operators", () => {
    it("should convert 'is_null' operator", () => {
      expect(QueryConverter.convert({ field: "name", operator: "is_null" }))
        .toEqual({ name: null });
    });

    it("should convert 'is_not_null' operator", () => {
      expect(QueryConverter.convert({ field: "name", operator: "is_not_null" }))
        .toEqual({ name: { not: null } });
    });
  });

  describe("Complex Filter Groups", () => {
    it("should handle nested AND/OR groups", () => {
      const group: FilterGroup = {
        and: [
          { field: "age", operator: "gte", value: 18 },
          {
            or: [
              { field: "role", operator: "eq", value: "ADMIN" },
              { field: "isActive", operator: "eq", value: true },
            ],
          },
        ],
      };
      expect(QueryConverter.convert(group)).toEqual({
        AND: [
          { age: { gte: 18 } },
          { OR: [{ role: "ADMIN" }, { isActive: true }] },
        ],
      });
    });
  });

  describe("Error Handling", () => {
    it("should throw on unsupported operator", () => {
      const badCondition = { field: "age", operator: "unsupported", value: 1 } as any;
      expect(() => QueryConverter.convert(badCondition)).toThrow("Unsupported operator");
    });
  });

});