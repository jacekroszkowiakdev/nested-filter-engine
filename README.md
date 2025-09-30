# Nested Filter Engine

A type-safe, extensible Node.js backend service for applying complex nested filters to datasets with field-level access control.

## Overview

This application provides a reusable filter library that accepts complex nested filter definitions with `AND`/`OR` logic groups, validates them against a schema, and converts them into database queries. Built with TypeScript decorators for field-level filtering control.

## What Was Built (~30 hours)

### Core Features Implemented

1. **Reusable Filter Library**
   - TypeScript decorators (`@Filterable`) for field-level access control
   - Schema generation from decorated classes
   - Comprehensive validation engine
   - Query converter for Prisma ORM

2. **Filter Operators** (13 total)
   - Comparison: `eq`, `neq`, `gt`, `gte`, `lt`, `lte`
   - Range: `between`, `in`
   - String: `contains`, `starts_with`, `ends_with`
   - Null checks: `is_null`, `is_not_null`

3. **Validation System**
   - Field filterability checks
   - Operator allowance per field type
   - Type validation (string, number, boolean, date, uuid, enum)
   - Special rules for `between`, `in`, and null operators
   - Enum value validation

4. **API Endpoints**
   - `POST /api/users/filter` - JSON body filters
   - `GET /api/users/filter` - URL-encoded query string filters
   - Comprehensive error handling with descriptive messages

5. **Database Layer**
   - PostgreSQL with Prisma ORM
   - Docker Compose setup
   - Sample user dataset with seeding
   - Service/repository pattern

## Tech Stack

- **Runtime**: Node.js (LTS)
- **Language**: TypeScript 5.9 (strict mode)
- **Framework**: Express.js 5.1
- **ORM**: Prisma 6.16
- **Database**: PostgreSQL 16 (Docker)
- **Metadata**: reflect-metadata 0.2
- **Dev Tools**: ts-node, nodemon, concurrently

## Project Structure

```zsh
├── src/
│   ├── api/
│   │   ├── controllers/
│   │   │   └── userController.ts      # HTTP request handlers
│   │   ├── models/
│   │   │   └── userFilter.ts          # Filter schema with @Filterable decorators
│   │   └── services/
│   │       └── userService.ts         # Business logic & database queries
│   ├── decorators/
│   │   ├── filterable.ts              # @Filterable decorator implementation
│   │   ├── generateFilterSchema.ts    # Schema generation from decorators
│   │   └── metadata.ts                # Metadata key constants
│   ├── lib/                           # Core filter library
│   │   ├── queryConverter.ts          # Converts filters to Prisma queries
│   │   ├── validator.ts               # Filter validation logic
│   │   └── types.ts                   # TypeScript type definitions
│   ├── providers/
│   │   └── prisma.provider.ts         # Prisma client singleton
│   ├── app.ts                         # Express app configuration
│   └── server.ts                      # Application entry point
├── prisma/
│   ├── migrations/                    # Database migrations
│   ├── schema.prisma                  # Prisma schema definition
│   └── seed.ts                        # Sample data seeding script
├── docker-compose.yml                 # PostgreSQL container setup
└── tsconfig.json                      # TypeScript configuration
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Git
- **Optional**: `jq` for formatted JSON output in curl examples

### Installation

```bash
# Clone repository
git clone https://github.com/jacekroszkowiakdev/nested-filter-engine.git
cd nested-filter-engine

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Start PostgreSQL
docker compose up -d

# Generate Prisma Client and run migrations
npx prisma migrate dev

# Seed database with sample data
npx prisma db seed

# Build TypeScript
npm run build

# Start development server
npm run dev
```

#### Installing jq (Optional)

```bash
# Ubuntu/Debian
sudo apt-get install jq

# macOS
brew install jq
```

Server runs on `http://localhost:3000`

## Docker Commands

```bash
# Start database
docker compose up -d

# Stop database
docker compose down

# Reset database (delete all data)
docker compose down -v && docker compose up -d
```

---

## Usage Examples

### Basic Filtering

#### Filter by single field

```bash
curl -X POST http://localhost:3000/api/users/filter \
-H "Content-Type: application/json" \
-d '{
  "and": [
    { "field": "role", "operator": "eq", "value": "USER" }
  ]
}'
```

