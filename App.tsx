
import React, { useState, useEffect } from 'react';
import { ReadingMode, ActionMode, ToneMode, AnalysisResult, ChatMessage } from './types';
import InputSection from './components/InputSection';
import ControlPanel from './components/ControlPanel';
import ResultDisplay from './components/ResultDisplay';
import ChatSection from './components/ChatSection';
import { analyzeDocument, sendChatQuestion } from './services/geminiService';
import { GraduationCap, Info, School, Copyright, Key, ExternalLink, Save } from 'lucide-react';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [fileData, setFileData] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [userRequest, setUserRequest] = useState<string>('');
  
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  
  const [readingMode, setReadingMode] = useState<ReadingMode>(ReadingMode.STANDARD);
  const [actionMode, setActionMode] = useState<ActionMode>(ActionMode.ALL);
  const [toneMode, setToneMode] = useState<ToneMode>(ToneMode.EASY);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('GEMINI_API_KEY');
    if (savedKey) setApiKey(savedKey);
  }, []);

  const saveApiKey = () => {
    localStorage.setItem('GEMINI_API_KEY', apiKey);
    alert('Đã lưu API Key thành công!');
  };

  const handleAnalyze = async () => {
    if (!inputText && !fileData) return;
    setIsLoading(true);
    setError(null);
    setResult(null);
    setChatMessages([]);
    try {
      const data = await analyzeDocument(inputText, fileData, mimeType, userRequest, {
        readingMode, actionMode, toneMode
      });
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi trong quá trình xử lý văn bản.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setInputText('');
    setFileData(null);
    setMimeType(null);
    setUserRequest('');
    setResult(null);
    setError(null);
    setChatMessages([]);
  };

  const handleSendChatMessage = async (message: string) => {
    if (!result) return;
    const newUserMessage: ChatMessage = { role: 'user', text: message, timestamp: Date.now() };
    setChatMessages(prev => [...prev, newUserMessage]);
    setIsChatLoading(true);
    try {
      const responseText = await sendChatQuestion(
        chatMessages,
        message,
        { text: inputText, fileData, mimeType, analysis: result }
      );
      const newAiMessage: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
      setChatMessages(prev => [...prev, newAiMessage]);
    } catch (err) {
      const errorMessage: ChatMessage = { role: 'model', text: "Xin lỗi, đã xảy ra lỗi khi kết nối với trợ lý.", timestamp: Date.now() };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-12 bg-[#f0f4f8]">
      {/* 3D Modern Header */}
      <header className="relative pt-10 pb-24 px-4 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 skew-y-2 origin-top-left -translate-y-12 shadow-2xl"></div>
        <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-6">
          <div className="bg-white/20 p-5 rounded-[2rem] backdrop-blur-md border border-white/30 shadow-2xl animate-float">
            <School className="w-12 h-12 text-white" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg">
              Trợ lý Nghiên cứu VB
            </h1>
            <div className="mt-2 inline-flex items-center px-4 py-1.5 rounded-full bg-yellow-400 text-yellow-950 font-bold text-sm shadow-lg transform hover:scale-105 transition-transform">
              <GraduationCap className="w-4 h-4 mr-2" />
              Trường THCS Đồng Yên
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 -mt-12 relative z-10">
        {/* API KEY SECTION */}
        <div className="block-3d p-6 mb-8 bg-white/80 backdrop-blur-lg border border-white/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-xl">
                <Key className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Cấu hình Gemini API Key</h3>
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 text-xs hover:underline flex items-center gap-1 mt-0.5"
                >
                  Chưa có Key? Lấy miễn phí tại đây <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="block-3d-inset flex-1 md:w-64 p-1">
                <input 
                  type={showApiKey ? "text" : "password"} 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Dán API Key của bạn vào đây..."
                  className="w-full bg-transparent px-4 py-2 text-sm outline-none font-mono text-gray-600"
                />
              </div>
              <button 
                onClick={() => setShowApiKey(!showApiKey)}
                className="btn-3d p-2.5 bg-white text-gray-500 rounded-xl text-xs font-bold"
              >
                {showApiKey ? "Ẩn" : "Hiện"}
              </button>
              <button 
                onClick={saveApiKey}
                className="btn-3d p-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Lưu
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 p-5 mb-8 rounded-2xl shadow-xl flex items-start gap-4 animate-bounce">
            <div className="bg-red-100 p-2 rounded-full"><Info className="w-6 h-6" /></div>
            <div>
              <p className="font-bold text-lg">Phát hiện lỗi</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-10">
          {!result ? (
            <div className="grid grid-cols-1 gap-8 animate-fadeIn">
               <InputSection 
                text={inputText} 
                setText={setInputText} 
                fileData={fileData} 
                setFileData={setFileData}
                mimeType={mimeType} 
                setMimeType={setMimeType}
                userRequest={userRequest} 
                setUserRequest={setUserRequest}
              />
              <ControlPanel 
                readingMode={readingMode} setReadingMode={setReadingMode}
                actionMode={actionMode} setActionMode={setActionMode}
                toneMode={toneMode} setToneMode={setToneMode}
                onAnalyze={handleAnalyze} isLoading={isLoading}
                disabled={(!inputText && !fileData)}
              />
            </div>
          ) : (
             <div className="space-y-8 animate-slideUp">
               <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-800">Kết quả phân tích Tổ KHXH</h2>
                  </div>
                  <button 
                    onClick={handleReset} 
                    className="btn-3d px-6 py-2.5 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center gap-2"
                  >
                    ← Văn bản mới
                  </button>
               </div>
               <ResultDisplay result={result} />
               <ChatSection messages={chatMessages} onSendMessage={handleSendChatMessage} isLoading={isChatLoading} />
             </div>
          )}
        </div>
      </main>

      <footer className="max-w-5xl mx-auto px-4 mt-20 text-center">
        <div className="block-3d-inset p-6 inline-flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-gray-600 font-bold">
            <Copyright className="w-4 h-4" />
            <span>Thầy giáo Đinh Thành</span>
          </div>
          <a href="tel:0915213717" className="text-blue-600 font-extrabold text-lg hover:underline tracking-widest">
            0915.213.717
          </a>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-[0.2em] mt-2">© 2025 Tổ Khoa học Xã hội - Trường THCS Đồng Yên</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
