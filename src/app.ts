import express from "express";
import dotenv from "dotenv";
import redoc from "redoc-express";
import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import { fileURLToPath } from "url";

import userController from "./api/controllers/userController.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

app.use("/api", userController);

// Load OpenAPI spec from YAML file in openapi folder
const openapiPath = path.join(__dirname, "../openapi/openapi.yaml");
const openapiSpec = yaml.load(fs.readFileSync(openapiPath, "utf8"));

// Serve OpenAPI spec as YAML (REQUIRED for Redoc)
app.get("/openapi.yaml", (req, res) => {
  res.setHeader("Content-Type", "text/yaml");
  res.sendFile(openapiPath);
});

// Serve OpenAPI spec as JSON (for Postman, etc)
app.get("/openapi.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.json(openapiSpec);
});

// Dynamic Redoc documentation
app.get(
  "/docs",
  redoc({
    title: "Filter API Documentation",
    specUrl: "/openapi.yaml",
  })
);

export default app;
