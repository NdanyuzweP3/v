import { apiService } from './api';
import { KYC, KYCSubmissionRequest } from '../types';

class KYCService {
  async submitKYC(kycData: KYCSubmissionRequest, files: { documentFront: File; documentBack?: File; selfie: File }): Promise<{ message: string; kyc: any }> {
    const formData = new FormData();
    
    // Add form fields
    Object.entries(kycData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    // Add files
    formData.append('documentFront', files.documentFront);
    if (files.documentBack) {
      formData.append('documentBack', files.documentBack);
    }
    formData.append('selfie', files.selfie);

    return apiService.uploadFile('/kyc/submit', formData);
  }

  async getKYCStatus(): Promise<{ status: string; level: number; rejectionReason?: string; verifiedAt?: string; expiresAt?: string }> {
    return apiService.get('/kyc/status');
  }

  async getPendingKYCs(): Promise<{ kycs: KYC[] }> {
    return apiService.get('/kyc/pending');
  }

  async reviewKYC(kycId: number, data: { status: 'approved' | 'rejected'; rejectionReason?: string; level?: number }): Promise<{ message: string; kyc: KYC }> {
    return apiService.patch(`/kyc/${kycId}/review`, data);
  }
}

export const kycService = new KYCService();