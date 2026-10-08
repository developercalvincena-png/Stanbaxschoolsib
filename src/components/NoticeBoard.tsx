import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext';
import { 
  Bell, 
  Calendar, 
  ChevronRight, 
  AlertCircle, 
  FileText, 
  School as SchoolIcon
} from './RealIcons';

interface NoticeBoardProps {
  onOpenAdmissions?: () => void;
}

export const NoticeBoard: React.FC<NoticeBoardProps> = ({ onOpenAdmissions }) => {
  const { notices } = useSchool();
  const [filterAudience, setFilterAudience] = useState<string>('All');

  const filteredNotices = notices.filter(n => {
    if (filterAudience === 'All') return true;
    return n.audience === filterAudience || n.audience === 'All';
  });

  return (
    <section className="py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Bell className="w-3.5 h-3.5 text-amber-600" />
              <span>Official School Bulletins</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              School Announcements & Notices
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {['All', 'Parents', 'Scholars', 'Faculty'].map(aud => (
              <button
                key={aud}
                type="button"
                onClick={() => setFilterAudience(aud)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  filterAudience === aud
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {aud}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredNotices.slice(0, 6).map(notice => (
            <div
              key={notice.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                notice.isImportant
                  ? 'bg-amber-50/50 border-amber-300 shadow-sm'
                  : 'bg-[#FDFBF7] border-stone-200 hover:border-stone-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-white border border-stone-200 text-stone-700">
                    {notice.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-stone-400 font-semibold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{notice.date}</span>
                  </div>
                </div>

                <h3 className="font-bold text-stone-900 text-base leading-snug mb-2 break-words">
                  {notice.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed break-words">
                  {notice.content}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-200/60 flex items-center justify-between text-[11px] font-bold text-stone-500">
                <span>Audience: {notice.audience || 'All Community'}</span>
                {notice.isImportant && (
                  <span className="text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Priority
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
