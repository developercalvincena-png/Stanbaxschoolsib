import React from 'react';
import { CampusGallery } from '../../CampusGallery';
import { Camera, ShieldCheck, Info } from 'lucide-react';

export const AdminCampusGalleryTab: React.FC = () => {
  return (
    <div className="space-y-6 font-['Nunito',sans-serif]">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200 mb-2">
            <Camera className="w-3.5 h-3.5" />
            <span>Campus Visual Assets Studio</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            Campus Facilities & Events Photo Manager
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 font-medium">
            Upload new high-resolution photography, manage facility categories, update captions, and control featured landmark highlights across all student, parent, and visitor touchpoints.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-xs text-amber-900 font-medium">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Photos published here are instantly visible to visitors, students, and parents in real time.</span>
        </div>
      </div>

      {/* Embedded Campus Gallery in Full Admin Mode */}
      <div className="rounded-3xl overflow-hidden border border-stone-200 shadow-sm bg-white">
        <CampusGallery showAdminControls={true} />
      </div>
    </div>
  );
};
