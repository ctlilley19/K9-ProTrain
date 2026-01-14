'use client';

import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { cn, formatDate } from '@/lib/utils';
import {
  MessageSquare,
  Send,
  Search,
  Plus,
  Image,
  Paperclip,
  Check,
  CheckCheck,
  Dog,
  ArrowLeft,
} from 'lucide-react';

// Mock conversations for parent
const mockConversations = [
  {
    id: '1',
    facility: { id: 'fac1', name: 'K9 Training Academy' },
    dog: { id: 'a', name: 'Max', photo_url: null },
    last_message: {
      content: 'Max is doing fantastic! We just finished a great training session.',
      sender_type: 'staff',
      created_at: '2025-01-13T09:15:00Z',
    },
    unread_count: 1,
    last_message_at: '2025-01-13T09:15:00Z',
  },
  {
    id: '2',
    facility: { id: 'fac1', name: 'K9 Training Academy' },
    dog: { id: 'b', name: 'Bella', photo_url: null },
    last_message: {
      content: 'Thanks for the photos! She looks so happy.',
      sender_type: 'parent',
      created_at: '2025-01-13T08:00:00Z',
    },
    unread_count: 0,
    last_message_at: '2025-01-13T08:00:00Z',
  },
];

// Mock messages
const mockMessages = [
  {
    id: '1',
    sender_type: 'parent',
    sender_name: 'You',
    content: 'Hi! Just checking in on Max. How is he doing today?',
    created_at: '2025-01-13T09:00:00Z',
    read_at: '2025-01-13T09:05:00Z',
  },
  {
    id: '2',
    sender_type: 'staff',
    sender_name: 'Sarah Johnson',
    content: 'Good morning! Max is doing fantastic! We just finished a great training session focusing on heel work. He\'s really getting the hang of it!',
    created_at: '2025-01-13T09:15:00Z',
    read_at: null,
  },
  {
    id: '3',
    sender_type: 'staff',
    sender_name: 'Sarah Johnson',
    content: 'Here\'s a quick photo from today\'s session:',
    attachments: [{ type: 'image', url: '/placeholder.jpg', name: 'max-training.jpg' }],
    created_at: '2025-01-13T09:16:00Z',
    read_at: null,
  },
];

export default function ParentMessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showConversations, setShowConversations] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversation = mockConversations.find((c) => c.id === selectedConversation);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectConversation = (id: string) => {
    setSelectedConversation(id);
    setShowConversations(false);
  };

  const handleBackToList = () => {
    setShowConversations(true);
    setSelectedConversation(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Messages</h1>
        <p className="text-surface-400">Chat with your dog's trainers</p>
      </div>

      <div className="h-[calc(100vh-250px)] min-h-[500px]">
        <Card className="h-full flex flex-col overflow-hidden">
          {/* Mobile: Show either list or conversation */}
          <div className="flex h-full">
            {/* Conversations List */}
            <div
              className={cn(
                'w-full md:w-80 border-r border-surface-700 flex flex-col',
                !showConversations && 'hidden md:flex'
              )}
            >
              <div className="p-4 border-b border-surface-700">
                <h2 className="font-medium text-white">Conversations</h2>
              </div>
              <div className="flex-1 overflow-y-auto">
                {mockConversations.map((conv) => (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => handleSelectConversation(conv.id)}
                    className={cn(
                      'w-full flex items-start gap-3 p-4 border-b border-surface-700/50 hover:bg-surface-800/50 transition-colors text-left',
                      selectedConversation === conv.id && 'bg-surface-800/50'
                    )}
                  >
                    <div className="relative">
                      <Avatar name={conv.dog.name} size="md" />
                      {conv.unread_count > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-500 text-white text-xs flex items-center justify-center">
                          {conv.unread_count}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-white truncate">
                          {conv.dog.name}
                        </h3>
                        <span className="text-xs text-surface-500">
                          {formatDate(conv.last_message_at, 'h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm text-surface-400 truncate">
                        {conv.facility.name}
                      </p>
                      <p
                        className={cn(
                          'text-sm truncate mt-1',
                          conv.unread_count > 0
                            ? 'text-white font-medium'
                            : 'text-surface-500'
                        )}
                      >
                        {conv.last_message.sender_type === 'parent' && 'You: '}
                        {conv.last_message.content}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Messages Area */}
            <div
              className={cn(
                'flex-1 flex flex-col',
                showConversations && 'hidden md:flex'
              )}
            >
              {selectedConversation && conversation ? (
                <>
                  {/* Conversation Header */}
                  <div className="flex items-center gap-3 p-4 border-b border-surface-700">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="md:hidden"
                      onClick={handleBackToList}
                    >
                      <ArrowLeft size={18} />
                    </Button>
                    <Avatar name={conversation.dog.name} size="md" />
                    <div>
                      <h3 className="font-medium text-white">
                        {conversation.dog.name}
                      </h3>
                      <p className="text-sm text-surface-400">
                        {conversation.facility.name}
                      </p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Date Divider */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-px bg-surface-700" />
                      <span className="text-xs text-surface-500">Today</span>
                      <div className="flex-1 h-px bg-surface-700" />
                    </div>

                    {mockMessages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          'flex',
                          message.sender_type === 'parent'
                            ? 'justify-end'
                            : 'justify-start'
                        )}
                      >
                        <div
                          className={cn(
                            'max-w-[80%] rounded-2xl px-4 py-2',
                            message.sender_type === 'parent'
                              ? 'bg-brand-500 text-white rounded-br-md'
                              : 'bg-surface-800 text-white rounded-bl-md'
                          )}
                        >
                          {message.sender_type === 'staff' && (
                            <p className="text-xs text-surface-400 mb-1">
                              {message.sender_name}
                            </p>
                          )}
                          <p>{message.content}</p>
                          {message.attachments?.map((attachment, idx) => (
                            <div
                              key={idx}
                              className="mt-2 rounded-lg overflow-hidden bg-surface-700/50"
                            >
                              <div className="h-40 flex items-center justify-center">
                                <Image size={32} className="text-surface-500" />
                              </div>
                            </div>
                          ))}
                          <div
                            className={cn(
                              'flex items-center gap-1 mt-1',
                              message.sender_type === 'parent'
                                ? 'justify-end'
                                : 'justify-start'
                            )}
                          >
                            <span
                              className={cn(
                                'text-xs',
                                message.sender_type === 'parent'
                                  ? 'text-white/70'
                                  : 'text-surface-500'
                              )}
                            >
                              {formatDate(message.created_at, 'h:mm a')}
                            </span>
                            {message.sender_type === 'parent' &&
                              (message.read_at ? (
                                <CheckCheck size={14} className="text-white/70" />
                              ) : (
                                <Check size={14} className="text-white/70" />
                              ))}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-surface-700">
                    <div className="flex items-end gap-2">
                      <Button variant="ghost" size="icon-sm">
                        <Paperclip size={18} />
                      </Button>
                      <Button variant="ghost" size="icon-sm">
                        <Image size={18} />
                      </Button>
                      <div className="flex-1">
                        <Textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Type a message..."
                          className="min-h-[44px] max-h-32 resize-none"
                        />
                      </div>
                      <Button
                        variant="primary"
                        size="icon"
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                      >
                        <Send size={18} />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <MessageSquare size={48} className="text-surface-600 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">
                    Select a Conversation
                  </h3>
                  <p className="text-surface-400">
                    Choose a conversation to view messages
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
