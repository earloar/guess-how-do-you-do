import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar } from 'lucide-react';

interface UserInfoProps {
  onSubmit: (name: string, birthday: string) => void;
  onBack: () => void;
}

export const UserInfo = ({ onSubmit, onBack }: UserInfoProps) => {
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && birthday) {
      onSubmit(name, birthday);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-amber-50 rounded-2xl shadow-2xl p-8 border-4 border-amber-800/20"
      >
        <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center">心诚则灵 · 录入生辰</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-amber-800 font-medium flex items-center gap-2">
              <User className="w-4 h-4" /> 姓名
            </label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
              placeholder="请输入您的姓名"
            />
          </div>
          <div className="space-y-2">
            <label className="text-amber-800 font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" /> 出生日期
            </label>
            <input 
              type="date" 
              required
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full p-3 rounded-xl border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
            />
          </div>
          <div className="pt-4 flex gap-4">
            <button 
              type="button"
              onClick={onBack}
              className="flex-1 py-3 text-amber-700 bg-amber-100/50 hover:bg-amber-200/50 rounded-xl font-medium transition-colors cursor-pointer"
            >
              返回
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-amber-700 to-amber-900 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              开始摇签
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
