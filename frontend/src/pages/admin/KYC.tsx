import React, { useState, useEffect } from 'react';
import { kycService } from '../../services/kycService';
import { KYC } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';

export const AdminKYC: React.FC = () => {
  const [kycs, setKycs] = useState<KYC[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedKyc, setSelectedKyc] = useState<KYC | null>(null);
  const [reviewData, setReviewData] = useState({
    status: 'approved' as 'approved' | 'rejected',
    rejectionReason: '',
    level: 1
  });

  useEffect(() => {
    fetchPendingKYCs();
  }, []);

  const fetchPendingKYCs = async () => {
    try {
      setIsLoading(true);
      const response = await kycService.getPendingKYCs();
      setKycs(response.kycs);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch pending KYCs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewKYC = async (kycId: number) => {
    try {
      const data: any = {
        status: reviewData.status,
        level: reviewData.level
      };
      
      if (reviewData.status === 'rejected') {
        data.rejectionReason = reviewData.rejectionReason;
      }

      await kycService.reviewKYC(kycId, data);
      setSelectedKyc(null);
      setReviewData({ status: 'approved', rejectionReason: '', level: 1 });
      fetchPendingKYCs();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to review KYC');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">KYC Reviews</h1>
        <button
          onClick={fetchPendingKYCs}
          className="btn btn-secondary"
        >
          Refresh
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="card">
        {kycs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No pending KYC verifications</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nationality
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {kycs.map((kyc) => (
                  <tr key={kyc.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{kyc.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      User #{kyc.userId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {kyc.documentType.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {kyc.firstName} {kyc.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {kyc.nationality}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(kyc.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedKyc(kyc)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* KYC Review Modal */}
      {selectedKyc && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  KYC Review - #{selectedKyc.id}
                </h3>
                <button
                  onClick={() => setSelectedKyc(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Document Type</label>
                    <p className="text-gray-900">{selectedKyc.documentType.replace('_', ' ')}</p>
                  </div>
                  
                  <div>
                    <label className="form-label">Document Number</label>
                    <p className="text-gray-900">{selectedKyc.documentNumber}</p>
                  </div>
                  
                  <div>
                    <label className="form-label">Full Name</label>
                    <p className="text-gray-900">{selectedKyc.firstName} {selectedKyc.lastName}</p>
                  </div>
                  
                  <div>
                    <label className="form-label">Date of Birth</label>
                    <p className="text-gray-900">{selectedKyc.dateOfBirth}</p>
                  </div>
                  
                  <div>
                    <label className="form-label">Nationality</label>
                    <p className="text-gray-900">{selectedKyc.nationality}</p>
                  </div>
                  
                  <div>
                    <label className="form-label">Address</label>
                    <p className="text-gray-900">
                      {selectedKyc.address}<br />
                      {selectedKyc.city}, {selectedKyc.postalCode}<br />
                      {selectedKyc.country}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Review Decision</label>
                    <select
                      className="form-input"
                      value={reviewData.status}
                      onChange={(e) => setReviewData({ ...reviewData, status: e.target.value as 'approved' | 'rejected' })}
                    >
                      <option value="approved">Approve</option>
                      <option value="rejected">Reject</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="form-label">KYC Level</label>
                    <select
                      className="form-input"
                      value={reviewData.level}
                      onChange={(e) => setReviewData({ ...reviewData, level: parseInt(e.target.value) })}
                    >
                      <option value={1}>Level 1</option>
                      <option value={2}>Level 2</option>
                      <option value={3}>Level 3</option>
                    </select>
                  </div>
                  
                  {reviewData.status === 'rejected' && (
                    <div>
                      <label className="form-label">Rejection Reason</label>
                      <textarea
                        rows={4}
                        className="form-input"
                        value={reviewData.rejectionReason}
                        onChange={(e) => setReviewData({ ...reviewData, rejectionReason: e.target.value })}
                        placeholder="Explain why this KYC is being rejected..."
                      />
                    </div>
                  )}
                  
                  {selectedKyc.documentFrontUrl && (
                    <div>
                      <label className="form-label">Document Front</label>
                      <img
                        src={`http://localhost:3000/${selectedKyc.documentFrontUrl}`}
                        alt="Document Front"
                        className="max-w-full h-auto border rounded"
                      />
                    </div>
                  )}
                  
                  {selectedKyc.selfieUrl && (
                    <div>
                      <label className="form-label">Selfie</label>
                      <img
                        src={`http://localhost:3000/${selectedKyc.selfieUrl}`}
                        alt="Selfie"
                        className="max-w-full h-auto border rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setSelectedKyc(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReviewKYC(selectedKyc.id)}
                  className={`btn ${reviewData.status === 'approved' ? 'btn-primary' : 'btn-danger'}`}
                >
                  {reviewData.status === 'approved' ? 'Approve' : 'Reject'} KYC
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};