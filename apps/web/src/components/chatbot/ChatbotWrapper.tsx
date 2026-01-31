
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import React, { useState, useRef, useEffect } from "react";
import ChatbotIcon from "./Chatboticon";
import { useLocation } from "react-router-dom";
// Assuming your apiClient util is typed, otherwise use 'any' or define types
import apiClient from "@/lib/api/client";

const COLORS = {
  border: "#2C1810", // Dark Brown
  window: "#FFF6EE", // Off White Silk
  messages: "#F9EFE6", // Light Linen
  text: "#2C1810",
  accent: "#C1502E", // Burnt Orange
  gold: "#FF9933", // Saffron
};

// --- TAILOR MEASUREMENT ICON (Replaces Terminal Icon) ---
const BoutiqueIcon = ({ size = "md" }: { size?: "sm" | "md" }) => {
  const isSm = size === "sm";
  return (
    <div
      className={`${isSm ? 'w-8 h-8' : 'w-10 h-10'} relative flex items-center justify-center rounded-full flex-shrink-0 group`}
      style={{
        background: `linear-gradient(145deg, #2C1810, #1a0d08)`,
        boxShadow: `4px 4px 8px rgba(0,0,0,0.2)`,
        border: `2px solid ${COLORS.gold}`
      }}
    >
      <span className={`${isSm ? 'text-[10px]' : 'text-xs'} font-serif text-[#FF9933]`}>
        {isSm ? "✂️" : "🧵"}
      </span>
    </div>
  );
};

interface Message {
  from: "user" | "bot";
  text: string;
  isJson?: boolean;
}

export default function ChatbotWrapper({ currentContext }: { currentContext?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastQuestionContext = useRef(currentContext);
  const abortTypingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (currentContext?.questionId || currentContext?.topicId) {
      lastQuestionContext.current = currentContext;
    }
  }, [currentContext]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!isTyping) scrollToBottom();
  }, [messages, isTyping]);

  const toggleChat = () => {
    setIsOpen((prev) => {
      if (!prev && messages.length === 0) {
        const welcome = "Welcome to the Atelier. Tell me what you'd like to order or alter today.";
        setMessages([{ from: "bot", text: welcome }]);
      }
      return !prev;
    });
  };

  // sendMessage function inside ChatbotWrapper.tsx
const sendMessage = async () => {
  if (!input.trim() || isTyping) return;

  const userQuery = input;
  setMessages(prev => [...prev, { from: "user", text: userQuery }]);
  setInput("");
  setIsWaiting(true);

  try {
    // STEP 1: Normalize raw input to JSON (Observe Node Logic)
    // Ye call user message ko structured JSON mein convert karegi
    const normalizeRes = await apiClient.post("/chat/normalize", { 
      userInput: userQuery 
    });

    const structuredPayload = normalizeRes.data; 

    const response = await apiClient.post("/chat", {
      requestId: "temp-id", 
      payload: structuredPayload, 
      context: lastQuestionContext.current
    });

    setIsWaiting(false);
    if (response.data?.reply) {
      typeBotMessage(response.data.reply);
    }

  } catch (error) {
    setIsWaiting(false);
    console.error("Pipeline Error:", error);
    setMessages(prev => [...prev, { from: "bot", text: "System error: Failed to process order." }]);
  }
};

  const typeBotMessage = (fullText: string) => {
    setIsTyping(true);
    let current = "";
    const words = fullText.split(" ");
    let i = 0;

    const interval = setInterval(() => {
      if (abortTypingRef.current) {
        clearInterval(interval);
        abortTypingRef.current = false;
        setIsTyping(false);
        return;
      }
      if (i < words.length) {
        current += (i === 0 ? "" : " ") + words[i];
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.from === "bot" && i > 0) {
            return [...prev.slice(0, -1), { from: "bot", text: current }];
          }
          return [...prev, { from: "bot", text: current }];
        });
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 40);
  };

  return (
    <>
      <ChatbotIcon onClick={toggleChat} />

      <AnimatePresence>
        {isOpen && (
          <div className={`fixed right-8 bottom-8 z-50 transition-all duration-500 ${isFull ? 'inset-0' : 'w-[420px] h-[600px]'}`}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="relative flex flex-col w-full h-full overflow-hidden shadow-[20px_20px_0px_#2C1810]"
              style={{
                backgroundColor: COLORS.window,
                border: `4px solid ${COLORS.border}`,
                borderRadius: isFull ? '0' : '24px'
              }}
            >
              {/* Boutique Header */}
              <div className="flex items-center justify-between p-5 border-b-4" style={{ backgroundColor: COLORS.border }}>
                <div className="flex items-center gap-3">
                  <BoutiqueIcon />
                  <div>
                    <h2 className="text-lg font-serif font-bold text-[#FFF6EE] tracking-tight">Atelier Assistant</h2>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-[9px] uppercase tracking-[0.2em] text-[#FF9933] font-bold">Ready to Craft</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => setIsFull(!isFull)} className="text-[#FFF6EE] hover:text-[#FF9933] p-1">
                     {isFull ? "🗗" : "🗖"}
                   </button>
                   <button onClick={() => setIsOpen(false)} className="text-[#FFF6EE] hover:text-[#C1502E] p-1 font-bold text-xl">×</button>
                </div>
              </div>

              {/* Fabric/Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ backgroundColor: COLORS.messages }}>
                {messages.map((msg, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: msg.from === "user" ? 10 : -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={idx} 
                    className={`flex ${msg.from === "user" ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start gap-2 max-w-[85%] ${msg.from === "user" ? 'flex-row-reverse' : ''}`}>
                      {msg.from === "bot" && <BoutiqueIcon size="sm" />}
                      <div
                        className="p-4 border-2 font-medium text-sm leading-relaxed"
                        style={{
                          borderColor: COLORS.border,
                          backgroundColor: msg.from === "user" ? COLORS.accent : "white",
                          color: msg.from === "user" ? "white" : COLORS.text,
                          borderRadius: msg.from === "user" ? "20px 20px 4px 20px" : "4px 20px 20px 20px",
                          boxShadow: `4px 4px 0px ${msg.from === "user" ? COLORS.border : "rgba(0,0,0,0.1)"}`
                        }}
                      >
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isWaiting && (
                  <div className="flex gap-2 items-center text-[10px] font-bold text-[#C1502E] uppercase tracking-widest italic ml-10">
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce [animation-delay:0.2s]">●</span>
                    <span className="animate-bounce [animation-delay:0.4s]">●</span>
                    Drafting your request...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Order Input Area */}
              <div className="p-5 border-t-4" style={{ borderColor: COLORS.border, backgroundColor: "white" }}>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Describe your design or alteration..."
                    className="flex-1 bg-transparent border-b-2 border-[#2C1810]/20 p-2 text-sm focus:border-[#C1502E] outline-none transition-colors"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || isWaiting}
                    className="bg-[#2C1810] text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#C1502E] transition-colors disabled:opacity-50"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}