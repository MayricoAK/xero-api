# Payment Approval System - Client

A React-based frontend application for managing Xero payment approvals.

## Tech Stack

- React + Vite
- React Router DOM
- Axios
- TailwindCSS
- Shadcn/ui Components
- React Hot Toast

## Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update the environment variables:
```env
VITE_API_URL="http://localhost:3052"
```

## Installation

```bash
npm install
```

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

To create a production build:

```bash
npm run build
```

## Features

- User Authentication
- Xero Integration
- Payment Request Management
- Payment Approval Workflow
- Real-time Status Updates

## Project Structure

```
src/
├── assets/        # Static assets
├── components/    # Reusable UI components
├── context/       # React context providers
├── hooks/         # Custom React hooks
├── lib/          # Utility libraries
├── pages/        # Application pages/routes
├── router/       # Route configurations
├── services/     # API services
└── utils/        # Helper functions
```