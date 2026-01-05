'use client';

import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ id: number; text: string; sender: 'user' | 'bot'; time: string }>>([
    {
      id: 1,
      text: 'Hello! How can I help you today?',
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: 'user' as const,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMessage]);
      setMessage('');

      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          text: 'Thank you for your message! Our team will get back to you soon.',
          sender: 'bot' as const,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botResponse]);
      }, 1000);
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
          }}
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-6 right-6 z-50 bg-[#2c3b6e] text-white p-4 rounded-full shadow-2xl hover:bg-black transition-colors"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            <MessageCircle className="w-6 h-6" strokeWidth={1.5} />
          </motion.div>
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8, x: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              x: 0,
            }}
            exit={{ 
              opacity: 0, 
              y: 50, 
              scale: 0.8,
              x: 20,
            }}
            transition={{ 
              duration: 0.4, 
              ease: [0.25, 0.1, 0.25, 1],
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
            className={`fixed bottom-6 right-6 z-50 bg-white shadow-2xl rounded-xl overflow-hidden flex flex-col border border-gray-100 transition-all duration-300 ${
              isMinimized ? 'w-[320px] h-16' : 'w-[380px] h-[500px] max-h-[calc(100vh-3rem)]'
            }`}
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#2c3b6e]"
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="bg-white/20 p-2 rounded"
                >
                  <MessageCircle className="w-4 h-4 text-white" strokeWidth={1.5} />
                </motion.div>
                <div>
                  <motion.h3
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-sm font-medium text-white tracking-wide"
                  >
                    Liberty Support
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xs text-white/80"
                  >
                    We're here to help
                  </motion.p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <Minimize2 className="w-4 h-4" strokeWidth={1.5} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </motion.button>
              </div>
            </motion.div>

            {/* Messages */}
            <AnimatePresence>
              {!isMinimized && (
                <>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ 
                      delay: 0.2, 
                      duration: 0.3,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
                  >
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ 
                      opacity: 0, 
                      x: msg.sender === 'user' ? 30 : -30,
                      scale: 0.8,
                    }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      scale: 1,
                    }}
                    transition={{ 
                      delay: index * 0.08, 
                      duration: 0.4,
                      type: 'spring',
                      stiffness: 200,
                      damping: 20,
                    }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`max-w-[75%] rounded-lg px-4 py-2 ${
                        msg.sender === 'user'
                          ? 'bg-[#2c3b6e] text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm tracking-wide">{msg.text}</p>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.08 + 0.2 }}
                        className={`text-xs mt-1 ${
                          msg.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                        }`}
                      >
                        {msg.time}
                      </motion.p>
                    </motion.div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </motion.div>

                  {/* Input */}
                  <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    onSubmit={handleSendMessage}
                    className="p-4 border-t border-gray-200 bg-white"
                  >
                <div className="flex items-center space-x-2">
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2c3b6e] text-sm tracking-wide transition-colors"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 15 }}
                    whileTap={{ scale: 0.9 }}
                    type="submit"
                    disabled={!message.trim()}
                    className="bg-[#2c3b6e] text-white p-2 rounded-lg hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" strokeWidth={1.5} />
                    </motion.button>
                  </div>
                  </motion.form>
                </>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

