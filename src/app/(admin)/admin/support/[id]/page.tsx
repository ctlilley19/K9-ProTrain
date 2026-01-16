'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAdmin } from '@/stores/adminStore';
import {
  ArrowLeft,
  Send,
  Clock,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Lock,
  Tag,
  RefreshCw,
} from 'lucide-react';

// Types
interface Ticket {
  id: string;
  user_id?: string;
  user_email?: string;
  subject: string;
  description: string;
  status: 'new' | 'in_progress' | 'waiting_on_user' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category?: string;
  assigned_to?: string;
  tags?: string[];
  internal_notes?: string;
  first_response_at?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  ticket_id: string;
  sender_type: 'user' | 'admin' | 'system';
  sender_id?: string;
  sender_name?: string;
  content: string;
  is_internal: boolean;
  created_at: string;
}

// Status config
const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  new: { label: 'New', color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  in_progress: { label: 'In Progress', color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
  waiting_on_user: { label: 'Waiting on User', color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
  resolved: { label: 'Resolved', color: 'text-green-400', bgColor: 'bg-green-500/10' },
  closed: { label: 'Closed', color: 'text-surface-400', bgColor: 'bg-surface-500/10' },
};

// Priority config
const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: 'Low', color: 'text-surface-400' },
  normal: { label: 'Normal', color: 'text-white' },
  high: { label: 'High', color: 'text-amber-400' },
  urgent: { label: 'Urgent', color: 'text-red-400' },
};

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const admin = useAdmin();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isInternal, setIsInternal] = useState(false);

  // Fetch ticket
  const fetchTicket = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/tickets/${id}`);
      if (response.ok) {
        const data = await response.json();
        setTicket(data.ticket);
        setMessages(data.messages || []);
      } else if (response.status === 404) {
        router.push('/admin/support');
      }
    } catch (error) {
      console.error('Error fetching ticket:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const response = await fetch(`/api/admin/tickets/${id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newMessage.trim(),
          isInternal,
        }),
      });

      if (response.ok) {
        setNewMessage('');
        setIsInternal(false);
        fetchTicket(); // Refresh to get new message and updated ticket
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  // Update ticket status
  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/tickets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchTicket();
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  // Update priority
  const handlePriorityChange = async (newPriority: string) => {
    try {
      const response = await fetch(`/api/admin/tickets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority: newPriority }),
      });

      if (response.ok) {
        fetchTicket();
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw size={24} className="animate-spin text-surface-500" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-8">
        <p className="text-surface-500">Ticket not found</p>
        <Link href="/admin/support" className="text-brand-400 hover:text-brand-300 mt-2 inline-block">
          Back to tickets
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/support"
          className="p-2 text-surface-400 hover:text-white hover:bg-surface-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {ticket.priority === 'urgent' && <AlertTriangle size={18} className="text-red-400" />}
            {ticket.priority === 'high' && <AlertTriangle size={18} className="text-amber-400" />}
            <h1 className="text-xl font-bold text-white">{ticket.subject}</h1>
          </div>
          <p className="text-sm text-surface-400">Ticket #{ticket.id.substring(0, 8)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Original Message */}
          <Card>
            <div className="p-4 border-b border-surface-800">
              <h3 className="font-medium text-white">Original Request</h3>
            </div>
            <div className="p-4">
              <p className="text-surface-300 whitespace-pre-wrap">{ticket.description}</p>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-surface-800 text-sm text-surface-500">
                <span className="flex items-center gap-1">
                  <User size={14} />
                  {ticket.user_email || 'Unknown user'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {formatDate(ticket.created_at)}
                </span>
              </div>
            </div>
          </Card>

          {/* Messages Thread */}
          <Card>
            <div className="p-4 border-b border-surface-800">
              <h3 className="font-medium text-white">Conversation</h3>
            </div>
            <div className="divide-y divide-surface-800">
              {messages.length === 0 ? (
                <div className="p-4 text-center text-surface-500">
                  No messages yet
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 ${message.is_internal ? 'bg-amber-500/5' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender_type === 'admin' ? 'bg-red-500/10' : 'bg-surface-800'
                      }`}>
                        {message.sender_type === 'admin' ? (
                          <span className="text-xs font-medium text-red-400">A</span>
                        ) : (
                          <User size={14} className="text-surface-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-white">
                            {message.sender_name || (message.sender_type === 'admin' ? 'Support' : 'User')}
                          </span>
                          {message.is_internal && (
                            <span className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-500/10 text-amber-400 rounded text-xs">
                              <Lock size={10} />
                              Internal
                            </span>
                          )}
                          <span className="text-xs text-surface-500">{formatDate(message.created_at)}</span>
                        </div>
                        <p className="text-sm text-surface-300 whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Reply Form */}
            <div className="p-4 border-t border-surface-800">
              <form onSubmit={handleSendMessage}>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your response..."
                  rows={3}
                  className="w-full px-4 py-3 bg-surface-800 border border-surface-700 rounded-lg text-white placeholder-surface-500 focus:border-brand-500 focus:outline-none resize-none"
                />
                <div className="flex items-center justify-between mt-3">
                  <label className="flex items-center gap-2 text-sm text-surface-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="w-4 h-4 rounded border-surface-600 bg-surface-800 text-brand-500 focus:ring-brand-500"
                    />
                    <Lock size={14} />
                    Internal note (not visible to user)
                  </label>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    leftIcon={<Send size={14} />}
                    disabled={!newMessage.trim() || isSending}
                  >
                    {isSending ? 'Sending...' : isInternal ? 'Add Note' : 'Send Reply'}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status */}
          <Card className="p-4">
            <h4 className="text-sm font-medium text-surface-400 mb-3">Status</h4>
            <select
              value={ticket.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-sm font-medium ${statusConfig[ticket.status]?.bgColor} ${statusConfig[ticket.status]?.color} border-0 focus:outline-none focus:ring-2 focus:ring-brand-500`}
            >
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="waiting_on_user">Waiting on User</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </Card>

          {/* Priority */}
          <Card className="p-4">
            <h4 className="text-sm font-medium text-surface-400 mb-3">Priority</h4>
            <select
              value={ticket.priority}
              onChange={(e) => handlePriorityChange(e.target.value)}
              className={`w-full px-3 py-2 bg-surface-800 rounded-lg text-sm font-medium ${priorityConfig[ticket.priority]?.color} border border-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500`}
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </Card>

          {/* User Info */}
          <Card className="p-4">
            <h4 className="text-sm font-medium text-surface-400 mb-3">User</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User size={14} className="text-surface-500" />
                <span className="text-white">{ticket.user_email || 'Unknown'}</span>
              </div>
              {ticket.user_id && (
                <Link
                  href={`/admin/users?id=${ticket.user_id}`}
                  className="text-brand-400 hover:text-brand-300 text-xs"
                >
                  View user profile →
                </Link>
              )}
            </div>
          </Card>

          {/* Timeline */}
          <Card className="p-4">
            <h4 className="text-sm font-medium text-surface-400 mb-3">Timeline</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Circle size={8} className="text-surface-500 mt-1.5" />
                <div>
                  <p className="text-surface-300">Created</p>
                  <p className="text-xs text-surface-500">{formatDate(ticket.created_at)}</p>
                </div>
              </div>
              {ticket.first_response_at && (
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={8} className="text-green-400 mt-1.5" />
                  <div>
                    <p className="text-surface-300">First Response</p>
                    <p className="text-xs text-surface-500">{formatDate(ticket.first_response_at)}</p>
                  </div>
                </div>
              )}
              {ticket.resolved_at && (
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={8} className="text-green-400 mt-1.5" />
                  <div>
                    <p className="text-surface-300">Resolved</p>
                    <p className="text-xs text-surface-500">{formatDate(ticket.resolved_at)}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-2">
                <Clock size={8} className="text-surface-500 mt-1.5" />
                <div>
                  <p className="text-surface-300">Last Updated</p>
                  <p className="text-xs text-surface-500">{formatDate(ticket.updated_at)}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-4">
            <h4 className="text-sm font-medium text-surface-400 mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleStatusChange('resolved')}
                disabled={ticket.status === 'resolved' || ticket.status === 'closed'}
              >
                <CheckCircle2 size={14} className="mr-2 text-green-400" />
                Mark Resolved
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => handlePriorityChange('urgent')}
                disabled={ticket.priority === 'urgent'}
              >
                <AlertTriangle size={14} className="mr-2 text-red-400" />
                Escalate to Urgent
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
