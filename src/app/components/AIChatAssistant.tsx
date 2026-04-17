import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, UserPlus } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatAssistantProps {
  patientName: string;
  condition: string;
  initialQuestion?: string;
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: `Hi Margaret! I'm your AI assistant, here to support you with your blood pressure management.\n\nI can help you:\n• Understand your Lisinopril medication\n• Learn about blood pressure targets\n• Get tips on managing side effects\n• Explore lifestyle changes for better BP control\n• Address any concerns about your treatment plan\n\nIf needed, I can also send a summary of our conversation to Dr. Mitchell.\n\nWhat questions do you have about your blood pressure today?`,
    timestamp: new Date()
  }
];

const sampleResponses: Record<string, string> = {
  'readings': `Looking at your recent blood pressure readings from your check-ins:\n\n**Current trend:** Your BP has been ranging from 145/90 to 151/94 over the past month.\n**Target:** We're aiming for below 130/80 mmHg.\n**Status:** Still elevated, but this is normal in the first 4-6 weeks of starting Lisinopril.\n\n**What this means:**\nYour medication needs more time to reach full effectiveness. Dr. Mitchell is actively monitoring these trends through your weekly check-ins.\n\n**When to worry:**\nContact Dr. Mitchell immediately if:\n- Systolic goes above 180 OR diastolic above 120\n- You have severe headache, chest pain, or vision changes\n- You experience severe dizziness or fainting\n\nYour current readings suggest continued monitoring is working well. Would you like tips on lifestyle changes that could help lower your BP faster?`,

  'target': `Your blood pressure target is **below 130/80 mmHg**.\n\n**Why this target?**\nFor someone your age (67) with new-onset hypertension, getting BP under 130/80 reduces your risk of:\n- Heart attack by 25%\n- Stroke by 35%\n- Heart failure by 50%\n\n**Current readings vs target:**\nYour most recent: 151/94\nTarget: <130/80\nGap: Need to lower systolic by ~21 points, diastolic by ~14 points\n\n**Timeline:**\nLisinopril typically shows full effects in 4-6 weeks. You're currently at week 4. If you're not at target by week 6-8, Dr. Mitchell may:\n- Increase your Lisinopril dose to 20mg\n- Add a second medication\n- Order labs to check kidney function\n\nStay consistent with your medication and check-ins - you're on the right track!`,

  'medication': `You're taking **Lisinopril 10mg** once daily for blood pressure control.\n\n**How it works:**\nLisinopril is an ACE inhibitor. It blocks an enzyme that tightens blood vessels, allowing them to relax and widen. This makes it easier for your heart to pump blood, lowering your pressure.\n\n**Your specific plan:**\n- **Dose:** 10mg (starting dose)\n- **Timing:** Take every morning\n- **Started:** March 12, 2026\n- **Duration so far:** 4 weeks\n\n**Common side effects you might experience:**\n✓ Dry cough (20-30% of people)\n✓ Dizziness when standing (you've reported this)\n✓ Mild headaches (you've reported this)\n✓ Fatigue\n\n**Managing your side effects:**\nThe dizziness and headaches you mentioned are typical in weeks 1-4 and usually improve by week 6. Stand up slowly, stay hydrated, and avoid hot showers.\n\nWould you like to send a note to Dr. Mitchell about your side effects?`,

  'diet': `Diet can lower your blood pressure by 8-14 mmHg - that's almost as much as medication! Here's your personalized nutrition plan:\n\n**The DASH Diet for BP Control:**\n\n**Prioritize (these lower BP):**\n- Potassium-rich foods: bananas, sweet potatoes, spinach, avocados\n- Magnesium sources: almonds, black beans, dark chocolate\n- Calcium from: low-fat yogurt, kale, sardines\n- Whole grains: oatmeal, brown rice, whole wheat bread\n\n**Limit strictly (these raise BP):**\n- **Sodium:** Target <1,500mg/day (you're likely at 3,400mg now)\n  - Hidden sources: bread, cheese, deli meats, canned soups\n  - One restaurant meal can have 2,000mg!\n- Processed foods\n- Alcohol (max 1 drink/day for women)\n\n**Quick wins this week:**\n1. Swap table salt for Mrs. Dash or lemon juice\n2. Choose fresh/frozen veggies over canned\n3. Read labels - aim for <200mg sodium per serving\n4. Add one banana daily (great potassium source)\n\n**Expected impact:**\nFollowing this strictly could lower your BP by 10 points in 2 weeks.\n\nWant me to send these recommendations to Dr. Mitchell for review?`,

  'exercise': `Physical activity is one of the most effective ways to lower blood pressure naturally. Here's what I recommend:\n\n**Your personalized exercise plan:**\n\n**Cardiovascular exercise (most important for BP):**\n- 30 minutes of moderate activity, 5 days per week\n- Good options: brisk walking, swimming, cycling, dancing\n- You should be able to talk but not sing during exercise\n\n**Strength training:**\n- 2 days per week\n- Focus on major muscle groups\n- Use light weights or resistance bands\n\n**Getting started safely:**\n- Start slowly if you're not currently active\n- Warm up for 5 minutes before exercise\n- Cool down and stretch afterward\n- Stay hydrated\n- Stop if you feel chest pain, severe shortness of breath, or dizziness\n\n**Track your progress:**\n- Many patients see a 5-8 mmHg reduction in blood pressure with regular exercise\n- It may take 1-3 months to see significant changes\n\nDo you have any physical limitations I should know about?`,

  'side effects': `Looking at your check-in history, you've reported:\n✓ Dizziness when standing up quickly\n✓ Afternoon headaches\n\nLet me help you understand and manage these:\n\n**Your dizziness (Orthostatic hypotension):**\n- **Why it happens:** Lisinopril lowers your BP, and when you stand quickly, blood pools in your legs temporarily\n- **Timeline:** Usually improves by week 6-8\n- **Management:**\n  1. Stand up in stages: sit first, wait 30 seconds, then stand\n  2. Drink 8 glasses of water daily\n  3. Avoid hot showers (they dilate vessels more)\n  4. Flex your legs before standing\n\n**Your headaches:**\n- **Why it happens:** Your brain is adjusting to different blood flow patterns\n- **Typically resolves:** Week 4-6 (you're at week 4 now)\n- **Red flags to watch:** Severe pain, vision changes, confusion\n\n**Should Dr. Mitchell adjust your medication?**\nNot yet. These are expected side effects that usually resolve. However, if they worsen or don't improve by week 6, she may:\n- Switch you to a different ACE inhibitor\n- Try an ARB medication instead\n- Adjust your dose\n\nWould you like me to send Dr. Mitchell a message about your symptoms so she's aware?`,

  'concern': `I understand you have concerns about your blood pressure treatment. I'm here to help address them.\n\n**Common concerns I can help with:**\n\n**About your medication:**\n- "Is Lisinopril safe long-term?"\n- "What if I miss a dose?"\n- "Can I take other medications with this?"\n- "Are there natural alternatives?"\n\n**About your readings:**\n- "Why isn't my BP going down faster?"\n- "What if my numbers are high today?"\n- "How accurate are home monitors?"\n\n**About treatment plan:**\n- "Will I need this medication forever?"\n- "Can I stop if my BP normalizes?"\n- "What if side effects don't improve?"\n\n**About lifestyle:**\n- "Do I really need to exercise?"\n- "How strict should I be with salt?"\n- "Can I drink alcohol?"\n\nPlease share your specific concern, and if it requires Dr. Mitchell's input, I can send her a summary of our conversation.\n\nWhat's on your mind?`,

  'doctor': `I can help you send a message to Dr. Mitchell about our conversation.\n\n**When to loop in Dr. Mitchell:**\n- You have concerns about side effects\n- You want to discuss adjusting your medication\n- Your BP readings are concerning you\n- You have questions only she can answer\n- You want her to review our discussion\n\n**What I'll send her:**\nA concise summary including:\n- Your main questions/concerns\n- Information I provided\n- Any symptoms or issues you mentioned\n- My recommendation for follow-up\n\nDr. Mitchell will review it within 24 hours and respond through your patient portal or call if needed.\n\nWould you like me to prepare a summary now?`,

  'default': `I'm specifically focused on helping you manage your blood pressure and Lisinopril medication.\n\n**I can help you with:**\n\n📊 **Understanding your readings**\n- What your numbers mean\n- Your BP trends and targets\n- When readings are concerning\n\n💊 **Medication guidance**\n- How Lisinopril works\n- Managing side effects\n- Timing and dosing questions\n\n🥗 **Lifestyle changes**\n- DASH diet for BP control\n- Exercise recommendations\n- Stress management techniques\n\n⚠️ **Addressing concerns**\n- Side effect management\n- Treatment plan questions\n- When to contact Dr. Mitchell\n\n👨‍⚕️ **Connecting with your doctor**\n- Send conversation summaries\n- Request follow-up\n- Share new symptoms\n\nWhat would you like to discuss about your blood pressure management?`
};

