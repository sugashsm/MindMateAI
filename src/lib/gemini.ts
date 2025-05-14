// and manages the chain-of-thought reasoning capabilities
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// System prompt that encourages bullet-point responses
const SYSTEM_PROMPT = `
You are an empathetic and supportive therapeutic companion. Speak directly to the person as if you're having a warm, caring conversation. Your approach should be:

<thinking>
- Listen carefully to what they're sharing
- Understand their emotions and experiences
- Consider how best to support them
- Keep responses warm and understanding
- Show genuine care and validation
- Offer gentle suggestions when appropriate
</thinking>

<conversation>
Structure your response with clear bullet points and spacing:

• Start with a warm, personal greeting...

• Share your understanding of their situation
  - Validate their feelings
  - Show empathy for their experience

• Offer gentle suggestions or ideas:
  1. First supportive idea
  2. Second supportive idea

• Add words of encouragement

• End with an open invitation to continue talking

Remember to:
- Add a blank line after each main bullet point
- Keep the tone warm and personal
- Use "you" and "I" to make it conversational
- Be genuine and compassionate
- Format numbered lists with clear spacing
</conversation>
`;

/**
 * Validates the Gemini API key format
 */
function validateApiKey(apiKey: string): boolean {
  // Basic validation for Gemini API key format
  return /^[A-Za-z0-9_-]{20,}$/.test(apiKey.trim());
}

/**
 * Extract reasoning and answer from Gemini response
 */
function extractReasoningAndAnswer(text: string): { reasoning: string; answer: string } {
  const thinkingMatch = text.match(/<thinking>([\s\S]*?)<\/thinking>/i);
  const conversationMatch = text.match(/<conversation>([\s\S]*?)<\/conversation>/i);

  const reasoning = thinkingMatch ? thinkingMatch[1].trim() : '';
  const answer = conversationMatch ? conversationMatch[1].trim() : text;

  return { reasoning, answer };
}

/**
 * Sends a request to the Gemini API using the official SDK
 */
export async function sendToGemini(
  userPrompt: string,
  contextInfo: string = '',
  apiKey: string = ''
): Promise<{ content: string; reasoning: string }> {
  // Validate API key
  if (!apiKey) {
    throw new Error('Gemini API key is not provided. Please add your API key to use this feature.');
  }

  if (!validateApiKey(apiKey)) {
    throw new Error('Invalid API key format. Please check your API key and try again.');
  }

  try {
    // Initialize the API with the provided key
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Test the API connection first
    try {
      await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).generateContent("test");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('unauthorized') || error.message.includes('invalid')) {
          throw new Error('Invalid API key. Please check your API key and try again.');
        }
      }
      throw error;
    }
    
    // Available models: gemini-1.5-flash, gemini-1.5-pro, etc.
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    // Include any context information in the prompt
    const fullPrompt = contextInfo 
      ? `${SYSTEM_PROMPT}\n\nContext information: ${contextInfo}\n\nUser question: ${userPrompt}`
      : `${SYSTEM_PROMPT}\n\nUser question: ${userPrompt}`;

    // Generate content
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const generatedText = response.text();

    // Extract reasoning and answer
    const { reasoning, answer } = extractReasoningAndAnswer(generatedText);

    return {
      content: answer,
      reasoning: reasoning,
    };
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('quota') || error.message.includes('rate limit')) {
        throw new Error('API rate limit exceeded. Please try again in a moment.');
      }
      if (error.message.includes('network') || error.message.includes('timeout')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      }
    }
    
    throw error;
  }
}