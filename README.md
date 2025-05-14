# MindMate AI

A compassionate AI-powered chatbot application that provides mental health support and therapeutic conversations using Google's Gemini API. This application offers a safe space for users to discuss their feelings, get emotional support, and receive helpful guidance.

## Features

- **Therapeutic Conversations**: Engages in empathetic dialogue to provide emotional support
- **Dark/Light Mode**: Comfortable viewing experience with theme options
- **Bullet-Point Responses**: Clear, structured responses for better readability
- **Conversational UI**: Natural, friendly chat interface
- **Secure API Integration**: Easy and secure Gemini API key management
- **Modern Design**: Built with React, Tailwind CSS, and shadcn/ui for an accessible user experience

## Installation

1. Clone the repository:
```bash
git clone https://github.com/aashif000/Wiki_AI_Agent/master/
cd mental-health-assistant
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Set up your Gemini API key:
   - Sign up for a Gemini API key at https://ai.google.dev/
   - Add your API key through the sidebar in the application
   - Your API key will be stored securely in your browser's localStorage

## Required NPM Packages

This project uses the following key dependencies:
- React and React DOM
- TypeScript
- TanStack Query (React Query)
- shadcn/ui components
- Tailwind CSS
- Lucide React (for icons)
- UUID (for generating unique message IDs)

## How It Works

The application functions as a mental health support assistant by:

1. Engaging users in supportive conversations about their mental health concerns
2. Providing structured, easy-to-read responses with bullet points
3. Maintaining a compassionate and understanding tone throughout interactions
4. Offering practical suggestions and coping strategies when appropriate
5. Creating a safe and non-judgmental space for users to express themselves

## AI Integration

### Gemini API
Google's Gemini API is utilized for:
- Generating empathetic and supportive responses
- Maintaining context throughout conversations
- Providing structured, helpful guidance
- Ensuring responses are appropriate for mental health support

## Key Features

### Therapeutic Approach
- Empathetic and understanding responses
- Non-judgmental communication style
- Structured bullet-point format for clarity
- Support for various mental health topics

### User Experience
- Dark/Light theme support
- Clean and calming interface
- Easy-to-read message formatting
- Intuitive chat interaction

### Privacy and Security
- No conversation storage
- Secure API key management
- Client-side processing
- Privacy-focused design

## Customization

- Modify the system prompt in `src/lib/gemini.ts` to adjust the AI's therapeutic approach
- Customize the UI components in the `src/components` directory
- Adjust the Gemini API parameters to fine-tune response characteristics
- Modify the theme in `src/index.css` for different visual styles

## Important Note

This AI assistant is not a replacement for professional mental health care. If you're experiencing serious mental health issues, please seek help from qualified mental health professionals.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