export default function AIChatAssistant({ patientName, condition, initialQuestion = '' }: AIChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState(initialQuestion);
  const [isTyping, setIsTyping] = useState(false);
  const [showSendToDoctor, setShowSendToDoctor] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialQuestion && messages.length === 1) {
      // Auto-send the initial question after a short delay
      setTimeout(() => {
        handleSend(initialQuestion);
      }, 500);
    }
  }, [initialQuestion]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (userMessage: string): string => {
    const lowercaseMessage = userMessage.toLowerCase();

    if (lowercaseMessage.includes('reading') || lowercaseMessage.includes('number') || lowercaseMessage.includes('trend')) {
      return sampleResponses['readings'];
    } else if (lowercaseMessage.includes('target') || lowercaseMessage.includes('goal') || lowercaseMessage.includes('should be')) {
      return sampleResponses['target'];
    } else if (lowercaseMessage.includes('medication') || lowercaseMessage.includes('lisinopril') || lowercaseMessage.includes('pill') || lowercaseMessage.includes('dose')) {
      return sampleResponses['medication'];
    } else if (lowercaseMessage.includes('diet') || lowercaseMessage.includes('food') || lowercaseMessage.includes('eat') || lowercaseMessage.includes('salt') || lowercaseMessage.includes('sodium')) {
      return sampleResponses['diet'];
    } else if (lowercaseMessage.includes('exercise') || lowercaseMessage.includes('workout') || lowercaseMessage.includes('physical activity')) {
      return sampleResponses['exercise'];
    } else if (lowercaseMessage.includes('side effect') || lowercaseMessage.includes('dizzy') || lowercaseMessage.includes('headache') || lowercaseMessage.includes('symptom')) {
      return sampleResponses['side effects'];
    } else if (lowercaseMessage.includes('concern') || lowercaseMessage.includes('worried') || lowercaseMessage.includes('question about')) {
      return sampleResponses['concern'];
    } else if (lowercaseMessage.includes('doctor') || lowercaseMessage.includes('mitchell') || lowercaseMessage.includes('send') || lowercaseMessage.includes('contact')) {
      setShowSendToDoctor(true);
      return sampleResponses['doctor'];
    } else {
      return sampleResponses['default'];
    }
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI typing delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(textToSend),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    'What are my blood pressure targets?',
    'How is my Lisinopril working?',
    'What can I eat to lower my BP?',
    'Should I be concerned about side effects?'
  ];

  const handleSendToDoctor = () => {
    const summary = `**Conversation Summary for Dr. Mitchell**\n\nPatient: ${patientName}\nDate: ${new Date().toLocaleDateString()}\n\n**Topics Discussed:**\n${messages.slice(1).map(m => `- ${m.role === 'user' ? 'Patient asked' : 'AI covered'}: ${m.content.substring(0, 80)}...`).join('\n')}\n\n**Action Needed:**\nPlease review patient's questions and provide guidance as needed.\n\n---\nThis summary was generated by AI Assistant and sent at patient's request.`;

    // Simulate sending to doctor
    alert('Conversation summary sent to Dr. Mitchell!\n\nShe will review within 24 hours and respond through your patient portal or by phone if needed.');
    setShowSendToDoctor(false);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 md:px-6 md:py-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2.5 md:gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-9 h-9 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.role === 'user' ? 'bg-blue-100' : 'bg-purple-100'
            }`}>
              {message.role === 'user' ? (
                <span className="text-blue-700 text-sm">MC</span>
              ) : (
                <Sparkles className="w-4 h-4 text-purple-600" />
              )}
            </div>
            <div className={`flex-1 max-w-2xl ${message.role === 'user' ? 'flex justify-end' : ''}`}>
              <div className={`rounded-xl p-3.5 md:p-4 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="whitespace-pre-line text-sm md:text-base leading-relaxed">{message.content}</p>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-3 md:px-6 md:pb-4">
          <p className="text-gray-600 mb-2.5 md:mb-3 text-sm md:text-base">Suggested questions:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {suggestedQuestions.map((question, idx) => (
              <button
                key={idx}
                onClick={() => setInput(question)}
                className="px-3.5 py-2.5 md:px-4 md:py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-left text-sm md:text-base"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-gray-200 p-4 md:p-6 flex-shrink-0">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3 md:mb-4">
          <p className="text-amber-900 text-xs md:text-sm leading-snug">
            ⚠️ <strong>Important:</strong> This AI provides guidance on your BP management. For urgent concerns like chest pain, severe headache, or critically high BP (over 180/120), call 911 or your doctor immediately.
          </p>
        </div>

        {showSendToDoctor && messages.length > 2 && (
          <div className="mb-3 md:mb-4">
            <button
              onClick={handleSendToDoctor}
              className="w-full px-4 py-3.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <UserPlus className="w-4 h-4" />
              Send Conversation Summary to Dr. Mitchell
            </button>
          </div>
        )}

        <div className="flex gap-2 md:gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your blood pressure..."
            className="flex-1 min-w-0 px-3.5 py-3 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm md:text-base"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="px-4 md:px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2 flex-shrink-0"
          >
            <Send className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden md:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}