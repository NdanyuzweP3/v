import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { kycService } from '../services/kycService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || ''
  });

  const [kycData, setKycData] = useState({
    documentType: 'passport' as 'passport' | 'id_card' | 'driving_license',
    documentNumber: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });

  const [kycFiles, setKycFiles] = useState<{
    documentFront: File | null;
    documentBack: File | null;
    selfie: File | null;
  }>({
    documentFront: null,
    documentBack: null,
    selfie: null
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleKycChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setKycData({
      ...kycData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setKycFiles({
        ...kycFiles,
        [name]: files[0]
      });
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await userService.updateProfile(profileData);
      await refreshUser();
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKycSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!kycFiles.documentFront || !kycFiles.selfie) {
      setError('Document front and selfie are required');
      return;
    }

    setIsLoading(true);

    try {
      await kycService.submitKYC(kycData, {
        documentFront: kycFiles.documentFront,
        documentBack: kycFiles.documentBack || undefined,
        selfie: kycFiles.selfie
      });
      setSuccess('KYC verification submitted successfully');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit KYC verification');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
      </div>

      {error && <ErrorMessage message={error} />}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          {success}
        </div>
      )}

      {/* Profile Information */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-secondary"
            >
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className="form-input"
                  value={profileData.firstName}
                  onChange={handleProfileChange}
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className="form-input"
                  value={profileData.lastName}
                  onChange={handleProfileChange}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="form-input"
                value={profileData.username}
                onChange={handleProfileChange}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary"
              >
                {isLoading ? <LoadingSpinner size="sm" /> : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Email</label>
                <p className="text-gray-900">{user?.email}</p>
              </div>
              
              <div>
                <label className="form-label">Username</label>
                <p className="text-gray-900">{user?.username}</p>
              </div>
              
              <div>
                <label className="form-label">First Name</label>
                <p className="text-gray-900">{user?.firstName || 'Not set'}</p>
              </div>
              
              <div>
                <label className="form-label">Last Name</label>
                <p className="text-gray-900">{user?.lastName || 'Not set'}</p>
              </div>
              
              <div>
                <label className="form-label">Role</label>
                <p className="text-gray-900 capitalize">{user?.role}</p>
              </div>
              
              <div>
                <label className="form-label">Status</label>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  user?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* KYC Verification */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">KYC Verification</h2>
        
        <form onSubmit={handleKycSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="documentType" className="form-label">
                Document Type
              </label>
              <select
                id="documentType"
                name="documentType"
                required
                className="form-input"
                value={kycData.documentType}
                onChange={handleKycChange}
              >
                <option value="passport">Passport</option>
                <option value="id_card">ID Card</option>
                <option value="driving_license">Driving License</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="documentNumber" className="form-label">
                Document Number
              </label>
              <input
                id="documentNumber"
                name="documentNumber"
                type="text"
                required
                className="form-input"
                value={kycData.documentNumber}
                onChange={handleKycChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="kycFirstName" className="form-label">
                First Name
              </label>
              <input
                id="kycFirstName"
                name="firstName"
                type="text"
                required
                className="form-input"
                value={kycData.firstName}
                onChange={handleKycChange}
              />
            </div>
            
            <div>
              <label htmlFor="kycLastName" className="form-label">
                Last Name
              </label>
              <input
                id="kycLastName"
                name="lastName"
                type="text"
                required
                className="form-input"
                value={kycData.lastName}
                onChange={handleKycChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dateOfBirth" className="form-label">
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                required
                className="form-input"
                value={kycData.dateOfBirth}
                onChange={handleKycChange}
              />
            </div>
            
            <div>
              <label htmlFor="nationality" className="form-label">
                Nationality
              </label>
              <input
                id="nationality"
                name="nationality"
                type="text"
                required
                className="form-input"
                value={kycData.nationality}
                onChange={handleKycChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              required
              className="form-input"
              value={kycData.address}
              onChange={handleKycChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="form-label">
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                required
                className="form-input"
                value={kycData.city}
                onChange={handleKycChange}
              />
            </div>
            
            <div>
              <label htmlFor="postalCode" className="form-label">
                Postal Code
              </label>
              <input
                id="postalCode"
                name="postalCode"
                type="text"
                required
                className="form-input"
                value={kycData.postalCode}
                onChange={handleKycChange}
              />
            </div>
            
            <div>
              <label htmlFor="country" className="form-label">
                Country
              </label>
              <input
                id="country"
                name="country"
                type="text"
                required
                className="form-input"
                value={kycData.country}
                onChange={handleKycChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="documentFront" className="form-label">
                Document Front *
              </label>
              <input
                id="documentFront"
                name="documentFront"
                type="file"
                accept="image/*,.pdf"
                required
                className="form-input"
                onChange={handleFileChange}
              />
            </div>
            
            <div>
              <label htmlFor="documentBack" className="form-label">
                Document Back
              </label>
              <input
                id="documentBack"
                name="documentBack"
                type="file"
                accept="image/*,.pdf"
                className="form-input"
                onChange={handleFileChange}
              />
            </div>
            
            <div>
              <label htmlFor="selfie" className="form-label">
                Selfie *
              </label>
              <input
                id="selfie"
                name="selfie"
                type="file"
                accept="image/*"
                required
                className="form-input"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Submit KYC Verification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};