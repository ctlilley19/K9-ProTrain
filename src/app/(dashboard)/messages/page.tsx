'use client';

import { useState, useRef, useEffect } from 'react';
import { PageHeader } from '@/components/layout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { cn, formatDate } from '@/lib/utils';
import { quickReplies } from '@/services/supabase/messages';
import {
  MessageSquare,
  Send,
  Search,
  Plus,
  Image,
  Paperclip,
  MoreVertical,
  Check,
  CheckCheck,
  Dog,
  Clock,
  Archive,
  ChevronDown,
} from 'lucide-react';

// Mock conversations
const mockConversations = [
  {
    id: '1',
    family: { id: 'f1', name: 'Anderson Family' },
    dog: { id: 'a', name: 'Max', photo_url: null },
    last_message: {
      content: 'How is Max doing with the heel command?',
      sender_type: 'parent',
      created_at: '2025-01-13T14:30:00Z',
    },
    unread_count: 2,
    last_message_at: '2025-01-13T14:30:00Z',
  },
  {
    id: '2',
    family: { id: 'f1', name: 'Anderson Family' },
    dog: { id: 'b', name: 'Bella', photo_url: null },
    last_message: {
      content: 'Thanks for the photos! She looks so happy.',
      sender_type: 'parent',
      created_at: '2025-01-13T12:15:00Z',
    },
    unread_count: 0,
    last_message_at: '2025-01-13T12:15:00Z',
  },
  {
    id: '3',
    family: { id: 'f2', name: 'Martinez Family' },
    dog: { id: 'c', name: 'Luna', photo_url: null },
    last_message: {
      content: 'Luna is all ready for pickup!',
      sender_type: 'staff',
      created_at: '2025-01-13T10:00:00Z',
    },
    unread_count: 0,
    last_message_at: '2025-01-13T10:00:00Z',
  },
];

// Mock messages for selected conversation
const mockMessages = [
  {
    id: '1',
    sender_type: 'parent',
    sender_name: 'Sarah Anderson',
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
    read_at: '2025-01-13T09:20:00Z',
  },
  {
    id: '3',
    sender_type: 'staff',
    sender_name: 'Sarah Johnson',
    content: 'Here\'s a quick video from today\'s session:',
    attachments: [{ type: 'image', url: '/placeholder.jpg', name: 'max-training.jpg' }],
    created_at: '2025-01-13T09:16:00Z',
    read_at: '2025-01-13T09:20:00Z',
  },
  {
    id: '4',
    sender_type: 'parent',
    sender_name: 'Sarah Anderson',
    content: 'That\'s wonderful! He looks so focused. How is Max doing with the heel command?',
    created_at: '2025-01-13T14:30:00Z',
    read_at: null,
  },
];

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1');
  const [newMessage, setNewMessage] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversation = mockConversations.find((c) => c.id === selectedConversation);

  const filteredConversations = mockConversations.filter(
    (c) =>
      c.family.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.dog.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    // In real app, this would call messagesService.sendMessage
  };

  const handleQuickReply = (template: string) => {
    const message = template
      .replace('{dogName}', conversation?.dog.name || '')
      .replace('{skill}', 'heel')
      .replace('{date}', 'tomorrow at 2pm');
    setNewMessage(message);
    setShowQuickReplies(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div>
      <PageHeader
        title="Messages"
        description="Communicate with pet parents"
        action={
          <Button variant="primary" leftIcon={<Plus size={18} />}>
            New Message
          </Button>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
        {/* Conversations List */}
        <Card className="lg:col-span-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-surface-700">
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search size={16} />}
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                type="button"
                onClick={() => setSelectedConversation(conv.id)}
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
                    {conv.family.name}
                  </p>
                  <p
                    className={cn(
                      'text-sm truncate mt-1',
                      conv.unread_count > 0
                        ? 'text-white font-medium'
                        : 'text-surface-500'
                    )}
                  >
                    {conv.last_message.sender_type === 'staff' && 'You: '}
                    {conv.last_message.content}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Messages Area */}
        <Card className="lg:col-span-2 flex flex-col overflow-hidden">
          {selectedConversation && conversation ? (
            <>
              {/* Conversation Header */}
              <div className="flex items-center justify-between p-4 border-b border-surface-700">
                <div className="flex items-center gap-3">
                  <Avatar name={conversation.dog.name} size="md" />
                  <div>
                    <h3 className="font-medium text-white">
                      {conversation.dog.name}
                    </h3>
                    <p className="text-sm text-surface-400">
                      {conversation.family.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon-sm">
                    <Dog size={18} />
                  </Button>
                  <Button variant="ghost" size="icon-sm">
                    <Archive size={18} />
                  </Button>
                  <Button variant="ghost" size="icon-sm">
                    <MoreVertical size={18} />
                  </Button>
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
                      message.sender_type === 'staff' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[70%] rounded-2xl px-4 py-2',
                        message.sender_type === 'staff'
                          ? 'bg-brand-500 text-white rounded-br-md'
                          : 'bg-surface-800 text-white rounded-bl-md'
                      )}
                    >
                      <p>{message.content}</p>
                      {message.attachments?.map((attachment, idx) => (
                        <div
                          key={idx}
                          className="mt-2 rounded-lg overflow-hidden bg-surface-700/50"
                        >
                          <div className="h-32 flex items-center justify-center">
                            <Image size={32} className="text-surface-500" />
                          </div>
                        </div>
                      ))}
                      <div
                        className={cn(
                          'flex items-center gap-1 mt-1',
                          message.sender_type === 'staff'
                            ? 'justify-end'
                            : 'justify-start'
                        )}
                      >
                        <span
                          className={cn(
                            'text-xs',
                            message.sender_type === 'staff'
                              ? 'text-white/70'
                              : 'text-surface-500'
                          )}
                        >
                          {formatDate(message.created_at, 'h:mm a')}
                        </span>
                        {message.sender_type === 'staff' && (
                          message.read_at ? (
                            <CheckCheck size={14} className="text-white/70" />
                          ) : (
                            <Check size={14} className="text-white/70" />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              {showQuickReplies && (
                <div className="px-4 pb-2">
                  <div className="flex flex-wrap gap-2">
                    {quickReplies.map((reply) => (
                      <button
                        key={reply.id}
                        type="button"
                        onClick={() => handleQuickReply(reply.template)}
                        className="px-3 py-1.5 rounded-full text-sm bg-surface-800 hover:bg-surface-700 text-surface-300 transition-colors"
                      >
                        {reply.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Input */}
              <div className="p-4 border-t border-surface-700">
                <div className="flex items-end gap-2">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon-sm">
                      <Paperclip size={18} />
                    </Button>
                    <Button variant="ghost" size="icon-sm">
                      <Image size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setShowQuickReplies(!showQuickReplies)}
                      className={showQuickReplies ? 'text-brand-400' : ''}
                    >
                      <ChevronDown
                        size={18}
                        className={cn(
                          'transition-transform',
                          showQuickReplies && 'rotate-180'
                        )}
                      />
                    </Button>
                  </div>
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
                Choose a conversation from the left to view messages
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
