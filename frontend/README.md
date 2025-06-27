# P2P Platform Frontend

A React TypeScript frontend for the P2P cryptocurrency trading platform.

## Features

- **Authentication**: Login/Register with JWT tokens
- **Dashboard**: Overview of orders, wallets, and key metrics
- **Order Management**: Create, view, and manage trading orders
- **Wallet Management**: View balances and transaction history
- **Messaging**: Communication between users
- **KYC Verification**: Document upload and verification process
- **Admin Panel**: User management, dispute resolution, KYC reviews
- **Agent Features**: Manage pending orders and confirmations

## Tech Stack

- React 18 with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Axios for API communication
- Context API for state management

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3001`.

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, etc.)
├── pages/              # Page components
│   ├── admin/          # Admin-only pages
│   └── ...
├── services/           # API service layers
├── types/              # TypeScript type definitions
└── App.tsx             # Main application component
```

## API Integration

The frontend integrates with all backend endpoints:

- **Authentication**: `/api/auth/*`
- **Orders**: `/api/orders/*`
- **Wallets**: `/api/wallets/*`
- **Messages**: `/api/messages/*`
- **KYC**: `/api/kyc/*`
- **Users**: `/api/users/*`
- **Disputes**: `/api/disputes/*`
- **Admin**: Various admin endpoints

## Role-Based Access

- **Customer**: Basic trading, wallet management, messaging
- **Agent**: All customer features + pending order management
- **Admin**: All features + user management, dispute resolution, KYC reviews

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.