import { supabase } from '@/lib/supabase';

// Message types
export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_type: 'staff' | 'parent';
  content: string;
  attachments?: MessageAttachment[];
  read_at?: string;
  created_at: string;
}

export interface MessageAttachment {
  id: string;
  type: 'image' | 'video' | 'file';
  url: string;
  name: string;
  size?: number;
}

export interface Conversation {
  id: string;
  facility_id: string;
  family_id: string;
  dog_id?: string;
  subject?: string;
  status: 'active' | 'archived';
  last_message_at: string;
  created_at: string;
  // Populated fields
  family?: {
    id: string;
    name: string;
  };
  dog?: {
    id: string;
    name: string;
    photo_url?: string;
  };
  last_message?: Message;
  unread_count?: number;
}

// Messages service
export const messagesService = {
  // Get all conversations for a facility
  async getConversations(facilityId: string) {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        family:families(id, name),
        dog:dogs(id, name, photo_url)
      `)
      .eq('facility_id', facilityId)
      .eq('status', 'active')
      .order('last_message_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get conversations for a family (parent view)
  async getConversationsForFamily(familyId: string) {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        facility:facilities(id, name),
        dog:dogs(id, name, photo_url)
      `)
      .eq('family_id', familyId)
      .eq('status', 'active')
      .order('last_message_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get a single conversation with messages
  async getConversation(conversationId: string) {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        family:families(id, name),
        dog:dogs(id, name, photo_url),
        messages(*)
      `)
      .eq('id', conversationId)
      .single();

    if (error) throw error;
    return data;
  },

  // Get messages for a conversation
  async getMessages(conversationId: string, limit = 50, offset = 0) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data;
  },

  // Create a new conversation
  async createConversation(conversation: {
    facility_id: string;
    family_id: string;
    dog_id?: string;
    subject?: string;
  }) {
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        ...conversation,
        status: 'active',
        last_message_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Send a message
  async sendMessage(message: {
    conversation_id: string;
    sender_id: string;
    sender_type: 'staff' | 'parent';
    content: string;
    attachments?: MessageAttachment[];
  }) {
    const { data, error } = await supabase
      .from('messages')
      .insert(message)
      .select()
      .single();

    if (error) throw error;

    // Update conversation last_message_at
    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', message.conversation_id);

    return data;
  },

  // Mark messages as read
  async markAsRead(conversationId: string, userId: string) {
    const { error } = await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .neq('sender_id', userId)
      .is('read_at', null);

    if (error) throw error;
  },

  // Get unread count for a user
  async getUnreadCount(userId: string, userType: 'staff' | 'parent') {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .neq('sender_id', userId)
      .neq('sender_type', userType)
      .is('read_at', null);

    if (error) throw error;
    return count || 0;
  },

  // Archive a conversation
  async archiveConversation(conversationId: string) {
    const { error } = await supabase
      .from('conversations')
      .update({ status: 'archived' })
      .eq('id', conversationId);

    if (error) throw error;
  },

  // Subscribe to new messages in a conversation
  subscribeToMessages(
    conversationId: string,
    callback: (message: Message) => void
  ) {
    return supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          callback(payload.new as Message);
        }
      )
      .subscribe();
  },

  // Subscribe to conversation updates
  subscribeToConversations(
    facilityId: string,
    callback: (conversation: Conversation) => void
  ) {
    return supabase
      .channel(`conversations:${facilityId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `facility_id=eq.${facilityId}`,
        },
        (payload) => {
          callback(payload.new as Conversation);
        }
      )
      .subscribe();
  },
};

// Quick reply templates
export const quickReplies = [
  {
    id: 'update',
    label: 'Quick Update',
    template: '{dogName} is doing great today! We worked on {skill} and made good progress.',
  },
  {
    id: 'photo',
    label: 'Photo Sharing',
    template: 'Here are some photos of {dogName} from today\'s session!',
  },
  {
    id: 'reminder',
    label: 'Appointment Reminder',
    template: 'Just a reminder that {dogName}\'s next session is scheduled for {date}. See you then!',
  },
  {
    id: 'pickup',
    label: 'Ready for Pickup',
    template: '{dogName} is all ready for pickup! They had a great day.',
  },
  {
    id: 'concern',
    label: 'Health Concern',
    template: 'I wanted to let you know about something I noticed with {dogName} today. Please give us a call when you have a moment.',
  },
];
