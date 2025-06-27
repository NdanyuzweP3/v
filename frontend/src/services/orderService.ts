import { apiService } from './api';
import { Order, CreateOrderRequest } from '../types';

class OrderService {
  async createOrder(orderData: CreateOrderRequest): Promise<{ message: string; order: Order }> {
    return apiService.post('/orders', orderData);
  }

  async getUserOrders(params?: { status?: string; type?: string }): Promise<{ orders: Order[] }> {
    return apiService.get('/orders', params);
  }

  async getPendingOrders(): Promise<{ orders: Order[] }> {
    return apiService.get('/orders/pending');
  }

  async matchOrder(orderId: number): Promise<{ message: string; order: Order }> {
    return apiService.patch(`/orders/${orderId}/match`);
  }

  async confirmOrder(orderId: number): Promise<{ message: string; order: Order }> {
    return apiService.patch(`/orders/${orderId}/confirm`);
  }

  async completeOrder(orderId: number): Promise<{ message: string; order: Order }> {
    return apiService.patch(`/orders/${orderId}/complete`);
  }

  async cancelOrder(orderId: number): Promise<{ message: string; order: Order }> {
    return apiService.patch(`/orders/${orderId}/cancel`);
  }
}

export const orderService = new OrderService();