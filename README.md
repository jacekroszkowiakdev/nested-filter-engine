# nested-filter-engine

## Description

This application is a **backend service built with Node.js** that provides a flexible and reusable way to apply complex filters to datasets.  

It exposes an HTTP API where clients can send **nested filter definitions** (using `and` / `or` groups) and receive results that match the criteria.  
At its core, the app includes a **type-safe filter library** that validates incoming filters, restricts queries to only allowed fields, and translates filter definitions into database-ready query objects.  

The service layer then uses this library to run efficient queries against supported data sources (e.g. SQL databases, MongoDB, MikroORM, Prisma).

## Tech Stack (WiP)

- Node.js & Express.js – Backend framework
- TypeScript – Strongly typed JavaScript
- Prisma ORM – Database management
- PostgreSQL
- Jest + Supertest (testing)

## Project Structure (WiP)

nested-filter-engine
├── README.md
├── prisma
├── src
│   ├── api
│   │   ├── controllers
│   │   ├── models
│   │   └── services
│   ├── app.ts
│   ├── lib
│   └── types
└── test

