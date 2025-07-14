import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { format, isToday, isYesterday } from 'date-fns';
import { FiSend, FiSearch, FiBold, FiItalic, FiUnderline, FiList, FiAlignLeft } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

function formatDate(date) {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'dd MMM yyyy');
}

const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('umi_student_auth_token') || localStorage.getItem('token');
  const headers = { ...(options.headers || {}), Authorization: `Bearer ${token}` };
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

const DirectMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supervisors, setSupervisors] = useState([]);

  // Fetch conversations
  const loadConversations = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchWithAuth(`${API_URL}/messages/conversations`);
      setConversations(data.conversations || []);
    } catch (err) {
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch messages for selected conversation
  const loadMessages = useCallback(async (conversationId) => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchWithAuth(`${API_URL}/messages/${conversationId}?page=1&pageSize=50`);
      setMessages(data.messages || []);
    } catch (err) {
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, []);

  // On mount, load conversations
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // When a conversation is selected, load its messages
  useEffect(() => {
    if (selected) loadMessages(selected.id);
  }, [selected, loadMessages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Real-time: handle new_message
  useSocket((data) => {
    if (data.conversationId === selected?.id) {
      setMessages((prev) => [...prev, data.message]);
    }
    // Optionally, reload conversations for sidebar update
    loadConversations();
  });

  // Fetch supervisors when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setLoading(true);
      setError('');
      fetch(`${API_URL}/student/supervisors-for-messaging`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(data => {
          setSupervisors(data.supervisors || []);
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to load supervisors');
          setLoading(false);
        });
    }
  }, [isModalOpen]);

  // Filtered supervisors
  const filtered = supervisors.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  // Start or open conversation
  const handleSelect = async (supervisor) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/messages/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ participantId: supervisor.id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to start conversation');
      setIsModalOpen(false);
      // Reload conversations and select the new one
      await loadConversations();
      // Find the new conversation in the list (by id)
      setSelected({
        ...data.conversation,
        otherParticipant: data.conversation.otherParticipant || supervisors.find(s => s.id === supervisor.id)
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const handleSend = async () => {
    if (!message.trim() || !selected) return;
    setSending(true);
    setError('');
    try {
      const res = await fetchWithAuth(`${API_URL}/messages/${selected.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message }),
      });
      setMessages((prev) => [...prev, res.message]);
      setMessage('');
      loadConversations();
    } catch (err) {
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  // Format toolbar (bold, italic, underline, bullet, align left)
  const handleFormat = (tag) => {
    // Simple markdown-like formatting for demo
    if (tag === 'bold') setMessage((m) => m + '**bold**');
    if (tag === 'italic') setMessage((m) => m + '*italic*');
    if (tag === 'underline') setMessage((m) => m + '__underline__');
    if (tag === 'list') setMessage((m) => m + '\n• ');
    if (tag === 'align') setMessage((m) => m + '\n');
  };

  // Group messages by date
  const groupedMessages = messages.reduce((acc, msg) => {
    const date = formatDate(new Date(msg.createdAt));
    acc[date] = acc[date] || [];
    acc[date].push(msg);
    return acc;
  }, {});

  return (
    <div className="flex h-[90vh] bg-white rounded-lg shadow overflow-hidden">
      {/* Sidebar with New Message button */}
      <div className="flex flex-col h-full">
        <button
          className="mb-4 px-4 py-2 bg-[#6c2bd7] text-white rounded-lg hover:bg-[#4b1fa3]"
          onClick={() => setIsModalOpen(true)}
        >
          New Message
        </button>
        {/* Sidebar */}
        <div className="w-80 border-r bg-[#fafbfc] flex flex-col">
          <div className="p-4 border-b">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find a DM, by Name"
              className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-gray-500">Loading...</div>
            ) : error ? (
              <div className="p-4 text-red-500">{error}</div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-gray-400">No conversations</div>
            ) : (
              conversations
                .filter((c) =>
                  c.otherParticipant?.name?.toLowerCase().includes(search.toLowerCase())
                )
                .map((c) => (
                  <div
                    key={c.id}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 ${selected?.id === c.id ? 'bg-gray-100' : ''}`}
                    onClick={() => setSelected(c)}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#6c2bd7] flex items-center justify-center text-white font-bold text-lg">
                      {c.otherParticipant?.name?.[0] || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{c.otherParticipant?.name}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {c.lastMessage?.text || 'No messages yet'}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {c.lastMessage?.createdAt ? format(new Date(c.lastMessage.createdAt), 'dd/MM/yy') : ''}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      {/* New Conversation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold" onClick={() => setIsModalOpen(false)}>×</button>
            <h3 className="text-lg font-semibold mb-4">Start New Conversation</h3>
            <input
              type="text"
              className="w-full mb-3 px-3 py-2 border border-gray-300 rounded text-sm"
              placeholder="Search supervisors by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {loading ? (
              <div className="text-center py-6 text-gray-500">Loading...</div>
            ) : error ? (
              <div className="text-center py-6 text-red-600">{error}</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-6 text-gray-500">No supervisors found</div>
            ) : (
              <ul className="max-h-64 overflow-y-auto divide-y">
                {filtered.map(s => (
                  <li key={s.id} className="py-2 flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-2 rounded" onClick={() => handleSelect(s)}>
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                      {s.avatar ? <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-full object-cover" /> : s.name[0]}
                    </div>
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-gray-500">{s.email}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 border-b px-6 py-4 bg-white">
          {selected ? (
            <>
              <div className="w-10 h-10 rounded-full bg-[#6c2bd7] flex items-center justify-center text-white font-bold text-lg">
                {selected.otherParticipant?.name?.[0] || '?'}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{selected.otherParticipant?.name}</div>
                <div className="text-xs text-gray-500">{selected.otherParticipant?.email}</div>
              </div>
              <div className="text-xs text-gray-400">
                {selected.lastMessage?.createdAt ? format(new Date(selected.lastMessage.createdAt), 'dd MMM yyyy, hh:mm a') : ''}
              </div>
            </>
          ) : (
            <div className="text-gray-400">Select a conversation</div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 bg-[#fafbfc]">
          {selected ? (
            Object.entries(groupedMessages).map(([date, msgs]) => (
              <div key={date}>
                <div className="text-center text-xs text-gray-400 my-2">{date}</div>
                {msgs.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === selected.otherParticipant?.id ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-2 rounded-lg mb-2 text-sm shadow-sm ${msg.senderId === selected.otherParticipant?.id
                        ? 'bg-white text-gray-900'
                        : 'bg-[#6c2bd7] text-white'}`}
                    >
                      {msg.text}
                      <div className="text-[10px] text-gray-400 mt-1 text-right">
                        {format(new Date(msg.createdAt), 'hh:mm a')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">No conversation selected</div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        {selected && (
          <div className="border-t px-6 py-4 bg-white flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <button onClick={() => handleFormat('bold')} className="p-1 hover:bg-gray-100 rounded"><FiBold /></button>
              <button onClick={() => handleFormat('italic')} className="p-1 hover:bg-gray-100 rounded"><FiItalic /></button>
              <button onClick={() => handleFormat('underline')} className="p-1 hover:bg-gray-100 rounded"><FiUnderline /></button>
              <button onClick={() => handleFormat('list')} className="p-1 hover:bg-gray-100 rounded"><FiList /></button>
              <button onClick={() => handleFormat('align')} className="p-1 hover:bg-gray-100 rounded"><FiAlignLeft /></button>
            </div>
            <div className="flex items-center gap-2">
              <textarea
                className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none resize-none min-h-[40px] max-h-[120px]"
                rows={1}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={sending}
              />
              <button
                className="ml-2 px-4 py-2 bg-[#6c2bd7] text-white rounded-lg hover:bg-[#4b1fa3] flex items-center gap-1"
                onClick={handleSend}
                disabled={sending || !message.trim()}
              >
                <FiSend />
                Send
              </button>
            </div>
            {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectMessages;