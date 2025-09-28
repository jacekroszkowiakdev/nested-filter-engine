// {
//   "and": [
//     { "field": "age", "operator": "gt", "value": 30 },
//     {
//       "or": [
//         { "field": "role", "operator": "eq", "value": "admin" },
//         { "field": "isActive", "operator": "eq", "value": true }
//       ]
//     }
//   ]
// }


import { FilterCondition, FilterGroup } from "./types.js";

type PrismaQuery = Record<string, any>;

export class QueryConverter {
    static convert(filter: FilterGroup | FilterCondition): PrismaQuery {
        if ('field' in filter && 'operator' in filter) {
            return this.convertCondition(filter);
        }

        const groupQuery: PrismaQuery = {};

        if (filter.and) {
            groupQuery.AND = filter.and.map(subFilter => this.convert(subFilter));
        }
        if (filter.or) {
            groupQuery.OR = filter.or.map(subFilter => this.convert(subFilter));
        }

        return groupQuery;
    }

    private static convertCondition(condition: FilterCondition): PrismaQuery {
        const  { field, operator, value } = condition;

        switch (operator) {
            case 'eq':
                return { [field]: { equals: value } };

            default:
                throw new Error(`Unsupported operator: ${operator}`);
        }
    }
}
