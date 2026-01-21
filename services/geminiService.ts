
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, ReadingMode, ActionMode, ToneMode, ChatMessage } from "../types";

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

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
        englishTeachers: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Nhiệm vụ chuyên biệt cho nhóm Tiếng Anh (Đinh Văn Thành & Hoàng Thị Vươn)" },
        artsTeachers: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Nhiệm vụ cho nhóm Nghệ thuật (Việt, Duy, Tiềm), GDTC (Hậu, Tân) và Đội (Vũ Thị Lê)" },
        socialScienceTeachers: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Nhiệm vụ cho nhóm Ngữ văn (Hà, Nhiên, Thảo, My), Sử-Địa-GDCD (Tình, Hương, Hiền, Ánh)" },
      },
      required: ["schoolBoard", "groupLeaders", "englishTeachers", "artsTeachers", "socialScienceTeachers"]
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
    Bạn là "Trợ lý nghiên cứu VB của Tổ Khoa học Xã hội", chuyên gia phân tích văn bản hành chính giáo dục.
    
    SƠ ĐỒ NHÂN SỰ TOÀN DIỆN CỦA TỔ KHXH:
    1. BAN LÃNH ĐẠO TỔ:
       - Tổ trưởng: Đỗ Hồng Hà.
       - Tổ phó: Nguyễn Phương Thảo.
    
    2. NHÓM NGỮ VĂN: 
       - Biên chế: Đỗ Hồng Hà, Hoàng Thị Nhiên, Nguyễn Phương Thảo.
       - Hợp đồng: Đ/c My.
    
    3. NHÓM TIẾNG ANH: Đinh Văn Thành, Hoàng Thị Vươn.
    
    4. NHÓM LỊCH SỬ - ĐỊA LÍ - GDCD:
       - Biên chế: Mai Văn Tình, Hoàng Thị Hương, Trương Thị Hiền.
       - Hợp đồng: Đ/c Ánh (GDCD).
    
    5. NHÓM GIÁO DỤC THỂ CHẤT: Nguyễn Đức Hậu, Nguyễn Ngọc Tân.
    
    6. NHÓM NGHỆ THUẬT & ĐỘI:
       - Mĩ thuật: Đỗ Mạnh Việt, Mai Hoàng Duy.
       - Âm nhạc & Đội: Nguyễn Văn Tiềm, Vũ Thị Lê (Tổng phụ trách Đội).
    
    NHIỆM VỤ CỦA BẠN:
    - Phân tích và trích xuất nhiệm vụ CỤ THỂ theo nhóm chuyên môn.
    - Chú ý: Các văn bản về thi đấu thể thao, sức khỏe, hội thao gán cho nhóm GDTC (Hậu, Tân). 
    - Các nhiệm vụ giảng dạy bồi dưỡng liên quan đến GV hợp đồng (My, Ánh) cần được nêu rõ.
    - Luôn trích xuất chính xác mốc thời gian (Deadline).
    
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
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

export const sendChatQuestion = async (
  currentHistory: ChatMessage[],
  newMessage: string,
  documentContext: { text: string; fileData: string | null; mimeType: string | null; analysis: AnalysisResult }
): Promise<string> => {
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
