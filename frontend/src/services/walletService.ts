import { apiService } from './api';
import { Wallet, Transaction } from '../types';

class WalletService {
  async getUserWallets(): Promise<{ wallets: Wallet[] }> {
    return apiService.get('/wallets');
  }

  async createWallet(currencyId: number): Promise<{ message: string; wallet: Wallet }> {
    return apiService.post('/wallets/create', { currencyId });
  }

  async getWalletBalance(currencyId: number): Promise<{ balance: { balance: number; frozenBalance: number } }> {
    return apiService.get(`/wallets/balance/${currencyId}`);
  }

  async getTransactionHistory(params?: { limit?: number; offset?: number }): Promise<{ transactions: Transaction[] }> {
    return apiService.get('/wallets/transactions', params);
  }

  async createDepositPayment(data: { amount: number; currency: string; payCurrency?: string }): Promise<any> {
    return apiService.post('/wallets/deposit/create', data);
  }
}

export const walletService = new WalletService();