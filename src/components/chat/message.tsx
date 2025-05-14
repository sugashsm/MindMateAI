import { Message } from "@/shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
  showReasoning?: boolean;
  animate?: boolean;
}

export function ChatMessage({ message, showReasoning = false, animate = true }: ChatMessageProps) {
  const isBot = message.role === "assistant";
  const hasReasoning = isBot && message.reasoning;

  const formatContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      // Format main bullet points (•)
      if (line.startsWith('•')) {
        return (
          <div key={i} className="flex items-start gap-2 mb-4">
            <span className="text-primary">•</span>
            <span className="flex-1">{line.substring(1).trim()}</span>
          </div>
        );
      }
      
      // Format sub-bullets (-)
      if (line.startsWith('-')) {
        return (
          <div key={i} className="ml-6 flex items-start gap-2 mb-2 text-muted-foreground">
            <span>-</span>
            <span className="flex-1">{line.substring(1).trim()}</span>
          </div>
        );
      }
      
      // Format numbered points (1., 2., etc.)
      if (/^\d+\./.test(line)) {
        return (
          <div key={i} className="ml-6 flex items-start gap-2 mb-2">
            <span className="text-primary">{line.match(/^\d+\./)[0]}</span>
            <span className="flex-1">{line.replace(/^\d+\./, '').trim()}</span>
          </div>
        );
      }

      // Handle empty lines for spacing
      if (line.trim() === '') {
        return <div key={i} className="h-2"></div>;
      }

      // Format regular text
      return (
        <div key={i} className="mb-2">
          {line}
        </div>
      );
    });
  };

  return (
    <div 
      className={cn(
        "flex gap-3 mb-4",
        isBot ? "flex-row" : "flex-row-reverse",
        animate && "opacity-0 animate-fade-in"
      )}
      style={{ animationDelay: animate ? '100ms' : '0ms' }}
    >
      <div
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full",
          message.role === "assistant"
            ? "bg-blue-500 dark:bg-blue-600" // Bot avatar styling
            : "bg-green-500 dark:bg-green-600" // User avatar styling
        )}
      >
        {message.role === "assistant" ? (
          <Bot className="w-5 h-5 text-white" />
        ) : (
          <User className="w-5 h-5 text-white" />
        )}
      </div>

      <div className={cn(
        "max-w-[85%] rounded-2xl shadow-lg border transition-all duration-300",
        isBot 
          ? "message-assistant backdrop-blur-sm ml-1" 
          : "message-user backdrop-blur-sm mr-1",
        "transform-gpu hover:shadow-xl transition-all duration-300"
      )}>
        <div className="p-3.5">
          <div className="text-sm space-y-2 whitespace-pre-wrap">
            {formatContent(message.content)}
          </div>

          {hasReasoning && showReasoning && (
            <div className="mt-3 text-xs reasoning-section reasoning-appear">
              <div className="font-medium mb-1 text-primary">Thought Process:</div>
              <div className="pl-2.5 border-l-2 border-slate-600">
                {formatContent(message.reasoning || "")}
              </div>
            </div>
          )}

          {message.metadata?.error && (
            <div className="mt-2.5 text-xs text-red-400 italic border-t border-slate-600 pt-2.5">
              {message.metadata.error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}