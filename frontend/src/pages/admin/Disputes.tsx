import React, { useState, useEffect } from 'react';
import { disputeService } from '../../services/disputeService';
import { Dispute } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';

export const AdminDisputes: React.FC = () => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [resolution, setResolution] = useState('');

  useEffect(() => {
    fetchDisputes();
  }, [filter]);

  const fetchDisputes = async () => {
    try {
      setIsLoading(true);
      const response = await disputeService.getAllDisputes(filter || undefined);
      setDisputes(response.disputes);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch disputes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolveDispute = async (disputeId: number) => {
    if (!resolution.trim()) {
      setError('Resolution is required');
      return;
    }

    try {
      await disputeService.resolveDispute(disputeId, resolution);
      setSelectedDispute(null);
      setResolution('');
      fetchDisputes();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to resolve dispute');
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
        <h1 className="text-3xl font-bold text-gray-900">Dispute Management</h1>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Status</label>
            <select
              className="form-input"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_review">In Review</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Disputes Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Initiator
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Respondent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {disputes.map((dispute) => (
                <tr key={dispute.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{dispute.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{dispute.orderId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {dispute.initiator?.username || `User #${dispute.initiatorId}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {dispute.respondent?.username || `User #${dispute.respondentId}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {dispute.reason}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      dispute.status === 'open' ? 'bg-red-100 text-red-800' :
                      dispute.status === 'in_review' ? 'bg-yellow-100 text-yellow-800' :
                      dispute.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {dispute.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(dispute.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {dispute.status === 'open' && (
                      <button
                        onClick={() => setSelectedDispute(dispute)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Resolve
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedDispute(dispute);
                      }}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispute Details Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Dispute #{selectedDispute.id}
                </h3>
                <button
                  onClick={() => {
                    setSelectedDispute(null);
                    setResolution('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="form-label">Order ID</label>
                  <p className="text-gray-900">#{selectedDispute.orderId}</p>
                </div>
                
                <div>
                  <label className="form-label">Reason</label>
                  <p className="text-gray-900">{selectedDispute.reason}</p>
                </div>
                
                <div>
                  <label className="form-label">Description</label>
                  <p className="text-gray-900">{selectedDispute.description}</p>
                </div>
                
                {selectedDispute.status === 'open' && (
                  <div>
                    <label htmlFor="resolution" className="form-label">
                      Resolution
                    </label>
                    <textarea
                      id="resolution"
                      rows={4}
                      className="form-input"
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      placeholder="Enter your resolution..."
                    />
                  </div>
                )}
                
                {selectedDispute.resolution && (
                  <div>
                    <label className="form-label">Resolution</label>
                    <p className="text-gray-900">{selectedDispute.resolution}</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setSelectedDispute(null);
                    setResolution('');
                  }}
                  className="btn btn-secondary"
                >
                  Close
                </button>
                {selectedDispute.status === 'open' && (
                  <button
                    onClick={() => handleResolveDispute(selectedDispute.id)}
                    className="btn btn-primary"
                  >
                    Resolve Dispute
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};