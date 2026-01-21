
import React, { useRef, useState } from 'react';
import { Upload, X, FileText, File as FileIcon, Mic, MicOff, FileSpreadsheet, FileType, Plus } from 'lucide-react';

declare const mammoth: any;
declare const XLSX: any;

interface InputSectionProps {
  text: string;
  setText: (text: string) => void;
  fileData: string | null;
  setFileData: (data: string | null) => void;
  mimeType: string | null;
  setMimeType: (mime: string | null) => void;
  userRequest: string;
  setUserRequest: (req: string) => void;
}

const InputSection: React.FC<InputSectionProps> = ({ 
  text, 
  setText, 
  fileData, 
  setFileData, 
  mimeType, 
  setMimeType,
  userRequest,
  setUserRequest
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    try {
      if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
        const extractedText = `[NỘI DUNG TỪ FILE WORD: ${file.name}]\n${result.value}`;
        setText(text ? text + "\n\n" + extractedText : extractedText);
        setFileData(null); 
        setMimeType(null);
      } 
      else if (file.type.includes("sheet") || file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        let extractedText = `[NỘI DUNG TỪ FILE EXCEL: ${file.name}]\n`;
        workbook.SheetNames.forEach((sheetName: string) => {
          const worksheet = workbook.Sheets[sheetName];
          const csv = XLSX.utils.sheet_to_csv(worksheet);
          extractedText += `--- Sheet: ${sheetName} ---\n${csv}\n`;
        });
        setText(text ? text + "\n\n" + extractedText : extractedText);
        setFileData(null);
        setMimeType(null);
      }
      else {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          const base64Data = result.split(',')[1];
          setFileData(base64Data);
          setMimeType(file.type);
        };
        reader.readAsDataURL(file);
      }
    } catch (e) {
      console.error("File processing error:", e);
      alert("Không thể đọc nội dung file này.");
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = () => {
    setFileData(null);
    setMimeType(null);
  };

  const toggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Trình duyệt không hỗ trợ nhận diện giọng nói.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setUserRequest((prev) => prev ? `${prev} ${transcript}` : transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const renderFilePreview = () => {
    if (isProcessing) return <div className="p-8 text-blue-600 font-bold animate-pulse">ĐANG TRÍCH XUẤT...</div>;
    if (mimeType?.startsWith('image/')) {
      return <img src={`data:${mimeType};base64,${fileData}`} alt="Preview" className="max-h-[250px] w-full object-cover rounded-xl"/>;
    }
    if (mimeType === 'application/pdf') {
       return (
        <div className="flex flex-col items-center justify-center p-8 text-gray-700 bg-red-50 w-full h-full">
          <div className="bg-red-500 p-4 rounded-2xl shadow-lg mb-4">
            <FileIcon className="w-12 h-12 text-white" />
          </div>
          <p className="font-bold text-red-600 uppercase tracking-widest text-xs">Tài liệu PDF</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="block-3d p-8">
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Text Area Input */}
          <div className="flex flex-col">
            <label className="text-sm font-bold text-gray-500 mb-3 flex items-center gap-2 px-1 uppercase tracking-wider">
              <FileText className="w-5 h-5 text-blue-500" /> Nhập nội dung VB
            </label>
            <div className="block-3d-inset flex-1 min-h-[280px] p-1">
              <textarea
                className="w-full h-full p-6 bg-transparent rounded-2xl outline-none text-gray-700 font-medium placeholder-gray-400 custom-scrollbar resize-none"
                placeholder="Dán văn bản hành chính cần xử lý vào đây..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          </div>

          {/* File Upload Area */}
          <div className="flex flex-col">
            <label className="text-sm font-bold text-gray-500 mb-3 flex items-center gap-2 px-1 uppercase tracking-wider">
              <Upload className="w-5 h-5 text-indigo-500" /> Tải tài liệu đính kèm
            </label>
            <div className="flex-1 min-h-[280px] flex flex-col">
              {!fileData && !isProcessing ? (
                <div 
                  className="block-3d-inset flex-1 flex flex-col items-center justify-center group cursor-pointer hover:bg-gray-50 transition-all border-2 border-transparent hover:border-blue-200"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="btn-3d bg-white p-6 rounded-[2rem] mb-4 group-hover:scale-110 transition-transform">
                    <Plus className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-sm font-bold text-gray-700">WORD, EXCEL, PDF, ẢNH</p>
                  <p className="text-xs text-gray-400 mt-1">Kéo thả hoặc nhấp để chọn file</p>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx" onChange={handleFileChange} />
                </div>
              ) : (
                <div className="block-3d-inset relative flex-1 overflow-hidden flex items-center justify-center">
                  {renderFilePreview()}
                  <button 
                    onClick={handleRemoveFile} 
                    className="absolute top-4 right-4 bg-red-500 text-white p-2.5 rounded-2xl hover:bg-red-600 transition-all shadow-xl hover:rotate-90"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Request Section */}
        <div className="pt-6 border-t border-gray-200/50">
          <label className="text-sm font-bold text-gray-500 mb-3 flex items-center gap-2 px-1 uppercase tracking-wider">
            <Mic className="w-5 h-5 text-red-500" /> Ghi chú & Yêu cầu riêng biệt
          </label>
          <div className="relative block-3d-inset p-1">
            <textarea
              className="w-full p-5 pr-16 bg-transparent rounded-2xl outline-none text-gray-700 font-medium placeholder-gray-400 resize-none min-h-[100px]"
              placeholder="Ví dụ: 'Chỉ trích xuất các deadline của nhóm Lịch sử' hoặc 'Viết tóm tắt cho phụ huynh dễ hiểu'..."
              value={userRequest}
              onChange={(e) => setUserRequest(e.target.value)}
            />
            <button
              onClick={toggleVoiceInput}
              className={`absolute right-4 bottom-4 p-4 rounded-2xl transition-all shadow-lg ${
                isListening 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'btn-3d bg-white text-gray-600 hover:text-blue-600'
              }`}
            >
              {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputSection;
