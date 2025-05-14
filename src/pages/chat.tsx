import { useState, useEffect, useRef } from "react";
import { MessageList } from "@/components/chat/message-list";
import { ChatInput } from "@/components/chat/input";
import { Button } from "@/components/ui/button";
import { Trash2, MenuIcon, BrainIcon, InfoIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { sendToGemini } from "@/lib/gemini";
import type { Message } from "@/shared/schema";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ApiKeySidebar } from "@/components/sidebar/api-key-sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState<string>("");
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if API key exists in localStorage
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) {
      setGeminiApiKey(savedKey);
    }
    
    // Hide welcome screen if there are messages
    if (messages.length > 0) {
      setShowWelcome(false);
    }
  }, [messages.length]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const addMessage = (message: Omit<Message, "id">) => {
    const newMessage = { ...message, id: uuidv4() };
    setMessages((prev) => [...prev, newMessage]);
    setShowWelcome(false);
    return newMessage;
  };

  const handleSendMessage = async (content: string) => {
    try {
      if (!geminiApiKey) {
        toast({
          title: "API Key Required",
          description: "Please add your Gemini API key in the sidebar to use this feature.",
          variant: "destructive"
        });
        return;
      }

      setIsLoading(true);
      
      // Add the user message
      addMessage({
        content,
        role: "user"
      });

      // Use Gemini API directly for therapeutic responses
      const geminiResponse = await sendToGemini(content, "", geminiApiKey);
      
      const botMessage = addMessage({
        content: geminiResponse.content,
        role: "assistant",
        reasoning: geminiResponse.reasoning
      });

      return botMessage;
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      toast({
        title: "Error",
        description: `Failed to process your request: ${errorMessage}`,
        variant: "destructive"
      });
      
      addMessage({
        content: "I apologize, but I'm having trouble processing that request. Could you please try again?",
        role: "assistant",
        metadata: { error: errorMessage }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setShowWelcome(true);
    toast({
      title: "Chat cleared",
      description: "All messages have been removed."
    });
  };

  const handleApiKeyChange = (key: string) => {
    setGeminiApiKey(key);
  };

  // Example prompts for quick starting
  const examplePrompts = [
    "I've been feeling really anxious lately",
    "How can I manage stress better?",
    "I'm having trouble sleeping at night",
    "I feel overwhelmed with work and life"
  ];

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full overflow-hidden bg-gray-50/80">
        <ApiKeySidebar onApiKeyChange={handleApiKeyChange} />
        
        <div className="flex-1 flex flex-col">
          <header className="py-3 px-4 border-b border-border/50 flex justify-between items-center bg-background/80 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-2">
              <SidebarTrigger>
                <MenuIcon className="h-5 w-5 text-foreground/60 hover:text-foreground/80 transition-colors" />
              </SidebarTrigger>
              <div className="flex items-center">
                
                <h1 className="text-xl font-medium text-foreground">
                MindMate AI
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearChat}
                disabled={isLoading}
                className="h-9 w-9 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {showWelcome ? (
            <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
              <div className="max-w-2xl w-full space-y-6 animate-fade-in">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-semibold text-foreground bg-gradient-to-r from-primary to-primary/70 bg-clip-text">
                    Welcome to Your Safe Space
                  </h2>
                  <p className="text-muted-foreground max-w-lg mx-auto">
                    I'm here to listen and support you. Feel free to share what's on your mind.
                  </p>
                </div>

                {!geminiApiKey && (
                  <Card className="border-amber-200/20 bg-amber-500/5 animate-fade-in animate-delay-100">
                    <CardContent className="pt-4 pb-4 text-center">
                      <InfoIcon className="h-5 w-5 text-amber-500/80 mx-auto mb-2" />
                      <p className="text-sm text-amber-200">
                        <strong>API Key Required:</strong> Please add your Gemini API key in the sidebar to start using the assistant.
                      </p>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-3 animate-fade-in animate-delay-200">
                  <h3 className="text-sm font-medium text-foreground/80 text-center">
                    Try asking about:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {examplePrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => geminiApiKey && handleSendMessage(prompt)}
                        disabled={!geminiApiKey || isLoading}
                        className={cn(
                          "p-3 text-left rounded-lg text-sm transition-all duration-200",
                          "hover:scale-[1.02]",
                          "dark:bg-slate-800/80 dark:hover:bg-slate-700/90",
                          "dark:text-gray-100",
                          "dark:border dark:border-slate-700",
                          "backdrop-blur-sm",
                          "disabled:opacity-50 disabled:cursor-not-allowed",
                          "shadow-sm hover:shadow-md"
                        )}
                        style={{ animationDelay: `${300 + index * 100}ms` }}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-auto p-4 bg-background/50">
              <div className="max-w-3xl mx-auto space-y-4">
                <MessageList messages={messages} isLoading={isLoading} />
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          <div className="border-t border-border bg-card/50 backdrop-blur-sm">
            <div className="max-w-3xl mx-auto w-full">
              <ChatInput
                onSend={handleSendMessage}
                disabled={isLoading || !geminiApiKey}
                placeholder={!geminiApiKey ? "Add your Gemini API key in the sidebar first" : "Ask me anything..."}
                className="bg-background/50"
              />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}