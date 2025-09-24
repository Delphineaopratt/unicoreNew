import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Send, Bot, User, Download, FileText, Target, Lightbulb, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actionButtons?: ActionButton[];
}

interface ActionButton {
  label: string;
  action: string;
  variant?: 'default' | 'outline' | 'secondary';
}

interface UserProfile {
  program: string;
  cgpa: string;
  jobTypes: string[];
  skills: string[];
  interests: string[];
  transcript: File | null;
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
  profilePicture?: string;
}

interface UnibotChatProps {
  userProfile: UserProfile | null;
}

export function UnibotChat({ userProfile }: UnibotChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState<string>('general');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Welcome message
    const welcomeMessage: Message = {
      id: '1',
      type: 'bot',
      content: `Hello${userProfile?.name ? ` ${userProfile.name}` : ''}! 👋 I'm Unibot, your AI career assistant. I'm here to help you create tailored CVs, explore career paths, and land your dream job!`,
      timestamp: new Date(),
      suggestions: [
        "Help me create a CV",
        "Tailor my CV for a specific job",
        "Explore career paths",
        "Get interview tips"
      ]
    };
    setMessages([welcomeMessage]);
  }, [userProfile]);

  const generateBotResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    let suggestions: string[] = [];
    let actionButtons: ActionButton[] = [];

    // CV Creation Flow
    if (lowerMessage.includes('cv') || lowerMessage.includes('resume') || lowerMessage.includes('create')) {
      if (lowerMessage.includes('tailor') || lowerMessage.includes('specific')) {
        setConversationContext('cv-tailoring');
        response = "Perfect! I'll help you tailor your CV for a specific job. This involves analyzing job requirements and optimizing your CV accordingly.\n\nTo get started, I'll need:\n• The job title and description\n• Company name\n• Key requirements mentioned\n\nI'll then help you highlight relevant experience, adjust keywords, and structure your CV for maximum impact!";
        suggestions = [
          "I have a job posting to share",
          "Frontend Developer position",
          "Marketing role at startup",
          "Software Engineering internship"
        ];
        actionButtons = [
          { label: "Upload Job Description", action: "upload-job", variant: "outline" }
        ];
      } else {
        setConversationContext('cv-creation');
        response = `Great choice! Let me help you create a professional CV. Based on your profile, I can see you're studying ${userProfile?.program || 'at university'} with a CGPA of ${userProfile?.cgpa || 'strong academic performance'}.\n\nHere's what we'll include:\n\n✅ **Personal Information**\n✅ **Academic Background** (${userProfile?.program || 'Your program'})\n✅ **Skills** (${userProfile?.skills?.slice(0, 3).join(', ') || 'Technical skills'})\n✅ **Interests** (${userProfile?.interests?.slice(0, 2).join(', ') || 'Professional interests'})\n✅ **Experience & Projects**\n✅ **Achievements**\n\nWould you like me to create a template based on your profile?`;
        actionButtons = [
          { label: "Generate My CV Template", action: "generate-cv", variant: "default" },
          { label: "Customize Sections", action: "customize-cv", variant: "outline" }
        ];
        suggestions = [
          "Generate my CV template",
          "What sections should I include?",
          "Help me with work experience",
          "How to highlight my skills?"
        ];
      }
    }
    // Career Path Exploration
    else if (lowerMessage.includes('career') || lowerMessage.includes('path') || lowerMessage.includes('explore')) {
      setConversationContext('career-exploration');
      const programInsight = userProfile?.program ? ` in ${userProfile.program}` : '';
      const skillsInsight = userProfile?.skills?.length ? ` Your skills in ${userProfile.skills.slice(0, 3).join(', ')} open up several exciting opportunities.` : '';
      
      response = `Excellent! Let's explore career paths that align with your background${programInsight}.${skillsInsight}\n\n🎯 **Popular Career Tracks:**\n• Technology & Software Development\n• Product Management\n• Data Science & Analytics\n• Digital Marketing\n• Consulting\n• Entrepreneurship\n\n📈 **Growth Areas:**\n• AI & Machine Learning\n• Cybersecurity\n• Green Technology\n• FinTech\n\nWhich area interests you most? I can provide detailed insights about salary ranges, required skills, and career progression!`;
      
      suggestions = [
        "Software Development career",
        "Data Science opportunities",
        "Product Management path",
        "Startup opportunities"
      ];
      actionButtons = [
        { label: "Take Career Assessment", action: "career-assessment", variant: "default" }
      ];
    }
    // Interview Tips
    else if (lowerMessage.includes('interview') || lowerMessage.includes('tips')) {
      response = "Great question! Here are my top interview success strategies:\n\n🎯 **Before the Interview:**\n• Research the company thoroughly\n• Practice STAR method (Situation, Task, Action, Result)\n• Prepare 3-5 thoughtful questions\n• Review your CV and be ready to explain everything\n\n💬 **During the Interview:**\n• Arrive 10-15 minutes early\n• Maintain good eye contact and body language\n• Use specific examples from your experience\n• Show enthusiasm and ask engaging questions\n\n✨ **Common Questions to Prepare:**\n• 'Tell me about yourself'\n• 'Why do you want this role?'\n• 'Describe a challenge you overcame'\n• 'Where do you see yourself in 5 years?'\n\nWould you like me to help you practice answers for any specific questions?";
      suggestions = [
        "Practice 'Tell me about yourself'",
        "Help with technical questions",
        "Mock interview simulation",
        "Questions to ask interviewer"
      ];
    }
    // Job-specific advice
    else if (lowerMessage.includes('frontend') || lowerMessage.includes('developer')) {
      response = "Frontend Development is an excellent career choice! Here's what makes a standout frontend developer:\n\n💻 **Essential Skills:**\n• JavaScript, HTML, CSS (Foundation)\n• React, Vue, or Angular (Frameworks)\n• TypeScript (Advanced)\n• Git & Version Control\n• Responsive Design\n• Testing (Jest, Cypress)\n\n🚀 **Portfolio Essentials:**\n• 3-5 diverse projects\n• Clean, responsive designs\n• Interactive features\n• Code on GitHub\n• Live demos\n\n📈 **Career Path:**\n• Junior Frontend Developer (GHC 3,000-6,000)\n• Frontend Developer (GHC 6,000-12,000)\n• Senior Frontend Developer (GHC 12,000-20,000)\n• Lead Developer/Architect (GHC 20,000+)\n\nWant me to help you create a frontend-focused CV?";
      actionButtons = [
        { label: "Create Frontend CV", action: "frontend-cv", variant: "default" },
        { label: "Build Portfolio Guide", action: "portfolio-guide", variant: "outline" }
      ];
    }
    // General responses
    else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      response = "Hello there! Ready to boost your career? I'm here to help with CV creation, job applications, career guidance, and more. What would you like to work on today?";
      suggestions = [
        "Create a professional CV",
        "Explore career opportunities",
        "Get job application tips",
        "Practice interview skills"
      ];
    }
    else {
      response = "I understand you're looking for career guidance! I specialize in:\n\n📄 **CV & Resume Help**\n• Creating professional CVs\n• Tailoring for specific jobs\n• Optimizing keywords\n• Industry-specific formats\n\n🎯 **Career Guidance**\n• Exploring career paths\n• Skills development\n• Industry insights\n• Salary expectations\n\n💼 **Job Search Support**\n• Application strategies\n• Interview preparation\n• Professional networking\n• Portfolio building\n\nWhat specific area would you like to focus on?";
      suggestions = [
        "Help me create a CV",
        "Explore career paths",
        "Prepare for interviews",
        "Build my portfolio"
      ];
    }

    return {
      id: Date.now().toString(),
      type: 'bot',
      content: response,
      timestamp: new Date(),
      suggestions,
      actionButtons
    };
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    handleSendMessage();
  };

  const handleActionClick = (action: string) => {
    let response = '';
    
    switch (action) {
      case 'generate-cv':
        response = "Perfect! I'm generating your personalized CV template now... ✨\n\n📋 **Your CV Template includes:**\n\n**PERSONAL INFORMATION**\n" + 
          `• Name: ${userProfile?.name || '[Your Name]'}\n` +
          `• Email: ${userProfile?.email || '[Your Email]'}\n` +
          `• Phone: ${userProfile?.phone || '[Your Phone]'}\n` +
          `• Location: ${userProfile?.location || '[Your Location]'}\n\n` +
          "**EDUCATION**\n" +
          `• Program: ${userProfile?.program || '[Your Program]'}\n` +
          `• CGPA: ${userProfile?.cgpa || '[Your CGPA]'}\n\n` +
          "**SKILLS**\n" +
          `• ${userProfile?.skills?.join('\n• ') || 'Technical Skills\n• Soft Skills\n• Languages'}\n\n` +
          "**INTERESTS**\n" +
          `• ${userProfile?.interests?.join('\n• ') || 'Professional Interests'}\n\n` +
          "Your CV template is ready! Would you like me to help you add work experience, projects, or customize any sections?";
        break;
      case 'career-assessment':
        response = "🎯 **Quick Career Assessment**\n\nBased on your profile, here's what I've analyzed:\n\n" +
          `📚 **Academic Background:** ${userProfile?.program || 'Strong foundation'}\n` +
          `🎯 **Preferred Job Types:** ${userProfile?.jobTypes?.join(', ') || 'Diverse interests'}\n` +
          `💪 **Key Strengths:** ${userProfile?.skills?.slice(0, 4).join(', ') || 'Technical and analytical skills'}\n` +
          `🌟 **Interests:** ${userProfile?.interests?.slice(0, 3).join(', ') || 'Innovation and technology'}\n\n` +
          "**🚀 Recommended Career Paths:**\n" +
          "1. **Software Development** - High demand, great growth\n" +
          "2. **Product Management** - Leadership and strategy\n" +
          "3. **Data Analysis** - Growing field with impact\n" +
          "4. **Digital Marketing** - Creative and analytical\n\n" +
          "Which path excites you most? I can provide detailed roadmaps!";
        break;
      case 'frontend-cv':
        response = "🚀 **Frontend Developer CV Template Created!**\n\n" +
          "I've optimized your CV specifically for frontend roles:\n\n" +
          "✅ **Technical Skills Section** - Highlighted JavaScript, React, CSS\n" +
          "✅ **Projects Section** - Space for 3-5 frontend projects\n" +
          "✅ **GitHub & Portfolio Links** - Prominent placement\n" +
          "✅ **Responsive Design Experience** - Key requirement\n" +
          "✅ **Modern Frameworks** - React, Vue, Angular mentioned\n\n" +
          "**Next Steps:**\n" +
          "1. Add your best projects with live demos\n" +
          "2. Include GitHub repositories\n" +
          "3. Highlight problem-solving examples\n" +
          "4. Add any internship/freelance experience\n\n" +
          "Ready to download your frontend-optimized CV?";
        break;
      default:
        response = "I'm working on that feature! In the meantime, let me know how else I can help with your career development.";
    }

    const actionMessage: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content: response,
      timestamp: new Date(),
      actionButtons: action === 'generate-cv' || action === 'frontend-cv' ? [
        { label: "Download CV Template", action: "download", variant: "default" },
        { label: "Customize Further", action: "customize", variant: "outline" }
      ] : []
    };

    setMessages(prev => [...prev, actionMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl">Chat with Unibot</h1>
            <p className="text-gray-600">Your AI Career Assistant • CV Creation • Career Guidance</p>
          </div>
          <div className="ml-auto flex gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${
                message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <Avatar className="w-8 h-8 mt-1">
                {message.type === 'user' ? (
                  <>
                    <AvatarImage src={userProfile?.profilePicture} />
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </>
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600">
                    <Bot className="w-4 h-4 text-white" />
                  </AvatarFallback>
                )}
              </Avatar>
              
              <div className={`flex-1 max-w-3xl ${message.type === 'user' ? 'text-right' : ''}`}>
                <Card className={`${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white ml-12' 
                    : 'bg-white mr-12'
                }`}>
                  <CardContent className="p-4">
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    
                    {/* Action Buttons */}
                    {message.actionButtons && message.actionButtons.length > 0 && (
                      <div className="flex gap-2 mt-4 flex-wrap">
                        {message.actionButtons.map((button, index) => (
                          <Button
                            key={index}
                            variant={button.variant || 'default'}
                            size="sm"
                            onClick={() => handleActionClick(button.action)}
                            className={button.variant === 'default' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
                          >
                            {button.action === 'download' && <Download className="w-4 h-4 mr-2" />}
                            {button.action === 'generate-cv' && <FileText className="w-4 h-4 mr-2" />}
                            {button.action === 'career-assessment' && <Target className="w-4 h-4 mr-2" />}
                            {button.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm text-gray-600 mb-2">Quick actions:</p>
                    <div className="flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-sm hover:bg-blue-50 hover:border-blue-300"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mt-2">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-4">
              <Avatar className="w-8 h-8 mt-1">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600">
                  <Bot className="w-4 h-4 text-white" />
                </AvatarFallback>
              </Avatar>
              <Card className="bg-white mr-12">
                <CardContent className="p-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <Separator />

      {/* Input Area */}
      <div className="bg-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about CV creation, career paths, job applications..."
                className="pr-12 py-3"
              />
            </div>
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              <span>Pro tip: Be specific about the job or career you're interested in!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}