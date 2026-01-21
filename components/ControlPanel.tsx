
import React from 'react';
import { ReadingMode, ActionMode, ToneMode } from '../types';
import { Settings, Zap, BookOpen, UserCheck, Play, Sparkles } from 'lucide-react';

interface ControlPanelProps {
  readingMode: ReadingMode;
  setReadingMode: (mode: ReadingMode) => void;
  actionMode: ActionMode;
  setActionMode: (mode: ActionMode) => void;
  toneMode: ToneMode;
  setToneMode: (mode: ToneMode) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  disabled: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  readingMode,
  setReadingMode,
  actionMode,
  setActionMode,
  toneMode,
  setToneMode,
  onAnalyze,
  isLoading,
  disabled
}) => {
  return (
    <div className="block-3d p-8">
      <h2 className="text-xl font-extrabold text-gray-800 mb-8 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-xl"><Settings className="w-5 h-5 text-white" /></div>
        Cấu hình thông minh
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {/* Reading Mode */}
        <div className="space-y-3">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Chế độ đọc
          </label>
          <div className="block-3d-inset p-1">
            <select 
              value={readingMode}
              onChange={(e) => setReadingMode(e.target.value as ReadingMode)}
              className="w-full p-4 bg-transparent rounded-xl text-gray-700 font-bold outline-none cursor-pointer appearance-none"
            >
              {Object.values(ReadingMode).map((mode) => (
                <option key={mode} value={mode}>{mode}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Mode */}
        <div className="space-y-3">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <UserCheck className="w-4 h-4" /> Chế độ nhiệm vụ
          </label>
          <div className="block-3d-inset p-1">
            <select 
              value={actionMode}
              onChange={(e) => setActionMode(e.target.value as ActionMode)}
              className="w-full p-4 bg-transparent rounded-xl text-gray-700 font-bold outline-none cursor-pointer appearance-none"
            >
              {Object.values(ActionMode).map((mode) => (
                <option key={mode} value={mode}>{mode}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tone Mode */}
        <div className="space-y-3">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-4 h-4" /> Giọng điệu AI
          </label>
          <div className="block-3d-inset p-1">
            <select 
              value={toneMode}
              onChange={(e) => setToneMode(e.target.value as ToneMode)}
              className="w-full p-4 bg-transparent rounded-xl text-gray-700 font-bold outline-none cursor-pointer appearance-none"
            >
              {Object.values(ToneMode).map((mode) => (
                <option key={mode} value={mode}>{mode}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={onAnalyze}
        disabled={disabled || isLoading}
        className={`w-full group relative overflow-hidden py-6 px-10 rounded-[2rem] font-black text-xl text-white shadow-2xl transition-all active:scale-95
          ${disabled || isLoading 
            ? 'bg-gray-400 cursor-not-allowed opacity-50' 
            : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 hover:shadow-blue-500/40 transform hover:-translate-y-1'
          }`}
      >
        <div className="relative z-10 flex items-center justify-center gap-4">
          {isLoading ? (
            <>
              <svg className="animate-spin h-7 w-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>ĐANG XỬ LÝ SIÊU TỐC...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-7 h-7 fill-white/20 animate-pulse" />
              <span>PHÂN TÍCH VĂN BẢN NGAY</span>
            </>
          )}
        </div>
        <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12"></div>
      </button>
    </div>
  );
};

export default ControlPanel;