#### Filter with multiple conditions (AND)

```bash
curl -X POST http://localhost:3000/api/users/filter \
-H "Content-Type: application/json" \
-d '{
  "and": [
    { "field": "role", "operator": "eq", "value": "USER" },
    { "field": "age", "operator": "gte", "value": 25 },
    { "field": "isActive", "operator": "eq", "value": true }
  ]
}'
```

#### Filter with OR logic

```bash
curl -X POST http://localhost:3000/api/users/filter \
-H "Content-Type: application/json" \
-d '{
  "or": [
    { "field": "role", "operator": "eq", "value": "ADMIN" },
    { "field": "role", "operator": "eq", "value": "MODERATOR" }
  ]
}'
```

### Advanced Filtering

#### Nested AND/OR groups

```bash
curl -X POST http://localhost:3000/api/users/filter \
-H "Content-Type: application/json" \
-d '{
  "and": [
    { "field": "isActive", "operator": "eq", "value": true },
    {
      "or": [
        { "field": "role", "operator": "eq", "value": "ADMIN" },
        { "field": "age", "operator": "gt", "value": 30 }
      ]
    }
  ]
}'
```

#### Range filtering with between

```bash
curl -X POST http://localhost:3000/api/users/filter \
-H "Content-Type: application/json" \
-d '{
  "and": [
    { "field": "age", "operator": "between", "value": [25, 35] }
  ]
}'
```

#### Multiple values with in operator

```bash
curl -X POST http://localhost:3000/api/users/filter \
-H "Content-Type: application/json" \
-d '{
  "and": [
    { "field": "role", "operator": "in", "value": ["USER", "ADMIN"] }
  ]
}'
```

#### String matching

```bash
# Contains
curl -X POST http://localhost:3000/api/users/filter \
-H "Content-Type: application/json" \
-d '{
  "and": [
    { "field": "email", "operator": "contains", "value": "example" }
  ]
}'

# Starts with
curl -X POST http://localhost:3000/api/users/filter \
-H "Content-Type: application/json" \
-d '{
  "and": [
    { "field": "email", "operator": "starts_with", "value": "john" }
  ]
}'

# Ends with
curl -X POST http://localhost:3000/api/users/filter \
-H "Content-Type: application/json" \
-d '{
  "and": [
    { "field": "email", "operator": "ends_with", "value": "@example.com" }
  ]
}'
```

### GET Request with URL Encoding

```bash
curl -G "http://localhost:3000/api/users/filter" \
--data-urlencode 'filter={"and":[{"field":"role","operator":"in","value":["ADMIN","MODERATOR"]}]}'
```

### Edge Cases and Error Handling

#### Empty filter returns all results

```bash
curl http://localhost:3000/api/users/filter
```

**Response:** Returns all 8 users

#### Non-filterable system fields

```bash
curl -X POST http://localhost:3000/api/users/filter \
-H "Content-Type: application/json" \
-d '{
  "and": [
    { "field": "createdAt", "operator": "gt", "value": "2025-09-01T00:00:00.000Z" }
  ]
}'
```

**Response:**
```json
{
  "error": "Filter validation failed",
  "details": "Field 'createdAt' is not filterable"
}
```

#### Invalid enum value

```bash
curl -X POST http://localhost:3000/api/users/filter \
-H "Content-Type: application/json" \
-d '{
  "and": [
    { "field": "role", "operator": "eq", "value": "SUPERADMIN" }
  ]
}'
```

**Response:**
```json
{
  "error": "Filter validation failed",
  "details": "Invalid value 'SUPERADMIN' for field 'role'. Allowed values: USER, ADMIN, MODERATOR"
}
```

#### Invalid operator for field type

```bash
curl -X POST http://localhost:3000/api/users/filter \
-H "Content-Type: application/json" \
-d '{
  "and": [
    { "field": "age", "operator": "contains", "value": "30" }
  ]
}'
```

**Response:**
```json
{
  "error": "Filter validation failed",
  "details": "Operator 'contains' is not allowed for field 'age'"
}
```

#### Type mismatch

```bash
curl -X POST http://localhost:3000/api/users/filter \
-H "Content-Type: application/json" \
-d '{
  "and": [
    { "field": "age", "operator": "eq", "value": "thirty" }
  ]
}'
```

