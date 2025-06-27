import { apiService } from './api';
import { Dispute, CreateDisputeRequest } from '../types';

class DisputeService {
  async createDispute(disputeData: CreateDisputeRequest): Promise<{ message: string; dispute: Dispute }> {
    return apiService.post('/disputes', disputeData);
  }

  async getUserDisputes(): Promise<{ disputes: Dispute[] }> {
    return apiService.get('/disputes');
  }

  async getAllDisputes(status?: string): Promise<{ disputes: Dispute[] }> {
    return apiService.get('/disputes/all', status ? { status } : undefined);
  }

  async resolveDispute(disputeId: number, resolution: string): Promise<{ message: string; dispute: Dispute }> {
    return apiService.patch(`/disputes/${disputeId}/resolve`, { resolution });
  }

  async closeDispute(disputeId: number): Promise<{ message: string; dispute: Dispute }> {
    return apiService.patch(`/disputes/${disputeId}/close`);
  }
}

export const disputeService = new DisputeService();