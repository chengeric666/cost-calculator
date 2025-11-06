'use client';

import { useState } from 'react';
import { Bot, Send, HelpCircle, Book, Sparkles } from 'lucide-react';
import { AssistantMessage } from '@/types/gecom';

export default function AssistantPanel() {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      role: 'assistant',
      content:
        '👋 Hi! I\'m your GECOM Assistant. I can help you understand the cost calculation process, explain industry factors, and provide guidance on optimizing your overseas e-commerce strategy.\n\nHow can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');

  const quickQuestions = [
    'What is GECOM methodology?',
    'How do I reduce my CAC?',
    'What are industry factors?',
    'Explain M1-M8 modules',
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: AssistantMessage = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    // Generate assistant response (simplified for POC)
    const assistantMessage: AssistantMessage = {
      role: 'assistant',
      content: getAssistantResponse(input),
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage, assistantMessage]);
    setInput('');
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">GECOM Assistant</h3>
            <p className="text-xs text-gray-500">Powered by AI</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {/* Quick questions */}
        {messages.length === 1 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 font-medium">Quick questions:</p>
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="block w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Helpful resources */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <p className="text-xs font-medium text-gray-600 mb-2">Helpful Resources:</p>
        <div className="space-y-2">
          <ResourceLink
            icon={<Book className="h-4 w-4" />}
            title="GECOM Methodology"
            description="Learn about the dual-phase model"
          />
          <ResourceLink
            icon={<Sparkles className="h-4 w-4" />}
            title="Industry Factors"
            description="Pre-configured cost parameters"
          />
          <ResourceLink
            icon={<HelpCircle className="h-4 w-4" />}
            title="FAQ"
            description="Common questions answered"
          />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ResourceLink({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button className="w-full flex items-start gap-2 p-2 hover:bg-white rounded-lg transition-colors text-left">
      <div className="flex-shrink-0 mt-0.5 text-blue-600">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-gray-900">{title}</div>
        <div className="text-xs text-gray-500">{description}</div>
      </div>
    </button>
  );
}

/**
 * Simple rule-based assistant responses (for POC)
 * In production, this would call Claude API or GPT-4
 */
function getAssistantResponse(input: string): string {
  const lowerInput = input.toLowerCase();

  if (lowerInput.includes('gecom') && lowerInput.includes('method')) {
    return `📚 **GECOM Methodology Overview**

GECOM (Global E-Commerce Cost Optimization Methodology) is a dual-phase eight-module framework:

**Phase 0-1 (CAPEX):**
• M1: Market Entry - Registration, licensing, legal
• M2: Tech & Compliance - Certifications, trademarks
• M3: Supply Chain - Warehouse, inventory, systems

**Phase 1-N (OPEX):**
• M4: Goods & Tax - COGS, tariffs, VAT
• M5: Logistics - Shipping, fulfillment, warehousing
• M6: Marketing - CAC, commissions, ads
• M7: Payment - Gateway fees, FX, chargebacks
• M8: Operations - Staff, software, customer service

This framework ensures comprehensive cost visibility for cross-border e-commerce.`;
  }

  if (lowerInput.includes('cac') || lowerInput.includes('customer acquisition')) {
    return `💡 **Reducing Customer Acquisition Cost (CAC)**

Here are proven strategies to reduce CAC:

1. **Organic Channels** (CAC: $0-5)
   • SEO and content marketing
   • Social media community building
   • Referral programs

2. **Performance Marketing** (CAC: $15-30)
   • Facebook/Instagram ads with lookalike audiences
   • Google Shopping campaigns
   • TikTok organic + paid hybrid

3. **Channel-Specific**
   • Amazon: Optimize PPC, improve conversion rate
   • Shopee: Leverage platform promotions
   • DTC: Build email list, retargeting

Target: Pet <$25, Vape <$40 for healthy LTV:CAC ratio (>3:1)`;
  }

  if (lowerInput.includes('industry factor') || lowerInput.includes('factor')) {
    return `🔢 **Industry Factor Libraries**

Industry factors are pre-configured cost parameters for specific combinations of:
• Industry (Pet, Vape)
• Country (US, Vietnam, Philippines)
• Channel (Amazon FBA, Shopee, DTC, O2O)

**Data Sources:**
• Tier 1 (100%): Government agencies, official stats
• Tier 2 (90%): Industry reports, case studies
• Tier 3 (80%): Experience-based estimates

Our factors are Tier 2, based on GECOM whitepaper case studies (益家之宠, VapePro) and validated market research.

You can override any factor with your own data for more accuracy.`;
  }

  if (lowerInput.includes('m1') || lowerInput.includes('m2') || lowerInput.includes('module')) {
    return `📊 **GECOM Eight Modules Explained**

**CAPEX (One-time):**
M1: Market Entry - $3K-$10K (registration, licensing)
M2: Tech/Compliance - $2K-$8K (certifications)
M3: Supply Chain - $10K-$50K (warehouse, inventory)

**OPEX (Per unit):**
M4: Goods & Tax - Product cost + import duties + VAT
M5: Logistics - Shipping + fulfillment + storage
M6: Marketing - CAC + platform commission + ads
M7: Payment - Gateway (2.9%) + FX (1.5%) + chargebacks
M8: Operations - Customer service + staff + software

Each module captures a specific cost category for complete visibility.`;
  }

  // Default response
  return `I understand you're asking about: "${input}"

I can help you with:
• Understanding GECOM methodology
• Optimizing your cost structure
• Reducing CAC and improving margins
• Choosing the right market and channel
• Interpreting your analysis results

Try asking: "How do I improve my margins?" or "What's the best channel for pet products?"`;
}
