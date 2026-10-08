import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  Flame, 
  ShieldCheck, 
  Sparkles, 
  Flag, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  ChevronRight
} from './RealIcons';

interface HouseData {
  id: string;
  name: string;
  colorName: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  accentBg: string;
  motto: string;
  points: number;
  rank: number;
  sportsPoints: number;
  academicPoints: number;
  culturalPoints: number;
  disciplinePoints: number;
  houseMaster: string;
  houseCaptain: string;
  recentAchievements: string[];
}

const HOUSES: HouseData[] = [
  {
    id: 'emerald',
    name: 'Emerald Dragons',
    colorName: 'Green House',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-950',
    borderColor: 'border-emerald-300',
    accentBg: 'bg-emerald-600',
    motto: 'Fortitude and Honor',
    points: 1480,
    rank: 1,
    sportsPoints: 480,
    academicPoints: 420,
    culturalPoints: 310,
    disciplinePoints: 270,
    houseMaster: 'Mr. P. Alabi (Senior Mathematics Fellow)',
    houseCaptain: 'Femi Adebayo (SSS 2)',
    recentAchievements: [
      '1st Place in Senior 4x100m Relay (+50 pts)',
      'Winner of Inter-House Mathematics Speed Challenge (+45 pts)',
      'Best March Past Uniform Presentation (+30 pts)'
    ]
  },
  {
    id: 'ruby',
    name: 'Ruby Phoenix',
    colorName: 'Red House',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-950',
    borderColor: 'border-rose-300',
    accentBg: 'bg-rose-600',
    motto: 'Rising Through Wisdom',
    points: 1425,
    rank: 2,
    sportsPoints: 410,
    academicPoints: 460,
    culturalPoints: 295,
    disciplinePoints: 260,
    houseMaster: 'Mrs. Folashade Okon (Senior Cambridge Lead)',
    houseCaptain: 'Zainab Adeleke (SSS 3)',
    recentAchievements: [
      'Top Honors in Inter-House Science & Robotics Fair (+60 pts)',
      '1st Place in Senior Girls 200m Sprint (+40 pts)',
      'Cleanest Quadrangle Dormitory Inspection (+25 pts)'
    ]
  },
  {
    id: 'sapphire',
    name: 'Sapphire Knights',
    colorName: 'Blue House',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-950',
    borderColor: 'border-blue-300',
    accentBg: 'bg-blue-600',
    motto: 'Truth and Valor',
    points: 1390,
    rank: 3,
    sportsPoints: 390,
    academicPoints: 390,
    culturalPoints: 340,
    disciplinePoints: 270,
    houseMaster: 'Mr. O. Daramola (Civics & International Relations)',
    houseCaptain: 'Chidera Okonkwo (SSS 3)',
    recentAchievements: [
      'Overall Champions in Inter-House Parliamentary Debate (+55 pts)',
      '1st Place in Junior Chess & Scrabble Tournament (+35 pts)',
      'Merit Citation for Zero Uniform Infractions (+20 pts)'
    ]
  },
  {
    id: 'topaz',
    name: 'Topaz Eagles',
    colorName: 'Yellow House',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-950',
    borderColor: 'border-amber-300',
    accentBg: 'bg-amber-500',
    motto: 'Soaring to Excellence',
    points: 1345,
    rank: 4,
    sportsPoints: 370,
    academicPoints: 380,
    culturalPoints: 325,
    disciplinePoints: 270,
    houseMaster: 'Engr. K. Balogun (STEM Coordinator)',
    houseCaptain: 'Tobi Ogundipe (JSS 3)',
    recentAchievements: [
      '1st Place in Inter-House Choral & Brass Ensemble (+50 pts)',
      'Winner of Junior Spelling Bee Zonal Qualifier (+40 pts)',
      'Sportsmanship Trophy in High Jump Finals (+25 pts)'
    ]
  }
];

