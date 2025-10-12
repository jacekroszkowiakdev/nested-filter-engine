import { FilterCondition, FilterGroup } from "./types.js";

type PrismaQuery = Record<string, any>;

export class QueryConverter {
    static convert(filter: FilterGroup | FilterCondition): PrismaQuery {
        // Identify if it's a condition or a group
        if ('field' in filter && 'operator' in filter) {
            return this.convertCondition(filter);
        }

        // create PrismaQuery for groups
        const groupQuery: PrismaQuery = {};

        // build{ AND: [...] }
        if (filter.and) {
            groupQuery.AND = filter.and.map(subFilter => this.convert(subFilter));
        }
        // build { OR: [...] }
        if (filter.or) {
            groupQuery.OR = filter.or.map(subFilter => this.convert(subFilter));
        }

        return groupQuery;
    }

    // map each operator to Prisma's syntax:
    private static convertCondition(condition: FilterCondition): PrismaQuery {
        const  { field, operator, value } = condition;

        switch (operator) {
            case 'eq':
                return { [field]: value };

            case 'neq':
                return { [field]: { not: value } };

            case 'gt':
                return { [field]: { gt: value } };

            case 'gte':
                return { [field]: { gte: value } };

            case 'lt':
                return { [field]: { lt: value } };

            case 'lte':
                return { [field]: { lte: value } };

            case 'in':
                return { [field]: { in: Array.isArray(value) ? value : [value] } };

            case 'between':
                if (!Array.isArray(value) || value.length !== 2) {
                    throw new Error(`'between' operator requires an array of two values.`);
                }
                return {
                    AND: [{ [field]: { gte: value[0] } }, { [field]: { lte: value[1] } }],
                };

            case 'contains':
                return { [field]: { contains: value } };

            case 'starts_with':
                return { [field]: { startsWith: value } };

            case 'ends_with':
                return { [field]: { endsWith: value } };

            case 'is_null':
                return { [field]: null };

            case 'is_not_null':
                return { [field]: { not: null } };

            default:
                throw new Error(`Unsupported operator: ${operator}`);
        }
    }
}
