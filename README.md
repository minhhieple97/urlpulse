# URL Reachability Service

This is a NestJS backend service that provides an API to check the reachability of URLs and return them based on priority.

## Prerequisites

- Node.js (v18 or later)
- pnpm (v9 or later)

## Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

## Running the application

To start the application in development mode:

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`.

## API Endpoints

1. Get all reachable URLs ordered by priority:
   GET /urls

2. Get reachable URLs by priority:
   GET /urls/by-priority?priority=<number>

## Running tests

To run the unit tests:

```bash
npm run test
```

## Built With

- [NestJS](https://nestjs.com/) - A progressive Node.js framework
- [Axios](https://axios-http.com/) - Promise based HTTP client
- [Jest](https://jestjs.io/) - JavaScript Testing Framework

## Notes

- The service checks URL reachability with a 5-second timeout.
- URLs returning HTTP status codes between 200-299 are considered reachable.
- All URL checks are performed in parallel for better performance.
