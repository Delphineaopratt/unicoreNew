import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import {
  Send,
  Bot,
  User,
  Download,
  FileText,
  Target,
  Lightbulb,
  Sparkles,
  Trash2,
} from "lucide-react";
import { generateChatbotResponse } from "../services/chatbot.service";
import { useUnibotChat } from "../context/UnibotContext";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actionButtons?: ActionButton[];
}

interface ActionButton {
  label: string;
  action: string;
  variant?: "default" | "outline" | "secondary";
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
  const { messages, addMessage, clearMessages } = useUnibotChat();
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] =
    useState<string>("general");
  const [welcomeShown, setWelcomeShown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Show welcome message only if no messages exist
    if (messages.length === 0 && !welcomeShown) {
      const welcomeMessage: Message = {
        id: "1",
        type: "bot",
        content: `Hello${userProfile?.name ? ` ${userProfile.name}` : ""}! 👋 I'm Unibot, your AI career assistant. I'm here to help you create tailored CVs, explore career paths, and land your dream job!`,
        timestamp: new Date(),
        suggestions: [
          "Help me create a CV",
          "Tailor my CV for a specific job",
          "Explore career paths",
          "Get interview tips",
        ],
      };
      addMessage(welcomeMessage);
      setWelcomeShown(true);
    }
  }, [userProfile, messages.length, welcomeShown, addMessage]);

  const generateBotResponse = async (userMessage: string): Promise<Message> => {
    try {
      setIsTyping(true);
      const response = await generateChatbotResponse(
        userMessage,
        userProfile,
        messages,
      );

      return {
        id: Date.now().toString(),
        type: "bot",
        content: response,
        timestamp: new Date(),
        suggestions: [], // Could be parsed from AI response if needed
        actionButtons: [], // Could be parsed from AI response if needed
      };
    } catch (error: any) {
      console.error("Error generating bot response:", error);
      // Fallback to a user-friendly error message
      const errorMessage =
        error?.message ||
        "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
      return {
        id: Date.now().toString(),
        type: "bot",
        content: errorMessage,
        timestamp: new Date(),
        suggestions: [],
        actionButtons: [],
      };
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    addMessage(userMessage);
    const currentInput = inputValue;
    setInputValue("");
    setIsTyping(true);

    try {
      const botResponse = await generateBotResponse(currentInput);
      addMessage(botResponse);
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      // Error handling is already in generateBotResponse
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    handleSendMessage();
  };

  const handleActionClick = (action: string) => {
    let response = "";

    switch (action) {
      case "generate-cv":
        response =
          "Perfect! I'm generating your personalized CV template now... ✨\n\n📋 **Your CV Template includes:**\n\n**PERSONAL INFORMATION**\n" +
          `• Name: ${userProfile?.name || "[Your Name]"}\n` +
          `• Email: ${userProfile?.email || "[Your Email]"}\n` +
          `• Phone: ${userProfile?.phone || "[Your Phone]"}\n` +
          `• Location: ${userProfile?.location || "[Your Location]"}\n\n` +
          "**EDUCATION**\n" +
          `• Program: ${userProfile?.program || "[Your Program]"}\n` +
          `• CGPA: ${userProfile?.cgpa || "[Your CGPA]"}\n\n` +
          "**SKILLS**\n" +
          `• ${userProfile?.skills?.join("\n• ") || "Technical Skills\n• Soft Skills\n• Languages"}\n\n` +
          "**INTERESTS**\n" +
          `• ${userProfile?.interests?.join("\n• ") || "Professional Interests"}\n\n` +
          "Your CV template is ready! Would you like me to help you add work experience, projects, or customize any sections?";
        break;
      case "career-assessment":
        response =
          "🎯 **Quick Career Assessment**\n\nBased on your profile, here's what I've analyzed:\n\n" +
          `📚 **Academic Background:** ${userProfile?.program || "Strong foundation"}\n` +
          `🎯 **Preferred Job Types:** ${userProfile?.jobTypes?.join(", ") || "Diverse interests"}\n` +
          `💪 **Key Strengths:** ${userProfile?.skills?.slice(0, 4).join(", ") || "Technical and analytical skills"}\n` +
          `🌟 **Interests:** ${userProfile?.interests?.slice(0, 3).join(", ") || "Innovation and technology"}\n\n` +
          "**🚀 Recommended Career Paths:**\n" +
          "1. **Software Development** - High demand, great growth\n" +
          "2. **Product Management** - Leadership and strategy\n" +
          "3. **Data Analysis** - Growing field with impact\n" +
          "4. **Digital Marketing** - Creative and analytical\n\n" +
          "Which path excites you most? I can provide detailed roadmaps!";
        break;
      case "frontend-cv":
        response =
          "🚀 **Frontend Developer CV Template Created!**\n\n" +
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
        response =
          "I'm working on that feature! In the meantime, let me know how else I can help with your career development.";
    }

    const actionMessage: Message = {
      id: Date.now().toString(),
      type: "bot",
      content: response,
      timestamp: new Date(),
      actionButtons:
        action === "generate-cv" || action === "frontend-cv"
          ? [
              {
                label: "Download CV Template",
                action: "download",
                variant: "default",
              },
              {
                label: "Customize Further",
                action: "customize",
                variant: "outline",
              },
            ]
          : [],
    };

    addMessage(actionMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
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
            <p className="text-gray-600">
              Your AI Career Assistant • CV Creation • Career Guidance
            </p>
          </div>
          <div className="ml-auto flex gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (confirm("Are you sure you want to clear chat history?")) {
                  clearMessages();
                  setWelcomeShown(false);
                }
              }}
              className="text-gray-500 hover:text-red-500 hover:bg-red-50"
              title="Clear chat history"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
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
                message.type === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <Avatar className="w-8 h-8 mt-1">
                {message.type === "user" ? (
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

              <div
                className={`flex-1 max-w-3xl ${message.type === "user" ? "text-right" : ""}`}
              >
                <Card
                  className={`${
                    message.type === "user"
                      ? "bg-blue-600 text-white ml-12"
                      : "bg-white mr-12"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="whitespace-pre-wrap">{message.content}</div>

                    {/* Action Buttons */}
                    {message.actionButtons &&
                      message.actionButtons.length > 0 && (
                        <div className="flex gap-2 mt-4 flex-wrap">
                          {message.actionButtons.map((button, index) => (
                            <Button
                              key={index}
                              variant={button.variant || "default"}
                              size="sm"
                              onClick={() => handleActionClick(button.action)}
                              className={
                                button.variant === "default"
                                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                                  : ""
                              }
                            >
                              {button.action === "download" && (
                                <Download className="w-4 h-4 mr-2" />
                              )}
                              {button.action === "generate-cv" && (
                                <FileText className="w-4 h-4 mr-2" />
                              )}
                              {button.action === "career-assessment" && (
                                <Target className="w-4 h-4 mr-2" />
                              )}
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
                    hour: "2-digit",
                    minute: "2-digit",
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
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
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
              <span>
                Pro tip: Be specific about the job or career you're interested
                in!
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
