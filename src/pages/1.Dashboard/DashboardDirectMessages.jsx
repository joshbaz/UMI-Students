import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { format, isToday, isYesterday } from 'date-fns';
import { useGetUnreadMessageCount } from '../../store/tanstackStore/services/queries';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const API_URL = import.meta.env.VITE_API_URL || 'http://drims.alero.digital/api/v1';

const DashboardDirectMessages = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { data: unreadData } = useGetUnreadMessageCount();
  const unreadCount = unreadData?.unreadCount || 0;

  // Fetch conversations
  const loadConversations = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('umi_student_auth_token') || localStorage.getItem('token');
      const response = await fetch(`${API_URL}/messages/conversations`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }
      
      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (err) {
      setError('Failed to load conversations');
      console.error('Error loading conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const formatMessageTime = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isToday(date)) {
        return format(date, 'HH:mm');
      } else if (isYesterday(date)) {
        return 'Yesterday';
      } else {
        return format(date, 'MMM dd');
      }
    } catch {
      return '';
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const truncateMessage = (message, maxLength = 40) => {
    if (!message) return 'No messages yet';
    return message.length > maxLength ? `${message.slice(0, maxLength)}...` : message;
  };

  // Get recent conversations (limit to 3)
  const recentConversations = conversations.slice(0, 3);

  if (loading) {
    return (
      <div className="">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg md:text-xl font-semibold">Direct Messages</span>
          <button 
            className="flex items-center gap-2 px-3 md:px-4 py-1 bg-[#25369B] text-white rounded-md text-base font-medium hover:bg-[#1d285c] transition"
            onClick={() => navigate('/direct-messages')}
          >
            View More
            <span className="flex flex-col ml-1">
              <Icon icon="mdi:chevron-up" className="w-4 h-4" />
              <Icon icon="mdi:chevron-down" className="w-4 h-4 -mt-1" />
            </span>
          </button>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Loading messages...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg md:text-xl font-semibold">Direct Messages</span>
          <button 
            className="flex items-center gap-2 px-3 md:px-4 py-1 bg-[#25369B] text-white rounded-md text-base font-medium hover:bg-[#1d285c] transition"
            onClick={() => navigate('/direct-messages')}
          >
            View More
            <span className="flex flex-col ml-1">
              <Icon icon="mdi:chevron-up" className="w-4 h-4" />
              <Icon icon="mdi:chevron-down" className="w-4 h-4 -mt-1" />
            </span>
          </button>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="text-red-500">Failed to load messages</div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg md:text-xl font-semibold">Direct Messages</span>
        <button 
          className="flex items-center gap-2 px-3 md:px-4 py-1 bg-[#25369B] text-white rounded-md text-base font-medium hover:bg-[#1d285c] transition relative"
          onClick={() => navigate('/direct-messages')}
        >
          View More
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          <span className="flex flex-col ml-1">
            <Icon icon="mdi:chevron-up" className="w-4 h-4" />
            <Icon icon="mdi:chevron-down" className="w-4 h-4 -mt-1" />
          </span>
        </button>
      </div>
      
      {recentConversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-32 text-center">
          <Icon icon="mdi:message-outline" className="w-12 h-12 text-gray-300 mb-2" />
          <div className="text-gray-500 mb-2">No conversations yet</div>
          <button 
            className="px-4 py-2 bg-[#6c2bd7] text-white text-sm font-medium rounded-lg hover:bg-[#4b1fa3]"
            onClick={() => navigate('/direct-messages')}
          >
            Start Messaging
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {recentConversations.map((conversation) => (
            <div key={conversation.id} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors" onClick={() => navigate('/direct-messages')}>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  {getInitials(conversation.otherParticipant?.name)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-sm md:text-base leading-tight truncate">
                    {conversation.otherParticipant?.name || 'Unknown Contact'}
                  </div>
                  <div className="text-gray-500 text-xs md:text-sm truncate max-w-[120px] md:max-w-[160px]">
                    {truncateMessage(conversation.lastMessage?.text)}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs md:text-sm text-gray-400 ml-2 whitespace-nowrap">
                  {formatMessageTime(conversation.lastMessage?.createdAt)}
                </span>
                {conversation.unreadCount > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-1">
                    {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
          
          {conversations.length > 3 && (
            <div className="pt-2">
              <button 
                className="w-full text-center text-sm text-[#25369B] hover:text-[#1d285c] font-medium"
                onClick={() => navigate('/direct-messages')}
              >
                View {conversations.length - 3} more conversations
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardDirectMessages;
