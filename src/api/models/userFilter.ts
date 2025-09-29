import { Filterable } from '../../decorators/filterable.js';
import { Role } from '../../lib/types.js';


export class UserFilter {
  @Filterable(['eq', 'neq'], 'uuid')
  id!: string;

  @Filterable(['eq', 'contains'], 'string')
  email!: string;

  @Filterable(['eq', 'neq', 'gt', 'lt', 'gte', 'lte', 'between'], 'number')
  age!: number;

  @Filterable(['eq', 'neq'], 'string')
  role!: Role;

  @Filterable(['eq', 'neq'], 'boolean')
  isActive!: boolean;

  @Filterable(['gt', 'lt', 'between'], 'date')
  createdAt!: Date;

  @Filterable(['gt', 'lt', 'between'], 'date')
  joinDate!: Date;

  updatedAt!: Date;

  constructor(data: Partial<UserFilter> = {}) {
    Object.assign(this, data);
  }
}