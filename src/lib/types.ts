export type FilterOperator = 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'between' | 'contains' | 'starts_with' | 'ends_with' | 'is_null' | 'is_not_null';

export type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'uuid';

export interface FieldDefinition {
  name: string;
  type: FieldType;
  filterable: boolean;
  operators: FilterOperator[];
  enumValues?: string[];
}

export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value?: any;
}

export type FilterGroup = {
  and?: (FilterCondition | FilterGroup)[];
  or?: (FilterCondition | FilterGroup)[];
};

export type FilterSchema = Record<string, FieldDefinition>;

export type FilterInput = FilterCondition | FilterGroup;

export type FilterFieldMetadata = {
  type?: FieldType;
  operators?: FilterOperator[];
  enumValues?: string[];
};


