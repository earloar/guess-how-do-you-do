import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fortune } from '../data/fortunes';
import { explainFortune } from '../services/gemini';
import { Sparkles, RefreshCw, BookOpen, ChevronDown, ArrowLeft } from 'lucide-react';

interface ResultProps {
  module: string;
  userName: string;
  userBirthday: string;
  fortune: Fortune;
  onReset: () => void;
}

export const Result = ({ module, userName, userBirthday, fortune, onReset }: ResultProps) => {
  const [showMeaning, setShowMeaning] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExplain = async () => {
    setLoading(true);
    const result = await explainFortune(module, userName, userBirthday, fortune.rank, fortune.poem, fortune.meaning);
    setExplanation(result);
    setLoading(false);
  };

  return (
    <div className="w-full h-full overflow-y-auto pb-20 pt-6 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-full max-w-md mx-auto bg-amber-50 rounded-2xl shadow-2xl overflow-hidden border-4 border-amber-800/20"
      >
        {/* Header */}
        <div className="bg-amber-800 text-amber-50 p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')]"></div>
          <h2 className="text-2xl font-bold mb-2 relative z-10">{module} 灵签</h2>
          <div className="inline-block bg-amber-100 text-amber-900 px-6 py-2 rounded-full text-3xl font-black tracking-widest shadow-inner relative z-10">
            {fortune.rank}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-6 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')]">
          
          {/* Poem */}
          <div className="space-y-4">
            <div className="flex justify-center mb-4">
              <div className="w-1 h-12 bg-amber-800/30 rounded-full"></div>
            </div>
            <p className="text-2xl font-serif text-amber-900 leading-loose tracking-widest whitespace-pre-line" style={{ writingMode: 'vertical-rl', margin: '0 auto', height: '240px' }}>
              {fortune.poem}
            </p>
            <div className="flex justify-center mt-4">
              <div className="w-1 h-12 bg-amber-800/30 rounded-full"></div>
            </div>
          </div>

          {/* Reveal Meaning Button */}
          {!showMeaning && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMeaning(true)}
              className="mx-auto flex items-center gap-2 px-6 py-3 bg-amber-200 text-amber-900 rounded-full font-bold shadow-md hover:bg-amber-300 transition-colors cursor-pointer"
            >
              查看释文 <ChevronDown className="w-4 h-4" />
            </motion.button>
          )}

          <AnimatePresence>
            {showMeaning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-6 overflow-hidden"
              >
                {/* Meaning */}
                <div className="bg-amber-100/50 p-5 rounded-xl border border-amber-200 text-left">
                  <p className="text-amber-900 text-base leading-relaxed">
                    <span className="font-bold block mb-2 text-lg border-b border-amber-200 pb-2">签意：</span>
                    {fortune.meaning}
                  </p>
                </div>

                {/* Actions */}
                {!explanation && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleExplain}
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-amber-700 to-amber-900 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                  >
                    {loading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                    {loading ? '大师正在解签...' : '请大师解签'}
                  </motion.button>
                )}

                {/* Explanation */}
                {explanation && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-left bg-white p-6 rounded-xl shadow-inner border border-amber-100"
                  >
                    <div className="flex items-center gap-2 mb-4 text-amber-800 font-bold text-lg border-b border-amber-100 pb-3">
                      <BookOpen className="w-6 h-6" />
                      大师解签
                    </div>
                    <div className="prose prose-amber max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                      {explanation}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Fixed Return Button */}
      <div className="mt-8 flex justify-center pb-8">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-8 py-3 bg-slate-800 text-white rounded-full shadow-lg hover:bg-slate-700 transition-colors font-medium cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          返回重摇
        </button>
      </div>
    </div>
  );
};
