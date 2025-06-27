import React, { useState, useEffect } from 'react';
import { messageService } from '../services/messageService';
import { Message } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'messages' | 'conversations'>('conversations');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [messagesResponse, conversationsResponse] = await Promise.all([
        messageService.getMessages(),
        messageService.getConversations()
      ]);
      
      setMessages(messagesResponse.messages);
      setConversations(conversationsResponse.conversations);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch messages');
    } finally {
      setIsLoading(false);
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
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('conversations')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'conversations'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Conversations
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'messages'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Messages
          </button>
        </nav>
      </div>

      {activeTab === 'conversations' && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Conversations</h2>
          
          {conversations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No conversations yet</p>
          ) : (
            <div className="space-y-4">
              {conversations.map((conversation, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          User #{conversation.otherUser}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {conversation.lastMessage.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(conversation.lastMessage.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">All Messages</h2>
          
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No messages yet</p>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {message.sender?.username || `User #${message.senderId}`}
                      </span>
                      <span className="text-sm text-gray-500">→</span>
                      <span className="font-medium text-gray-900">
                        {message.receiver?.username || `User #${message.receiverId}`}
                      </span>
                      {message.orderId && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Order #{message.orderId}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        message.isRead ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {message.isRead ? 'Read' : 'Unread'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(message.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700">{message.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};