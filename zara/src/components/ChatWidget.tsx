'use client';

import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { t, getLanguageCode } from '@/lib/translations';
import { sendChatMessage, getChatMessages, ChatMessage as APIChatMessage } from '@/lib/api';

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  time: string;
}

export function ChatWidget() {
  const { language } = useLanguage();
  const [currentLang, setCurrentLang] = useState<string>('en');
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showUserInfo, setShowUserInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentLang(getLanguageCode());
    
    const handleLanguageChange = () => {
      setCurrentLang(getLanguageCode());
    };
    
    const interval = setInterval(handleLanguageChange, 500);
    window.addEventListener('storage', handleLanguageChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleLanguageChange);
    };
  }, [language]);

  // Load user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserName(user.name || '');
        setUserEmail(user.email || '');
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  // Load chat messages from API when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      loadChatMessages();
    }
  }, [isOpen, isMinimized]);

  const loadChatMessages = async () => {
    try {
      const apiMessages = await getChatMessages(0, 50);
      
      // Transform API messages to chat format
      const transformedMessages: ChatMessage[] = [];
      
      // Add initial greeting if no messages
      if (apiMessages.length === 0) {
        transformedMessages.push({
          id: 1,
          text: t('chat.hello', currentLang),
          sender: 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      } else {
        // Sort by created_at ascending (oldest first)
        const sortedMessages = [...apiMessages].sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        
        sortedMessages.forEach((apiMsg) => {
          // Add user message
          transformedMessages.push({
            id: apiMsg.id * 2,
            text: apiMsg.message,
            sender: 'user',
            time: new Date(apiMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
          
          // Add admin reply if exists
          if (apiMsg.admin_reply) {
            transformedMessages.push({
              id: apiMsg.id * 2 + 1,
              text: apiMsg.admin_reply,
              sender: 'bot',
              time: new Date(apiMsg.updated_at || apiMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            });
          }
        });
      }
      
      setMessages(transformedMessages);
    } catch (error) {
      console.error('Error loading chat messages:', error);
      // Show initial greeting on error
      setMessages([{
        id: 1,
        text: t('chat.hello', currentLang),
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Check if user info is needed
      if (!userName || !userEmail) {
        setShowUserInfo(true);
        return;
      }

      const messageText = message.trim();
      setMessage('');
      setIsSending(true);

      // Add user message immediately
      const newMessage: ChatMessage = {
        id: Date.now(),
        text: messageText,
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, newMessage]);

      try {
        // Send to API
        await sendChatMessage({
          name: userName,
          email: userEmail,
          message: messageText,
        });

        // Add bot response
        const botResponse: ChatMessage = {
          id: Date.now() + 1,
          text: t('chat.thankYou', currentLang),
          sender: 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botResponse]);

        // Reload messages to get any admin replies
        setTimeout(() => {
          loadChatMessages();
        }, 1000);
      } catch (error) {
        console.error('Error sending message:', error);
        // Show error message
        const errorMessage: ChatMessage = {
          id: Date.now() + 1,
          text: t('chat.error', currentLang),
          sender: 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleSaveUserInfo = () => {
    if (userName.trim() && userEmail.trim()) {
      setShowUserInfo(false);
      // Save to localStorage
      const userData = localStorage.getItem('user_data');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          user.name = userName;
          user.email = userEmail;
          localStorage.setItem('user_data', JSON.stringify(user));
        } catch (e) {
          console.error('Error saving user data:', e);
        }
      }
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
          aria-label="Open chat"
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
                    {t('chat.support', currentLang)}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xs text-white/80"
                  >
                    {t('chat.weAreHere', currentLang)}
                  </motion.p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="Minimize chat"
                >
                  <Minimize2 className="w-4 h-4" strokeWidth={1.5} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="Close chat"
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
                    {/* User Info Form */}
                    {showUserInfo && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4"
                      >
                        <p className="text-xs text-yellow-800 mb-2 font-medium">
                          {currentLang === 'en' && 'Please enter your name and email to continue'}
                          {currentLang === 'ru' && 'Пожалуйста, введите ваше имя и email для продолжения'}
                          {currentLang === 'uz' && 'Davom etish uchun ismingiz va emailingizni kiriting'}
                          {currentLang === 'es' && 'Por favor, ingresa tu nombre y email para continuar'}
                        </p>
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder={currentLang === 'en' ? 'Your name' : currentLang === 'ru' ? 'Ваше имя' : currentLang === 'uz' ? 'Ismingiz' : 'Tu nombre'}
                            className="w-full px-3 py-2 text-xs border border-yellow-300 rounded focus:outline-none focus:border-yellow-500"
                          />
                          <input
                            type="email"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            placeholder={currentLang === 'en' ? 'Your email' : currentLang === 'ru' ? 'Ваш email' : currentLang === 'uz' ? 'Emailingiz' : 'Tu email'}
                            className="w-full px-3 py-2 text-xs border border-yellow-300 rounded focus:outline-none focus:border-yellow-500"
                          />
                          <button
                            onClick={handleSaveUserInfo}
                            disabled={!userName.trim() || !userEmail.trim()}
                            className="w-full bg-[#2c3b6e] text-white px-3 py-2 text-xs rounded hover:bg-black transition-colors disabled:opacity-50"
                          >
                            {currentLang === 'en' ? 'Continue' : currentLang === 'ru' ? 'Продолжить' : currentLang === 'uz' ? 'Davom etish' : 'Continuar'}
                          </button>
                        </div>
                      </motion.div>
                    )}

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
                        placeholder={t('chat.placeholder', currentLang)}
                        disabled={isSending || showUserInfo}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2c3b6e] text-sm tracking-wide transition-colors disabled:opacity-50"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 15 }}
                        whileTap={{ scale: 0.9 }}
                        type="submit"
                        disabled={!message.trim() || isSending || showUserInfo}
                        className="bg-[#2c3b6e] text-white p-2 rounded-lg hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={t('chat.send', currentLang)}
                      >
                        {isSending ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          >
                            <Send className="w-4 h-4" strokeWidth={1.5} />
                          </motion.div>
                        ) : (
                          <Send className="w-4 h-4" strokeWidth={1.5} />
                        )}
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