**Response:**
```json
{
  "error": "Filter validation failed",
  "details": "Field 'age' must be a number"
}
```

#### Between with wrong number of values

```bash
curl -X POST http://localhost:3000/api/users/filter \
-H "Content-Type: application/json" \
-d '{
  "and": [
    { "field": "age", "operator": "between", "value": [25] }
  ]
}'
```

**Response:**
```json
{
  "error": "Filter validation failed",
  "details": "Operator 'between' requires exactly two values for field 'age'"
}
```

#### In operator with non-array value

```bash
curl -X POST http://localhost:3000/api/users/filter \
-H "Content-Type: application/json" \
-d '{
  "and": [
    { "field": "role", "operator": "in", "value": "USER" }
  ]
}'
```

**Response:**
```json
{
  "error": "Filter validation failed",
  "details": "Operator 'in' requires an array value for field 'role'"
}
```

#### Invalid JSON structure

```bash
curl -X POST http://localhost:3000/api/users/filter \
-H "Content-Type: application/json" \
-d '{
  "invalid": "structure"
}' | jq
```

**Response:**
```json
{
  "error": "Filter validation failed",
  "details": "Invalid filter JSON structure"
}
```

### Success Response Example

```json
[
  {
    "id": "e374696e-5152-453e-88c4-56c70f2c2136",
    "email": "john@example.com",
    "name": "John Doe",
    "age": 30,
    "role": "USER",
    "isActive": true,
    "joinDate": "2025-09-28T21:38:24.784Z",
    "createdAt": "2025-09-28T21:38:24.784Z",
    "updatedAt": "2025-09-28T21:38:24.784Z"
  }
]
```

## Filter Schema Definition

Use `@Filterable` decorator to mark fields as filterable:

```typescript
export class UserFilter {
  @Filterable(['eq', 'neq', 'in', 'is_null', 'is_not_null'], 'uuid')
  id!: string;

  @Filterable(['eq', 'neq', 'contains', 'starts_with', 'ends_with', 'in'], 'string')
  email!: string;

  @Filterable(['eq', 'neq', 'contains', 'starts_with', 'ends_with'], 'string')
  name!: string;

  @Filterable(['eq', 'neq', 'gt', 'lt', 'gte', 'lte', 'between', 'in'], 'number')
  age!: number;

  @Filterable(['eq', 'neq', 'in'], 'string', ['USER', 'ADMIN', 'MODERATOR'])
  role!: string;

  @Filterable(['eq', 'neq'], 'boolean')
  isActive!: boolean;

  // Non-filterable system fields
  createdAt!: Date;
  updatedAt!: Date;
  joinDate!: Date;
}
```

## Design Decisions

### 1. Decorator-Based Field Control

Used TypeScript decorators with `reflect-metadata` for declarative field filtering control. This keeps field configuration close to the model definition and provides clear field-level access control.

### 2. Separate Validation and Conversion

Split validation logic from query building to maintain single responsibility and enable different query builders in the future.

### 3. Prisma ORM

Chosen for type safety, migration management, and TypeScript-first approach. Query converter outputs Prisma-compatible filter objects.

### 4. Dual Endpoint Support

Implemented both POST (JSON body) and GET (URL-encoded) to support different client use cases.

### 5. Comprehensive Type System

Supports multiple field types (string, number, boolean, date, uuid) with type-specific validation and enum value constraints.

### 6. System Field Protection

Audit fields (`createdAt`, `updatedAt`, `joinDate`) are intentionally not decorated with `@Filterable` to prevent filtering on system-managed data.

## Known Limitations

1. **Extensibility**: Custom operators and pluggable query builders not yet implemented
2. **Testing**: Unit and integration tests pending
3. **Query Builders**: Only Prisma supported currently
4. **Performance**: No query optimization or caching implemented

## Future Enhancements

- [ ] Custom operator registration system
- [ ] Pluggable query builder interface (TypeORM, Sequelize support)
- [ ] Comprehensive test suite
- [ ] Query result pagination
- [ ] Filter result caching
- [ ] OpenAPI documentation

## License

ISC

## Author

Jacek Roszkowiak - jacekroszkowiakdev@gmail.com