# User Management-frontend (Angular 18)

A lightweight admin UI for the **User Management API**. Built with **Angular 18**, **Angular Material**, and **standalone components**. It provides views for Users, Groups, and a Reports page that calls a protected API endpoint.

> **Auth note:** For local development, API calls can include a **static Bearer token** taken from Angular **environment** configuration. Only the **Reports** view currently uses authorization on the backend. In the future, you can replace the static token with a real **JWT** flow without changing most of the app.

---

## Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Project Structure](#project-structure)
* [Prerequisites](#prerequisites)
* [Setup](#setup)

  * [1) Clone](#1-clone)
  * [2) Install](#2-install)
  * [3) Configure API base & token](#3-configure-api-base--token)
  * [4) Proxy (dev)](#4-proxy-dev)
  * [5) Run](#5-run)
* [Static Bearer Token](#static-bearer-token)
* [Build, Lint, Test](#build-lint-test)
* [Environment Files](#environment-files)
* [How Auth is Wired (now and later)](#how-auth-is-wired-now-and-later)
* [Troubleshooting](#troubleshooting)
* [Roadmap](#roadmap)

---

## Features

* ✅ Angular 18 + standalone components (no NgModules)
* ✅ Angular Material layout (toolbar + sidenav), tables, dialogs, forms
* ✅ Feature pages:

  * **Users** (list/search/pagination + create/edit/delete)
  * **Groups** (list + create)
  * **Reports** (names-by-permission) — uses Bearer token
* ✅ Central **HTTP interceptor** for headers, Authorization, and toast errors
* ✅ Dev **proxy** to avoid CORS in local development
* ✅ Strict TypeScript, ESLint setup

---

## Tech Stack

* **Angular 18**
* **Angular Material + CDK**
* **RxJS**, **Signals**, **Reactive Forms**
* **Karma/Jasmine** (unit tests)
* **ESLint** (optional but recommended)

---

## Project Structure

```
user-mgmt-admin/
  src/
    app/
      app-root/                 # Root shell that hosts the router-outlet
      layout/shell/             # Toolbar + sidenav layout
      core/
        models.ts               # Shared interfaces
        http-interceptor.ts     # Attaches headers and static Bearer
        services/               # Users, Groups, Rules, Reports services
      features/
        users/                  # Users page & dialog
        groups/                 # Groups page
        reports/                # Reports page (uses auth)
      app.routes.ts             # Route definitions (lazy-loaded)
    environments/
      environment.ts            # Dev config (API base, static token)
      environment.prod.ts       # Prod config (no token)
  proxy.conf.json               # Dev proxy to API
```

---

## Prerequisites

* **Node.js 20+**
* **Angular CLI 18**:

  ```bash
  npm i -g @angular/cli@18
  ```

---

## Setup

### 1) Clone

```bash
git clone <your-frontend-repo-url>
cd user-mgmt-admin
```

### 2) Install

```bash
npm install
```

### 3) Configure API base & token

Edit **`src/environments/environment.ts`** (development):

```ts
export const environment = {
  production: false,
  apiBase: 'http://localhost:5000/api/v1', // or leave '/api/v1' if using proxy
  auth: {
    enabled: true,
    token: 'staff-token-123' // <- matches backend appsettings.Development.json
  }
};
```

Edit **`src/environments/environment.prod.ts`** (production):

```ts
export const environment = {
  production: true,
  apiBase: '/api/v1',
  auth: {
    enabled: false,
    token: '' // keep empty for prod
  }
};
```

> The **HTTP interceptor** reads `environment.auth.enabled` and `environment.auth.token`. When enabled and the request targets your API base, it adds:
>
> `Authorization: Bearer <token>`

### 4) Proxy (dev)

To avoid CORS while developing locally, use the supplied proxy:

**`proxy.conf.json`**

```json
{
  "/api": {
    "target": "http://localhost:5000",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

`package.json`:

```json
{
  "scripts": {
    "start": "ng serve --proxy-config proxy.conf.json",
    "build": "ng build",
    "test": "ng test",
    "lint": "ng lint"
  }
}
```

### 5) Run

```bash
npm start
# open http://localhost:4200
```

---

## Static Bearer Token

* The token is **static** and read from `environment.ts` (`environment.auth.token`).
* It should match one of the tokens configured in the backend’s `appsettings.Development.json`:

  ```json
  "Auth": {
    "Enabled": true,
    "StaticBearer": {
      "Tokens": [
        {
          "token": "staff-token-123",
          "name": "Staff Demo",
          "claims": [ "perm:CanViewReports" ]
        }
      ]
    }
  }
  ```
* Only the **Reports** endpoint on the backend is currently protected with `[Authorize(Policy = "CanViewReports")]`.
  **Users** and **Groups** calls will work even without the token unless you enable authorization there later.

> Don’t want to hardcode the token? Replace the environment usage with `localStorage` in the interceptor:
>
> ```ts
> const localToken = localStorage.getItem('dev_token');
> if (isApi && localToken) headers['Authorization'] = `Bearer ${localToken}`;
> ```
>
> Then set it once in the browser console:
> `localStorage.setItem('dev_token','staff-token-123');`

---

## Build, Lint, Test

```bash
# Build for production
npm run build

# Run unit tests
npm test

# Lint (if configured via @angular-eslint)
npm run lint
```

The production build outputs to `dist/user-mgmt-admin/`.

---

## Environment Files

* `src/environments/environment.ts` — development values (API base, **static token**)
* `src/environments/environment.prod.ts` — production values (no token)

Adjust the API base to match your deployment (or keep `/api/v1` if front and back are served from the same host).

---

## How Auth is Wired (now and later)

**Now (dev):**

* The HTTP interceptor attaches `Authorization: Bearer <token>` for requests aimed at `environment.apiBase` (or `/api/` when using the dev proxy).
* The token is a plain string configured in the Angular environment files and must match a backend-configured static token.
* The **Reports** page calls `/reports/user-names-by-permission` which requires the `CanViewReports` permission. The demo token `staff-token-123` includes it.

**Later (JWT):**

* Replace the static token logic with a real **JWT** issued by your identity provider.
* Store the JWT (e.g., in memory or localStorage) and attach it in the interceptor.
* Keep using the same **policy** (`CanViewReports`) on the API; the JWT should include a `permission` claim to satisfy it.
* Optional: add a small login flow (Auth0/MS Entra/Keycloak) and refresh-token handling.

---

## Troubleshooting

* **401 Unauthorized on Reports**

  * Ensure backend dev config has `Auth.Enabled = true` and the token you use is present.
  * Confirm Angular `environment.auth.enabled = true` and the token matches.
  * If using proxy, confirm the requests go to `/api/...` and the interceptor adds the header.

* **CORS errors**

  * If you’re not using the proxy, add `http://localhost:4200` to the backend `Cors:AllowedOrigins`.

* **API URL mismatch**

  * If your backend runs on a different port/host, update `environment.apiBase` and/or proxy target.

* **Version/build errors**

  * Use Angular CLI **18** with `@angular-devkit/build-angular@18`.
  * If you see `@angular/build` errors, remove it and pin to v18 builders.

---

## Roadmap

* Add guards/role-based UI (hide/disable actions based on claims)
* Loading states and more detailed error states
* E2E tests (Playwright or Cypress)
* Real JWT login flow and token refresh
* Feature to manage **Access Rules** UI per group