export const HouseChampionshipLeaderboard: React.FC = () => {
  const [selectedHouse, setSelectedHouse] = useState<HouseData>(HOUSES[0]);

  return (
    <section id="house-system" className="py-20 bg-[#FDFBF7] border-b border-[#EAE2CE] font-['Nunito',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-950 border border-amber-300 text-xs font-black uppercase tracking-wider mb-3 shadow-2xs">
            <Trophy className="w-3.5 h-3.5 text-amber-700" />
            <span>Stanbax Traditional House System</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            Inter-House Championship Leaderboard
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base mt-3 leading-relaxed">
            Every Stanbax scholar belongs to one of four proud houses. House points are earned termly through academic decathlons, inter-house track and field sports, debate tourneys, and peer leadership.
          </p>
        </div>

        {/* 4 Houses Podium Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {HOUSES.map((house) => {
            const isSelected = selectedHouse.id === house.id;
            return (
              <div
                key={house.id}
                onClick={() => setSelectedHouse(house)}
                className={`bg-white rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1 ${
                  isSelected 
                    ? `shadow-xl ring-2 ring-neutral-900 ${house.borderColor}` 
                    : 'shadow-xs border-neutral-200 hover:border-neutral-400'
                }`}
              >
                <div>
                  {/* Rank Badge & Color Pill */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-white ${house.accentBg}`}>
                      {house.rank === 1 ? '1st' : house.rank === 2 ? '2nd' : house.rank === 3 ? '3rd' : '4th'}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${house.badgeBg} ${house.badgeText} ${house.borderColor}`}>
                      {house.colorName}
                    </span>
                  </div>

                  <h3 className="font-black text-lg text-neutral-950 leading-tight">
                    {house.name}
                  </h3>
                  <p className="text-xs text-neutral-500 italic mt-0.5">
                    "{house.motto}"
                  </p>

                  {/* Total Points */}
                  <div className="my-5 p-4 rounded-2xl bg-neutral-50 border border-neutral-100 text-center">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase block mb-0.5">Total Points</span>
                    <div className="text-3xl font-black text-neutral-950">{house.points.toLocaleString()}</div>
                    <span className="text-[10px] text-emerald-700 font-bold block mt-1">Active Term Tally</span>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-neutral-100 text-xs">
                  <div className="flex items-center justify-between text-neutral-600">
                    <span className="text-[11px]">House Master:</span>
                    <span className="font-bold text-neutral-900 truncate max-w-[130px]">{house.houseMaster.split(' ')[0]} {house.houseMaster.split(' ')[1]}</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-600">
                    <span className="text-[11px]">Student Captain:</span>
                    <span className="font-bold text-neutral-900">{house.houseCaptain.split(' ')[0]}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Breakdown Card of Selected House */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${selectedHouse.accentBg}`} />
                <h3 className="text-xl font-black text-neutral-950">
                  {selectedHouse.name} Detailed Scorecard
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${selectedHouse.badgeBg} ${selectedHouse.badgeText}`}>
                  Current Rank: {selectedHouse.rank === 1 ? '1st Place Leader' : `${selectedHouse.rank}th Position`}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                House Master: {selectedHouse.houseMaster} • Senior Captain: {selectedHouse.houseCaptain}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-neutral-500 font-bold uppercase block">Composite Aggregate</span>
              <span className="text-2xl font-black text-neutral-900">{selectedHouse.points} Total Points</span>
            </div>
          </div>

          {/* 4 Category Breakdown Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#FAF7EE] border border-[#EAE2CE]">
              <span className="text-[10px] uppercase font-bold text-neutral-500 block">Athletics & Sports</span>
              <span className="text-xl font-black text-neutral-950 mt-1 block">{selectedHouse.sportsPoints} pts</span>
              <span className="text-[10px] text-neutral-500">Track, Field, Swimming</span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
              <span className="text-[10px] uppercase font-bold text-blue-900 block">Academic Decathlons</span>
              <span className="text-xl font-black text-blue-950 mt-1 block">{selectedHouse.academicPoints} pts</span>
              <span className="text-[10px] text-blue-700">Math Olympiad, STEM Fair</span>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
              <span className="text-[10px] uppercase font-bold text-purple-900 block">Debate & Arts</span>
              <span className="text-xl font-black text-purple-950 mt-1 block">{selectedHouse.culturalPoints} pts</span>
              <span className="text-[10px] text-purple-700">Drama, Music, Model UN</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <span className="text-[10px] uppercase font-bold text-emerald-900 block">Campus Discipline</span>
              <span className="text-xl font-black text-emerald-950 mt-1 block">{selectedHouse.disciplinePoints} pts</span>
              <span className="text-[10px] text-emerald-700">Attendance, Cleanliness</span>
            </div>
          </div>

          {/* Recent Point Allocations */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-700 mb-3">
              Recent Points Awarded This Term
            </h4>
            <div className="space-y-2">
              {selectedHouse.recentAchievements.map((ach, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-bold text-neutral-800">{ach}</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">Logged</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
