# CRUD-API

Simple REST API service for user management with in-memory storage.

## Prerequisites

- Node.js (version 24 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/DoorDoom/node-basic-server.git
   cd node-basic-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Development Mode

Run the application in development mode with auto-reload:

```bash
npm run start:dev
```

### Production Mode

Start the server:

```bash
npm run start:prod
```

The API will be available at `http://localhost:3000` by default.

## Running the Application Horizontally Scaled

### Development Mode

Run the application in development mode with auto-reload:

```bash
npm run start:multi-dev
```

### Production Mode

Start the server:

```bash
npm run start:multi
```

The API will be available at `http://localhost:3000` by default.

## Testing

Run the test suite:

```bash
npm run test
```

## API Endpoints

### GET /api/users

- Returns all users
- Response: `200 OK` with array of users

### GET /api/users/{userId}

- Returns user by ID
- Response:
  - `200 OK` with user object
  - `400 Bad Request` if ID is invalid
  - `404 Not Found` if user doesn't exist

### POST /api/users

- Creates a new user
- Request body:
  ```json
  {
    "username": "string",
    "age": number,
    "hobbies": ["string"]
  }
  ```
- Response:
  - `201 Created` with created user
  - `400 Bad Request` if body is invalid

### PUT /api/users/{userId}

- Updates existing user
- Request body (all fields optional):
  ```json
  {
    "username": "string",
    "age": number,
    "hobbies": ["string"]
  }
  ```
- Response:
  - `200 OK` with updated user
  - `400 Bad Request` if ID or body is invalid
  - `404 Not Found` if user doesn't exist

### DELETE /api/users/{userId}

- Deletes user by ID
- Response:
  - `204 No Content` on success
  - `400 Bad Request` if ID is invalid
  - `404 Not Found` if user doesn't exist

## Error Responses

The API returns appropriate HTTP status codes and error messages:

- `400 Bad Request` - Invalid input (ID format, request body)
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Environment Variables

Create a `.env` file in the root directory with these variables:

```env
PORT=3000              # Server port (default: 3000)
```
