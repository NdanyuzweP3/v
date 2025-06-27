// User types
export interface User {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'agent' | 'customer';
  isActive: boolean;
  isVerified: boolean;
  subscriptionId?: number;
  walletBalance: number;
  createdAt?: string;
  updatedAt?: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: 'customer' | 'agent';
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

// Order types
export interface Order {
  id: number;
  userId: number;
  agentId?: number;
  currencyId: number;
  amount: number;
  price: number;
  totalValue: number;
  type: 'buy' | 'sell';
  status: 'pending' | 'matched' | 'confirmed' | 'completed' | 'cancelled';
  description?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  agent?: User;
  currency?: Currency;
}

export interface CreateOrderRequest {
  currencyId: number;
  amount: number;
  price: number;
  type: 'buy' | 'sell';
  description?: string;
  paymentMethodIds?: number[];
}

// Currency types
export interface Currency {
  id: number;
  name: string;
  symbol: string;
  isActive: boolean;
  minOrderAmount: number;
  maxOrderAmount: number;
  currentPrice: number;
  createdAt: string;
  updatedAt: string;
}

// Message types
export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  orderId?: number;
  content: string;
  messageType: 'text' | 'image' | 'file' | 'system';
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  sender?: User;
  receiver?: User;
  order?: Order;
}

export interface SendMessageRequest {
  receiverId: number;
  orderId?: number;
  content: string;
  messageType?: 'text' | 'image' | 'file';
}

// Wallet types
export interface Wallet {
  id: number;
  userId: number;
  currencyId: number;
  balance: number;
  frozenBalance: number;
  address?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  currency?: Currency;
}

export interface Transaction {
  id: number;
  userId: number;
  walletId: number;
  orderId?: number;
  type: 'deposit' | 'withdrawal' | 'trade' | 'fee' | 'reward';
  amount: number;
  fee: number;
  status: 'pending' | 'confirmed' | 'failed' | 'cancelled';
  txHash?: string;
  fromAddress?: string;
  toAddress?: string;
  confirmations: number;
  requiredConfirmations: number;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  wallet?: Wallet;
}

// KYC types
export interface KYC {
  id: number;
  userId: number;
  level: number;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  documentType: 'passport' | 'id_card' | 'driving_license';
  documentNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  documentFrontUrl?: string;
  documentBackUrl?: string;
  selfieUrl?: string;
  rejectionReason?: string;
  verifiedAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KYCSubmissionRequest {
  documentType: 'passport' | 'id_card' | 'driving_license';
  documentNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

// Payment Method types
export interface PaymentMethod {
  id: number;
  userId: number;
  name: string;
  type: 'bank_transfer' | 'paypal' | 'crypto' | 'mobile_money' | 'cash';
  details: any;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentMethodRequest {
  name: string;
  type: 'bank_transfer' | 'paypal' | 'crypto' | 'mobile_money' | 'cash';
  details: any;
}

// Dispute types
export interface Dispute {
  id: number;
  orderId: number;
  initiatorId: number;
  respondentId: number;
  reason: string;
  description: string;
  status: 'open' | 'in_review' | 'resolved' | 'closed';
  resolution?: string;
  resolvedBy?: number;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  order?: Order;
  initiator?: User;
  respondent?: User;
  resolver?: User;
}

export interface CreateDisputeRequest {
  orderId: number;
  reason: string;
  description: string;
}

// Subscription types
export interface Subscription {
  id: number;
  name: string;
  level: number;
  price: number;
  features: string[];
  maxDailyOrders: number;
  maxOrderAmount: number;
  tradingFeeDiscount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Task types
export interface Task {
  id: number;
  title: string;
  description: string;
  taskType: 'daily' | 'weekly' | 'monthly' | 'one-time';
  rewardAmount: number;
  rewardCurrencyId: number;
  requirements: any;
  isActive: boolean;
  maxCompletions?: number;
  validUntil?: string;
  createdAt: string;
  updatedAt: string;
  rewardCurrency?: Currency;
}

// Trading types
export interface TradingPair {
  id: number;
  baseCurrencyId: number;
  quoteCurrencyId: number;
  symbol: string;
  minOrderAmount: number;
  maxOrderAmount: number;
  priceDecimals: number;
  amountDecimals: number;
  tradingFee: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  baseCurrency?: Currency;
  quoteCurrency?: Currency;
}

// API Response types
export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  error?: string;
  details?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}