import puter from '@heyputer/puter.js';
import { UserProfile } from '../types/index';

// ==================== Types ====================

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actionButtons?: ActionButton[];
}

export interface ActionButton {
  label: string;
  action: string;
  variant?: 'default' | 'outline' | 'secondary';
}

export interface PuterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// ==================== Authentication ====================

let authInitialized = false;

/**
 * Initialize Puter authentication
 * Opens a popup for user login if not already authenticated
 */
export const initPuterAuth = async (): Promise<boolean> => {
  try {
    if (authInitialized) {
      console.log('✅ Puter auth already initialized');
      return true;
    }

    // Check if already signed in
    const isSignedIn = await puter.auth.isSignedIn();
    if (isSignedIn) {
      console.log('✅ User already signed in to Puter');
      authInitialized = true;
      return true;
    }

    // Sign in via popup
    console.log('🔐 Opening Puter sign-in popup...');
    await puter.auth.signIn();
    console.log('✅ Puter sign-in successful');
    authInitialized = true;
    return true;
  } catch (error: any) {
    console.error('❌ Puter auth failed:', error?.message || error);
    throw new Error('Puter sign-in failed. Please try again.');
  }
};

// ==================== System Prompt ====================

const buildSystemPrompt = (userProfile: UserProfile | null): string => {
  let prompt = `You are Unibot, an AI career assistant for university students. You help with:
1. CV/Resume creation and tailoring for specific jobs
2. Career guidance and exploration
3. Interview preparation and tips
4. Job search assistance
5. Hostel accommodation finding
6. Professional development advice

You should be friendly, encouraging, and provide specific, actionable advice. When you need more information, ask clarifying questions.`;

  if (userProfile) {
    prompt += `\n\nUser Profile Information:
- Name: ${userProfile.name || 'Not specified'}
- Program/Major: ${userProfile.program || 'Not specified'}
- CGPA: ${userProfile.cgpa || 'Not specified'}
- Skills: ${userProfile.skills?.join(', ') || 'Not specified'}
- Interested in: ${userProfile.jobTypes?.join(', ') || 'Not specified'}
- Interests: ${userProfile.interests?.join(', ') || 'Not specified'}
- Location: ${userProfile.location || 'Not specified'}
- Bio: ${userProfile.bio || 'Not specified'}`;
  }

  return prompt;
};

// ==================== Message Formatting ====================

/**
 * Convert message array to a single prompt string for Puter API
 * Format: "role: content\n\nrole: content"
 */
const formatMessagesToPrompt = (messages: PuterMessage[]): string => {
  return messages.map((msg) => `${msg.role}: ${msg.content}`).join('\n\n');
};

// ==================== Response Extraction ====================

/**
 * Extract text from various Puter response formats
 */
const extractTextFromResponse = (response: any): string => {
  // Try different response format options
  if (response?.message?.content) {
    return response.message.content;
  }
  if (response?.text) {
    return response.text;
  }
  if (response?.content) {
    return response.content;
  }
  if (typeof response === 'string') {
    return response;
  }
  if (response?.completion) {
    return extractTextFromResponse(response.completion);
  }

  console.warn('⚠️ Unexpected response format:', response);
  return '';
};

// ==================== Chat Service ====================

/**
 * Main chat function - sends messages to Puter AI and gets response
 */
export const generateChatbotResponse = async (
  userMessage: string,
  userProfile: UserProfile | null,
  conversationHistory: ChatMessage[]
): Promise<string> => {
  try {
    // Ensure auth is initialized
    await initPuterAuth();

    console.log('📤 Building conversation context...');

    // Build messages array with system context
    const messages: PuterMessage[] = [
      {
        role: 'system',
        content: buildSystemPrompt(userProfile),
      },
    ];

    // Add conversation history (last 10 messages for context)
    conversationHistory.slice(-10).forEach((msg) => {
      messages.push({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content,
      });
    });

    // Add current user message
    messages.push({
      role: 'user',
      content: userMessage,
    });

    // Convert messages to prompt string
    const promptString = formatMessagesToPrompt(messages);
    console.log('📤 Sending prompt to Puter AI...');

    // Call Puter AI Chat API
    const response = await puter.ai.chat(promptString);
    console.log('✅ Puter AI response received');

    // Extract text from response
    const aiResponse = extractTextFromResponse(response);

    if (!aiResponse) {
      throw new Error('Empty response from Puter AI');
    }

    return aiResponse;
  } catch (error: any) {
    const errorMsg = error?.message || error?.toString() || 'Unknown error';
    console.error('❌ Chat error:', {
      message: errorMsg,
      fullError: error,
    });

    throw new Error(
      `AI service error: ${errorMsg}\n\n` +
      'Please try:\n' +
      '1. Make sure you are signed in to Puter\n' +
      '2. Check your internet connection\n' +
      '3. Wait a moment and try again'
    );
  }
};

// ==================== Utilities ====================

/**
 * Suppress Puter console logs for cleaner dev console
 */
export const suppressPuterLogs = (): void => {
  try {
    if (puter?.configureAPILogging) {
      puter.configureAPILogging({ enabled: false });
    }
  } catch (e) {
    // Silently fail if not available
  }
};
