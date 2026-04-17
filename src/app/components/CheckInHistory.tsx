import { useState } from 'react';
import { MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { AIConversation, mockAIConversations } from '../data/mockData';
import { format } from 'date-fns';

export default function CheckInHistory() {
  const [expandedConversations, setExpandedConversations] = useState<string[]>([]);
  const conversations = mockAIConversations.filter(c => c.patientId === 'current');

  const toggleConversation = (id: string) => {
    if (expandedConversations.includes(id)) {
      setExpandedConversations(expandedConversations.filter(cid => cid !== id));
    } else {
      setExpandedConversations([...expandedConversations, id]);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-gray-900 font-medium">AI Conversation History</h2>
          <p className="text-sm text-gray-600">{conversations.length} past conversations</p>
        </div>
      </div>

      <div className="space-y-3">
        {conversations.map((conversation) => {
          const isExpanded = expandedConversations.includes(conversation.id);
          
          return (
            <div key={conversation.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleConversation(conversation.id)}
                className="w-full p-4 flex items-start justify-between hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {conversation.messages[0].content.substring(0, 80)}
                    {conversation.messages[0].content.length > 80 && '...'}
                  </p>
                  <p className="text-xs text-gray-500">{format(new Date(conversation.timestamp), 'MMM d, yyyy · h:mm a')}</p>
                  {!isExpanded && (
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2">{conversation.summary}</p>
                  )}
                </div>
                <div className="ml-4 flex-shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <div className="space-y-3 mb-4">
                    {conversation.messages.map((message, idx) => (
                      <div
                        key={idx}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 text-sm ${
                            message.role === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                            }`}
                          >
                            {format(new Date(message.timestamp), 'h:mm a')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs font-medium text-blue-700 mb-1">AI Summary for Doctor:</p>
                    <p className="text-xs text-blue-900">{conversation.summary}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {conversations.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No conversation history yet</p>
          <p className="text-xs mt-1">Start chatting with the AI assistant to see your history here</p>
        </div>
      )}
    </div>
  );
}
