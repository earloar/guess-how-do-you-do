import React, { useState } from 'react';
import { Home } from './components/Home';
import { UserInfo } from './components/UserInfo';
import { ShakeScene } from './components/ShakeScene';
import { Result } from './components/Result';
import { getRandomFortune, Fortune } from './data/fortunes';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

type AppState = 'home' | 'userInfo' | 'shaking' | 'result';

export default function App() {
  const [appState, setAppState] = useState<AppState>('home');
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userBirthday, setUserBirthday] = useState<string>('');
  const [fortune, setFortune] = useState<Fortune | null>(null);

  const handleSelectModule = (module: string) => {
    setSelectedModule(module);
    setAppState('userInfo');
  };

  const handleUserInfoSubmit = (name: string, birthday: string) => {
    setUserName(name);
    setUserBirthday(birthday);
    setAppState('shaking');
  };

  const handleStickOut = () => {
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#f59e0b', '#d97706', '#b45309']
    });

    setFortune(getRandomFortune());
    setAppState('result');
  };

  const handleReset = () => {
    setAppState('home');
    setSelectedModule('');
    setUserName('');
    setUserBirthday('');
    setFortune(null);
  };

  return (
    <div className="w-full h-screen bg-slate-900 overflow-hidden relative font-sans">
      <AnimatePresence mode="wait">
        {appState === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="w-full h-full flex items-center justify-center z-10"
          >
            <Home onSelectModule={handleSelectModule} />
          </motion.div>
        )}

        {appState === 'userInfo' && (
          <motion.div
            key="userInfo"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full h-full flex items-center justify-center z-10"
          >
            <UserInfo 
              onSubmit={handleUserInfoSubmit} 
              onBack={() => setAppState('home')} 
            />
          </motion.div>
        )}

        {appState === 'shaking' && (
          <motion.div
            key="shaking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-0"
          >
            <ShakeScene onStickOut={handleStickOut} />
            
            <button 
              onClick={() => setAppState('userInfo')}
              className="absolute top-6 left-6 text-white/50 hover:text-white transition-colors z-20 cursor-pointer"
            >
              返回
            </button>
          </motion.div>
        )}

        {appState === 'result' && fortune && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute inset-0 z-10 bg-slate-900/90 backdrop-blur-sm"
          >
            <Result 
              module={selectedModule} 
              userName={userName}
              userBirthday={userBirthday}
              fortune={fortune} 
              onReset={handleReset} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
