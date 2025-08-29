# elegant-tailor-studio-website-152337-152366

Backend (tailor_studio_backend)
- Express.js API with endpoints:
  - GET / — health check
  - POST /api/contact — submit contact form
  - POST /api/newsletter/subscribe — subscribe to newsletter
- CORS configured for frontend access (configure CORS_ORIGIN)
- MySQL via mysql2 with env-based configuration (MYSQL_URL or MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB, MYSQL_PORT, MYSQL_HOST)
- Swagger docs at /docs

Setup
1. cd tailor_studio_backend
2. Copy .env.example to .env and fill in values (ask orchestrator to set env vars when deploying)
3. npm install
4. npm run dev

OpenAPI
- Navigate to /docs for interactive docs.
- A static snapshot also exists at tailor_studio_backend/interfaces/openapi.json