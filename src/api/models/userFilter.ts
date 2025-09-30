import { Filterable } from '../../decorators/filterable.js';

export class UserFilter {
  @Filterable(['eq', 'neq', 'in', 'is_null', 'is_not_null'], 'uuid')
  id!: string;

  @Filterable(['eq', 'neq', 'contains', 'starts_with', 'ends_with', 'in', 'is_null', 'is_not_null'], 'string')
  email!: string;

  @Filterable(['eq', 'neq', 'contains', 'starts_with', 'ends_with', 'is_null', 'is_not_null'], 'string')
  name!: string;

  @Filterable(['eq', 'neq', 'gt', 'lt', 'gte', 'lte', 'between', 'in', 'is_null', 'is_not_null'], 'number')
  age!: number;

  @Filterable(['eq', 'neq', 'in', 'is_null', 'is_not_null'], 'string', ['USER', 'ADMIN', 'MODERATOR'])
  role!: string;

  @Filterable(['eq', 'neq', 'is_null', 'is_not_null'], 'boolean')
  isActive!: boolean;

  createdAt!: Date;

  joinDate!: Date;

  updatedAt!: Date;

  constructor(data: Partial<UserFilter> = {}) {
    Object.assign(this, data);
  }
}