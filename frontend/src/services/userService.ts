import { apiService } from './api';
import { User } from '../types';

class UserService {
  async getUsers(params?: { role?: string; isActive?: boolean }): Promise<{ users: User[] }> {
    return apiService.get('/users', params);
  }

  async getUserById(userId: number): Promise<{ user: User }> {
    return apiService.get(`/users/${userId}`);
  }

  async updateUserStatus(userId: number, data: { isActive?: boolean; isVerified?: boolean }): Promise<{ message: string }> {
    return apiService.patch(`/users/${userId}/status`, data);
  }

  async updateProfile(profileData: { firstName?: string; lastName?: string; username?: string }): Promise<{ message: string; user: User }> {
    return apiService.put('/users/profile', profileData);
  }
}

export const userService = new UserService();