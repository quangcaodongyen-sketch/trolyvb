
import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { CheckCircle2, Lightbulb, ListTodo, FileText, Layers, ShieldAlert, TrendingUp, Users, School, GraduationCap, ClipboardCheck, Palette, BookOpen, Trophy, UserCheck, Star } from 'lucide-react';

interface ResultDisplayProps {
  result: AnalysisResult;
}

type TabType = 'summary' | 'analysis' | 'tasks' | 'checklist';

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<TabType>('summary');

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'summary', label: 'Tóm tắt', icon: <FileText className="w-4 h-4" /> },
    { id: 'analysis', label: 'Phân tích sâu', icon: <Layers className="w-4 h-4" /> },
    { id: 'tasks', label: 'Nhiệm vụ Tổ', icon: <ListTodo className="w-4 h-4" /> },
    { id: 'checklist', label: 'Checklist & Deadline', icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  const staffMembers = [
    { role: 'Tổ trưởng', name: 'Đỗ Hồng Hà', group: 'Ngữ văn', priority: 1 },
    { role: 'Tổ phó', name: 'Nguyễn Phương Thảo', group: 'Ngữ văn', priority: 2 },
    { role: 'Giáo viên', name: 'Hoàng Thị Nhiên', group: 'Ngữ văn', priority: 3 },
    { role: 'Giáo viên', name: 'Đinh Văn Thành', group: 'Tiếng Anh', priority: 3 },
    { role: 'Giáo viên', name: 'Hoàng Thị Vươn', group: 'Tiếng Anh', priority: 3 },
    { role: 'Giáo viên', name: 'Mai Văn Tình', group: 'Sử - Địa', priority: 3 },
    { role: 'Giáo viên', name: 'Hoàng Thị Hương', group: 'Sử - Địa', priority: 3 },
    { role: 'Giáo viên', name: 'Trương Thị Hiền', group: 'Sử - GDCD', priority: 3 },
    { role: 'Giáo viên', name: 'Nguyễn Đức Hậu', group: 'Thể chất', priority: 3 },
    { role: 'Giáo viên', name: 'Nguyễn Ngọc Tân', group: 'Thể chất', priority: 3 },
    { role: 'Giáo viên', name: 'Đỗ Mạnh Việt', group: 'Mĩ thuật', priority: 3 },
    { role: 'Giáo viên', name: 'Mai Hoàng Duy', group: 'Mĩ thuật', priority: 3 },
    { role: 'Giáo viên', name: 'Nguyễn Văn Tiềm', group: 'Âm nhạc', priority: 3 },
    { role: 'TPT Đội', name: 'Vũ Thị Lê', group: 'Âm nhạc', priority: 3 },
    { role: 'GV Hợp đồng', name: 'Đ/c My', group: 'Ngữ văn', priority: 4 },
    { role: 'GV Hợp đồng', name: 'Đ/c Ánh', group: 'GDCD', priority: 4 },
  ];

  return (
    <div className="space-y-8">
      <div className="block-3d p-6 animate-fadeIn">
        <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg"><Users className="w-5 h-5 text-white" /></div>
          Danh sách nhân sự Tổ Khoa học Xã hội
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {staffMembers.sort((a,b) => a.priority - b.priority).map((member, idx) => (
            <div key={idx} className={`block-3d-inset p-3 flex flex-col items-center text-center transition-transform hover:scale-105 ${member.priority <= 2 ? 'ring-2 ring-indigo-400/30' : ''}`}>
              {member.priority <= 2 ? (
                <Star className="w-4 h-4 text-yellow-500 mb-1 fill-yellow-500" />
              ) : (
                <div className="w-4 h-4 mb-1" />
              )}
              <span className="text-[10px] font-black uppercase text-indigo-500 tracking-tighter mb-1 leading-none">{member.role}</span>
              <span className="text-sm font-bold text-gray-800 leading-tight">{member.name}</span>
              <span className="text-[10px] text-gray-400 font-medium mt-1">{member.group}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-200 overflow-hidden min-h-[500px]">
        <div className="bg-gray-50/80 backdrop-blur-md border-b border-gray-200 p-3 flex flex-wrap gap-2 sticky top-0 z-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all
                ${activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
                  : 'text-gray-600 hover:bg-white hover:text-blue-600 hover:shadow-sm'
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 md:p-10 overflow-y-auto">
          {activeTab === 'summary' && (
            <div className="space-y-10 animate-fadeIn">
              <div className="block-3d-inset p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <h3 className="text-blue-800 font-black text-xl mb-4 flex items-center gap-3">
                  <Lightbulb className="w-6 h-6 animate-pulse" /> Siêu tóm tắt Tổ KHXH
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg font-medium">
                  {result.superSummary}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-white">
                  <h3 className="text-lg font-black text-gray-800 mb-6 border-b-2 border-blue-100 pb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-500" /> Thông tin văn bản
                  </h3>
                  <dl className="grid grid-cols-1 gap-6">
                    {[
                      { label: 'Tiêu đề', value: result.standardSummary.title },
                      { label: 'Số/Ký hiệu', value: result.standardSummary.legalBasis },
                      { label: 'Phạm vi', value: result.standardSummary.scope },
                      { label: 'Đối tượng', value: result.standardSummary.subjects },
                      { label: 'Nội dung chính', value: result.standardSummary.mainContent },
                      { label: 'Hiệu lực', value: result.standardSummary.validity },
                    ].map((item, idx) => (
                      <div key={idx} className="block-3d-inset p-4">
                        <dt className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">{item.label}</dt>
                        <dd className="text-gray-800 font-bold leading-snug">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                  <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" /> Điểm chính cần nhớ
                  </h3>
                  <ul className="space-y-4">
                    {result.bulletPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-4 block-3d-inset bg-white p-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-green-500 text-white flex items-center justify-center text-sm font-black shadow-lg">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 font-bold leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="grid grid-cols-1 gap-8">
                 <AnalysisCard title="Điểm mới nổi bật" icon={<Lightbulb className="w-5 h-5" />} content={result.deepAnalysis.newPoints} color="yellow" />
                 <AnalysisCard title="Tác động đến Tổ KHXH" icon={<TrendingUp className="w-5 h-5" />} content={result.deepAnalysis.impact} color="indigo" />
                 <AnalysisCard title="Lưu ý/Rủi ro cần tránh" icon={<ShieldAlert className="w-5 h-5" />} content={result.deepAnalysis.risks} color="red" />
                 <AnalysisCard title="Giải thích bổ sung" icon={<Layers className="w-5 h-5" />} content={result.deepAnalysis.legalExplanation} color="blue" />
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
              <TaskColumn 
                title="Tổ trưởng/Tổ phó (Hà - Thảo)" 
                icon={<ClipboardCheck className="w-6 h-6" />} 
                tasks={result.tasks.groupLeaders} 
                color="bg-purple-50 border-purple-200 text-purple-900" 
                highlight 
              />
              <TaskColumn 
                title="Nhóm Tiếng Anh (Thành - Vươn)" 
                icon={<GraduationCap className="w-6 h-6" />} 
                tasks={result.tasks.englishTeachers} 
                color="bg-green-50 border-green-200 text-green-900" 
              />
              <TaskColumn 
                title="Nhóm Văn-Sử-Địa-GDCD & HĐ" 
                icon={<BookOpen className="w-6 h-6" />} 
                tasks={result.tasks.socialScienceTeachers} 
                color="bg-blue-50 border-blue-200 text-blue-800" 
                highlight
              />
              <TaskColumn 
                title="Phong trào-Thể chất-Đội" 
                icon={<Trophy className="w-6 h-6" />} 
                tasks={result.tasks.artsTeachers} 
                color="bg-orange-50 border-orange-200 text-orange-900"
              />
              <div className="md:col-span-2">
                <TaskColumn 
                  title="Ban Giám Hiệu / Nhà trường" 
                  icon={<School className="w-6 h-6" />} 
                  tasks={result.tasks.schoolBoard} 
                  color="bg-gray-100 border-gray-200 text-gray-700" 
                />
              </div>
            </div>
          )}

          {activeTab === 'checklist' && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-2xl font-black text-gray-800 mb-8 flex items-center gap-3">
                <UserCheck className="w-7 h-7 text-green-600" /> Phân công & Deadline
              </h3>
              <div className="overflow-x-auto block-3d-inset p-2 bg-white">
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                  <thead className="uppercase tracking-widest text-[10px] font-black border-b-2 border-gray-100 bg-gray-50/50">
                    <tr>
                      <th scope="col" className="px-6 py-5 text-gray-500">Nhiệm vụ</th>
                      <th scope="col" className="px-6 py-5 text-gray-500">Người phụ trách</th>
                      <th scope="col" className="px-6 py-5 text-gray-500 text-center">Hạn chót</th>
                      <th scope="col" className="px-6 py-5 text-gray-500 text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {result.checklist.map((item, idx) => (
                      <tr key={idx} className="hover:bg-blue-50/30 transition-all group">
                        <td className="px-6 py-5 text-gray-800 font-bold whitespace-normal max-w-xs">{item.details}</td>
                        <td className="px-6 py-5">
                          <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-xl font-black text-[11px] border border-blue-200">
                            {item.assignee}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center">
                           <span className="inline-block px-4 py-1.5 bg-red-500 text-white rounded-full font-black text-[11px] shadow-sm">
                             {item.timeline}
                           </span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <input type="checkbox" className="w-6 h-6 text-blue-600 rounded-xl border-2 border-gray-200 focus:ring-blue-500 cursor-pointer shadow-sm active:scale-90 transition-transform" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AnalysisCard = ({ title, icon, content, color }: { title: string, icon: React.ReactNode, content: string, color: 'blue'|'yellow'|'red'|'green'|'indigo' }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200 shadow-blue-100/50',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200 shadow-yellow-100/50',
    red: 'bg-red-50 text-red-700 border-red-200 shadow-red-100/50',
    green: 'bg-green-50 text-green-700 border-green-200 shadow-green-100/50',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-indigo-100/50',
  };
  return (
    <div className={`p-6 rounded-[2rem] border shadow-xl ${colors[color]} transform transition-all hover:-translate-y-1`}>
      <h4 className="font-black flex items-center gap-3 mb-4 text-lg">
        <div className="bg-white p-2 rounded-xl shadow-sm">{icon}</div>
        {title}
      </h4>
      <p className="text-gray-800 font-bold leading-relaxed whitespace-pre-line text-base">{content}</p>
    </div>
  );
};

const TaskColumn = ({ title, icon, tasks, color, highlight = false }: { title: string, icon: React.ReactNode, tasks: string[], color: string, highlight?: boolean }) => (
  <div className={`p-6 rounded-[2.5rem] border ${color} ${highlight ? 'shadow-2xl ring-2 ring-current ring-opacity-10' : 'shadow-lg'} transition-all hover:shadow-2xl`}>
    <h4 className="font-black text-lg mb-6 flex items-center gap-4 border-b border-black/5 pb-4">
      <div className="p-3 bg-white/80 rounded-2xl shadow-sm backdrop-blur-md">{icon}</div>
      {title}
    </h4>
    {tasks.length > 0 ? (
      <ul className="space-y-4">
        {tasks.map((task, i) => (
          <li key={i} className="flex items-start gap-3 bg-white/40 p-3 rounded-2xl border border-white/50">
            <div className="mt-1.5 w-2 h-2 rounded-full bg-current flex-shrink-0 animate-pulse" />
            <span className="font-bold text-sm md:text-base leading-tight">{task}</span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-sm opacity-50 italic font-medium">Đang chờ cập nhật nhiệm vụ cụ thể...</p>
    )}
  </div>
);

export default ResultDisplay;
