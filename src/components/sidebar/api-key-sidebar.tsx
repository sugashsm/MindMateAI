import { useState, useEffect } from "react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { KeyIcon, SaveIcon, CheckIcon, InfoIcon, LinkIcon, GlobeIcon, ExternalLinkIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ApiKeySidebarProps {
  onApiKeyChange: (key: string) => void;
}

export function ApiKeySidebar({ onApiKeyChange }: ApiKeySidebarProps) {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState<string>("");
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) {
      setApiKey(savedKey);
      setIsSaved(true);
      onApiKeyChange(savedKey);
    }
  }, [onApiKeyChange]);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("gemini_api_key", apiKey);
      setIsSaved(true);
      onApiKeyChange(apiKey);
      
      toast({
        title: "API Key Saved",
        description: "Your Gemini API key has been saved securely."
      });
    } else {
      toast({
        title: "Error",
        description: "Please enter a valid API key.",
        variant: "destructive"
      });
    }
  };

  return (
    <Sidebar className="border-r border-border bg-card">
      <SidebarHeader className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <KeyIcon className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground">API</h2>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-5">
        <div className="space-y-5">
          <Card className="border-border bg-background/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2 text-foreground">
                <span className="text-primary">
                  <GlobeIcon className="h-4 w-4 inline-block" />
                </span>
                Gemini API
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Configure your Gemini API access
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-4">
                  Enter your Gemini API key to access AI-powered features.
                </p>
                <div 
                  className={cn(
                    "relative border transition-all duration-200 rounded-md",
                    isFocused ? "ring-2 ring-primary/20 border-primary/40" : "border-border",
                    "bg-background/50 backdrop-blur-sm"
                  )}
                >
                  <Input
                    type="password"
                    placeholder="Enter your API key"
                    value={apiKey}
                    className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-foreground placeholder:text-muted-foreground"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={(e) => {
                      setApiKey(e.target.value);
                      setIsSaved(false);
                    }}
                  />
                  {isSaved && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                    </div>
                  )}
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                <a 
                  href="https://ai.google.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                >
                  <span>Get your key from Google AI Studio</span>
                  <ExternalLinkIcon className="h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
          
            
            <div className="mt-4 bg-primary/5 rounded-md p-3 text-xs border border-primary/10">
              <p className="font-medium text-primary mb-1">Model information</p>
              <p className="text-muted-foreground">
                This app uses the Gemini 1.5 Flash model, which is faster and more efficient for general purpose use cases 
                while maintaining high quality responses.
              </p>
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
