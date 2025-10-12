import app from "./app.js";

const PORT = process.env.PORT || 3033;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/docs`);
  console.log(`OpenAPI YAML: http://localhost:${PORT}/openapi.yaml`);
  console.log(`OpenAPI JSON: http://localhost:${PORT}/openapi.json`);
});
