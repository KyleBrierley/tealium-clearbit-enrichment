# Tealium Clearbit Enrichment Prototype

Historical Express/AWS Lambda-style service that enriches a visitor profile with Clearbit data and forwards the normalized payload to Tealium Collect.

This repository was created from an AWS CodeStar web-service scaffold, but the implemented route is a customer-data enrichment workflow: accept an email address, call Clearbit, flatten person/company attributes, add Tealium routing fields, and send the resulting event to Tealium.

## What This Demonstrates

- API-triggered profile enrichment.
- Third-party enrichment integration with Clearbit.
- Payload flattening and normalization for downstream event collection.
- Tealium Collect event forwarding.
- Serverless-style Node/Express application structure for AWS Lambda and API Gateway.

## Data Flow

```mermaid
flowchart LR
    A["POST /enrich with email"] --> B["Clearbit Enrichment API"]
    B --> C["Flatten person and company payloads"]
    C --> D["Add Tealium account, profile, and visitor id"]
    D --> E["POST normalized event to Tealium Collect"]
```

## Endpoint

`POST /enrich`

Example request shape:

```json
{
  "email": "person@example.com"
}
```

The service uses the email address as the lookup key for Clearbit and as the historical demo visitor identifier for Tealium.

## Configuration

Create a local `.env` file with:

```bash
clearbit_api_key=your_clearbit_key
```

The Tealium account/profile values in `app.js` are historical demo values and should be replaced before any real deployment.

## Running Locally

```bash
npm install
npm test
```

The existing tests came from the original scaffold and should be treated as historical. Before using this as a live service, add route-level tests for `/enrich`, validation for missing emails, safer error handling, and current dependency versions.

## Repository Status

This is a legacy integration prototype, not production software. It is useful as portfolio evidence for customer-data integration patterns: enrichment, normalization, and activation into an event collection pipeline.
