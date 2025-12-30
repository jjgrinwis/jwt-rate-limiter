# JWT Rate Limiter

A Zuplo API Gateway project that demonstrates advanced rate limiting and quota management using JWT bearer token claims.

## Overview

This project implements a sophisticated API gateway that:
- Validates JWT bearer tokens
- Enforces per-user rate limits based on JWT claims
- Manages quota limits derived from JWT claims
- Restricts access based on IP addresses (Akamai network)
- Tracks usage metrics via OpenMeter integration

## Features

- **JWT Authentication**: Validates bearer tokens using OpenID JWT authentication
- **Dynamic Rate Limiting**: Rate limit configuration embedded in JWT claims
- **Quota Management**: Hourly quota limits based on JWT claims
- **IP Restriction**: Allows only requests from specified IP ranges (Akamai network)
- **Usage Tracking**: Integrates with OpenMeter for real-time usage metrics
- **Mock API**: Returns mock responses for testing without a backend
- **OpenAPI Documentation**: Full OpenAPI 3.1 specification included

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Zuplo account (for deployment)

## Installation

```bash
npm install
```

## Configuration

### Environment Variables

Create a `.env` file based on `env.example`:

```bash
JWT_SECRET=your-jwt-secret-here
OPENMETER_API_KEY=your-openmeter-api-key-here
```

For testing purposes, you can use the standard demo secret from [jwt.io](https://jwt.io):

```
JWT_SECRET=your-256-bit-secret
```

### JWT Token Format

The JWT token should include the following claims:

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "rate_limit": {
    "limit": 10,
    "window": 60
  },
  "quota": 50,
  "iat": 1766154143,
  "exp": 1766954143
}
```

- `sub`: Unique identifier for the user (used for rate limiting and quota tracking)
- `rate_limit.limit`: Number of requests allowed
- `rate_limit.window`: Time window in seconds
- `quota`: Number of requests allowed per hour

## How It Works

### Request Flow

1. **IP Validation**: The request originates from an allowed IP address (Akamai network)
2. **JWT Validation**: Bearer token is validated using the configured secret
3. **Rate Limiting**: Request count is checked against the `rate_limit` claim
4. **Quota Enforcement**: Total usage is checked against the `quota` claim
5. **Metrics Tracking**: Request is logged to OpenMeter
6. **Response**: Mock success response or error (401/429) if limits exceeded

### Policies

The project uses a composite inbound policy that chains together:

1. `ip-restriction-inbound` - Validates source IP address
2. `open-id-jwt-auth-inbound` - Validates JWT token
3. `rate-limit-inbound` - Enforces rate limits
4. `quota-inbound` - Enforces quota limits
5. `openmeter-inbound` - Tracks usage metrics
6. `custom-code-inbound` - Logs quota usage
7. `mock-api-inbound` - Returns mock response

## Project Structure

```
.
├── config/
│   ├── policies.json           # Policy configurations
│   └── routes.oas.json         # OpenAPI route definitions
├── modules/
│   ├── ip-restriction-inbound.ts        # IP validation policy
│   ├── my-custom-rate-limiter.ts        # Rate limit logic
│   ├── my-custom-quota-limiter.ts       # Quota limit logic
│   └── show-quota.ts                    # Quota usage logging
├── docs/                       # Zudoku documentation
├── package.json
├── tsconfig.json
└── zuplo.jsonc                # Zuplo configuration
```

## API Endpoints

### GET /rate-limiter

Protected endpoint that demonstrates rate limiting and quota management.

**Authentication**: Bearer token (JWT) required

**Responses**:
- `200 OK`: Request successful
- `401 Unauthorized`: Missing or invalid JWT token, or IP address blocked
- `429 Too Many Requests`: Rate limit or quota exceeded

**Headers**:
```
Authorization: Bearer <jwt-token>
```

## Custom Modules

### Rate Limiter (`my-custom-rate-limiter.ts`)

Extracts rate limit configuration from JWT claims:
- `rate_limit.limit`: Maximum number of requests
- `rate_limit.window`: Time window in seconds
- Uses `sub` claim as the unique identifier

### Quota Limiter (`my-custom-quota-limiter.ts`)

Implements hourly quota limits:
- Reads `quota` value from JWT claims
- Tracks usage per `sub` identifier
- Enforces hourly reset cycle

### IP Restriction (`ip-restriction-inbound.ts`)

Validates source IP addresses:
- Checks `true-client-ip` header
- Supports IP ranges and CIDR notation
- Configured to allow Akamai network IPs

## License

Private

## Author

Built with Zuplo
