import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Briefcase } from 'lucide-react';

interface HomeProps {
  onSelectModule: (module: string) => void;
}

const modules = [
  { id: '考研上岸', title: '考研上岸', icon: GraduationCap, color: 'from-blue-600 to-blue-800', desc: '金榜题名，一研为定' },
  { id: '省考上岸', title: '省考上岸', icon: BookOpen, color: 'from-red-600 to-red-800', desc: '公考顺利，成功上岸' },
  { id: '事业编上岸', title: '事业编上岸', icon: Briefcase, color: 'from-emerald-600 to-emerald-800', desc: '编制在手，前程无忧' },
];

export const Home = ({ onSelectModule }: HomeProps) => {
  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500 drop-shadow-sm">
          灵签祈福
        </h1>
        <p className="text-amber-100/80 text-sm tracking-widest">
          心诚则灵，摇签问卜
        </p>
      </motion.div>

      <div className="space-y-4">
        {modules.map((m, i) => (
          <motion.button
            key={m.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectModule(m.id)}
            className={`w-full p-6 rounded-2xl bg-gradient-to-r ${m.color} text-white shadow-xl flex items-center gap-6 relative overflow-hidden group`}
          >
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
            
            <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm relative z-10">
              <m.icon className="w-8 h-8 text-white" />
            </div>
            
            <div className="text-left relative z-10">
              <h3 className="text-2xl font-bold tracking-wider mb-1">{m.title}</h3>
              <p className="text-white/80 text-sm">{m.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-amber-200/50 text-xs mt-12"
      >
        仅供娱乐，相信自己，努力必有回报
      </motion.div>
    </div>
  );
};
