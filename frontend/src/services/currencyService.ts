import { apiService } from './api';
import { Currency } from '../types';

class CurrencyService {
  async getCurrencies(): Promise<{ currencies: Currency[] }> {
    return apiService.get('/currencies');
  }

  async createCurrency(currencyData: Partial<Currency>): Promise<{ message: string; currency: Currency }> {
    return apiService.post('/currencies', currencyData);
  }

  async updateCurrency(currencyId: number, currencyData: Partial<Currency>): Promise<{ message: string; currency: Currency }> {
    return apiService.put(`/currencies/${currencyId}`, currencyData);
  }
}

export const currencyService = new CurrencyService();