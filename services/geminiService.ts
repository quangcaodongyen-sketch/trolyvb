
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, ReadingMode, ActionMode, ToneMode, ChatMessage } from "../types";

// Hàm lấy API Key an toàn
const getApiKey = () => {
  const savedKey = localStorage.getItem('GEMINI_API_KEY');
  if (savedKey) return savedKey.trim();
  const envKey = (window as any).process?.env?.API_KEY || process.env.API_KEY || "";
  return envKey.trim();
};

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    superSummary: { type: Type.STRING, description: "A very short, high-level summary (1-2 sentences)." },
    standardSummary: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        legalBasis: { type: Type.STRING },
        scope: { type: Type.STRING },
        subjects: { type: Type.STRING },
        mainContent: { type: Type.STRING },
        validity: { type: Type.STRING },
      },
      required: ["title", "legalBasis", "scope", "subjects", "mainContent", "validity"]
    },
    bulletPoints: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Key points readable in 10 seconds."
    },
    deepAnalysis: {
      type: Type.OBJECT,
      properties: {
        legalExplanation: { type: Type.STRING },
        newPoints: { type: Type.STRING },
        impact: { type: Type.STRING },
        risks: { type: Type.STRING },
        recommendations: { type: Type.STRING },
      },
      required: ["legalExplanation", "newPoints", "impact", "risks", "recommendations"]
    },
    tasks: {
      type: Type.OBJECT,
      properties: {
        schoolBoard: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Nhiệm vụ dành cho Ban Giám Hiệu" },
        groupLeaders: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Nhiệm vụ cho Tổ trưởng Đỗ Hồng Hà & Tổ phó Nguyễn Phương Thảo" },
        homeroomTeachers: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Nhiệm vụ dành riêng cho các GVCN (Hà, Thảo, Nhiên, Tình, Hương, Hiền, Hậu, Tân, Việt, Duy, Tiềm)" },
        englishTeachers: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Nhiệm vụ chuyên biệt cho nhóm Tiếng Anh (Đinh Văn Thành & Hoàng Thị Vươn)" },
        artsTeachers: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Nhiệm vụ cho nhóm Nghệ thuật, GDTC và Đội" },
        socialScienceTeachers: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Nhiệm vụ chung cho các giáo viên còn lại trong tổ" },
      },
      required: ["schoolBoard", "groupLeaders", "homeroomTeachers", "englishTeachers", "artsTeachers", "socialScienceTeachers"]
    },
    checklist: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          step: { type: Type.STRING },
          details: { type: Type.STRING },
          timeline: { type: Type.STRING },
          assignee: { type: Type.STRING }
        },
        required: ["step", "details", "timeline", "assignee"]
      }
    }
  },
  required: ["superSummary", "standardSummary", "bulletPoints", "deepAnalysis", "tasks", "checklist"]
};

const getSystemInstruction = (options?: { readingMode?: ReadingMode, toneMode?: ToneMode }) => `
    Bạn là "Trợ lý nghiên cứu VB của Tổ Khoa học Xã hội", chuyên gia phân tích văn bản hành chính giáo dục của Trường THCS Đồng Yên.
    
    SƠ ĐỒ NHÂN SỰ VÀ CÔNG TÁC CHỦ NHIỆM:
    1. LÃNH ĐẠO TỔ:
       - Tổ trưởng: Đỗ Hồng Hà (CN 8C1).
       - Tổ phó: Nguyễn Phương Thảo (CN 6A5).
    
    2. DANH SÁCH GVCN TRONG TỔ (Rất quan trọng):
       - Khối 6: Nguyễn Phương Thảo (6A5), Trương Thị Hiền (6A3), Mai Hoàng Duy (6A2).
       - Khối 7: Hoàng Thị Nhiên (7B1), Đỗ Mạnh Việt (7B3), Nguyễn Ngọc Tân (7B4).
       - Khối 8: Đỗ Hồng Hà (8C1), Hoàng Thị Hương (8C3), Nguyễn Văn Tiềm (8C4).
       - Khối 9: Mai Văn Tình (9D3), Nguyễn Đức Hậu (9D1).
    
    3. CÁC NHÓM CHUYÊN MÔN KHÁC:
       - Tiếng Anh: Đinh Văn Thành, Hoàng Thị Vươn.
       - Tổng phụ trách Đội: Vũ Thị Lê.
       - GV Hợp đồng: Đ/c My (Văn), Đ/c Ánh (GDCD).
    
    NHIỆM VỤ CỦA BẠN:
    - Nếu văn bản có nội dung về quản lý lớp, thu nộp, phong trào học sinh, hãy trích xuất nhiệm vụ CỤ THỂ vào mục "homeroomTeachers".
    - Ghi rõ tên lớp bên cạnh tên giáo viên khi giao việc (Ví dụ: "Đ/c Tình (9D3): Triển khai...").
    - Đối với văn bản chuyên môn (soạn giảng, thi GVG), gán cho các nhóm bộ môn tương ứng.
    - Luôn đảm bảo trích xuất chính xác mốc thời gian (Deadline).
    
    ${options ? `Chế độ: ${options.readingMode}, Giọng văn: ${options.toneMode}` : ''}
`;

export const analyzeDocument = async (
  text: string,
  fileData: string | null,
  fileMimeType: string | null,
  userRequest: string,
  options: {
    readingMode: ReadingMode;
    actionMode: ActionMode;
    toneMode: ToneMode;
  }
): Promise<AnalysisResult> => {
  const key = getApiKey();
  if (!key) throw new Error("Chưa có API Key. Vui lòng nhập Key ở ô cấu hình phía trên.");
  
  const ai = new GoogleGenAI({ apiKey: key });
  const modelId = "gemini-3-flash-preview"; 
  let systemInstruction = getSystemInstruction(options);
  if (userRequest) systemInstruction += `\n\nLƯU Ý RIÊNG: "${userRequest}"`;

  const parts: any[] = [];
  if (fileData && fileMimeType) parts.push({ inlineData: { mimeType: fileMimeType, data: fileData } });
  if (text) parts.push({ text: text });

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: { parts: parts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.1,
      },
    });
    return JSON.parse(response.text || "{}") as AnalysisResult;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw new Error(error.message || "Lỗi kết nối API Gemini.");
  }
};

export const sendChatQuestion = async (
  currentHistory: ChatMessage[],
  newMessage: string,
  documentContext: { text: string; fileData: string | null; mimeType: string | null; analysis: AnalysisResult }
): Promise<string> => {
  const key = getApiKey();
  if (!key) throw new Error("Chưa có API Key.");

  const ai = new GoogleGenAI({ apiKey: key });
  const modelId = "gemini-3-flash-preview";
  const history: any[] = [];
  const docParts: any[] = [];
  if (documentContext.fileData && documentContext.mimeType) docParts.push({ inlineData: { mimeType: documentContext.mimeType, data: documentContext.fileData } });
  if (documentContext.text) docParts.push({ text: documentContext.text });
  
  history.push({ role: 'user', parts: docParts });
  history.push({ role: 'model', parts: [{ text: JSON.stringify(documentContext.analysis) }] });
  currentHistory.forEach(msg => history.push({ role: msg.role, parts: [{ text: msg.text }] }));

  const chat = ai.chats.create({
    model: modelId,
    config: { systemInstruction: getSystemInstruction() },
    history
  });

  const result = await chat.sendMessage({ message: newMessage });
  return result.text || "";
};
