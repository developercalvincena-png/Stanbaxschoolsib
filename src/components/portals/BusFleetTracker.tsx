import React, { useState, useEffect } from 'react';
import { 
  Bus, 
  MapPin, 
  Navigation, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Bell, 
  CheckCircle2, 
  AlertCircle,
  Radio,
  User,
  Compass,
  ArrowRight
} from '../RealIcons';

interface BusStop {
  id: string;
  name: string;
  time: string;
  passed: boolean;
  isNext: boolean;
}

interface BusRouteSimulation {
  id: string;
  routeName: string;
  busNumber: string;
  driverName: string;
  driverPhone: string;
  chaperoneName: string;
  currentLocation: string;
  speedKmH: number;
  status: 'In Transit' | 'At School Terminal' | 'Approaching Bodija' | 'Boarding';
  etaMinutes: number;
  stops: BusStop[];
}

const BUS_ROUTES: BusRouteSimulation[] = [
  {
    id: 'route-bodija',
    routeName: 'Route 1: Bodija and U.I. Corridor',
    busNumber: 'STAN-BUS-01 (Toyota Coaster • 32 Seats)',
    driverName: 'Mr. Babatunde Alabi',
    driverPhone: '+234 803 778 1122',
    chaperoneName: 'Mrs. R. Adeleke (Faculty Chaperone)',
    currentLocation: 'Passing Bodija Market Roundabout toward Excellence Ave',
    speedKmH: 36,
    status: 'In Transit',
    etaMinutes: 8,
    stops: [
      { id: 's-1', name: 'University of Ibadan Main Gate', time: '7:10 AM', passed: true, isNext: false },
      { id: 's-2', name: 'Agbowo Junction Pick-up Point', time: '7:22 AM', passed: true, isNext: false },
      { id: 's-3', name: 'Bodija Market Roundabout', time: '7:35 AM', passed: true, isNext: false },
      { id: 's-4', name: 'Awolowo Avenue Junction', time: '7:44 AM', passed: false, isNext: true },
      { id: 's-5', name: 'Stanbax Campus Main Gate', time: '7:55 AM', passed: false, isNext: false }
    ]
  },
  {
    id: 'route-oluyole',
    routeName: 'Route 2: Oluyole Estate and Ring Road Express',
    busNumber: 'STAN-BUS-02 (Toyota Coaster • 32 Seats)',
    driverName: 'Mr. Kehinde Adeyemi',
    driverPhone: '+234 802 334 5566',
    chaperoneName: 'Mr. D. Oladipo (Faculty Chaperone)',
    currentLocation: 'Approaching Mobil Junction / Ring Road',
    speedKmH: 42,
    status: 'In Transit',
    etaMinutes: 14,
    stops: [
      { id: 'o-1', name: 'Oluyole Industrial Estate Gate', time: '7:05 AM', passed: true, isNext: false },
      { id: 'o-2', name: 'Mobil Ring Road Junction', time: '7:20 AM', passed: false, isNext: true },
      { id: 'o-3', name: 'Challenge Flyover Interchange', time: '7:33 AM', passed: false, isNext: false },
      { id: 'o-4', name: 'Secretariat Road Junction', time: '7:46 AM', passed: false, isNext: false },
      { id: 'o-5', name: 'Stanbax Campus Main Gate', time: '7:58 AM', passed: false, isNext: false }
    ]
  },
  {
    id: 'route-akobo',
    routeName: 'Route 3: Akobo and General Gas Axis',
    busNumber: 'STAN-BUS-03 (Toyota HiAce • 18 Seats)',
    driverName: 'Mr. Sunday Ojo',
    driverPhone: '+234 814 990 2233',
    chaperoneName: 'Mrs. T. Balogun (Nurse Chaperone)',
    currentLocation: 'General Gas Flyover heading south',
    speedKmH: 30,
    status: 'In Transit',
    etaMinutes: 19,
    stops: [
      { id: 'a-1', name: 'Akobo Housing Estate Entrance', time: '7:00 AM', passed: true, isNext: false },
      { id: 'a-2', name: 'General Gas Flyover', time: '7:18 AM', passed: false, isNext: true },
      { id: 'a-3', name: 'Iwo Road Interchange', time: '7:32 AM', passed: false, isNext: false },
      { id: 'a-4', name: 'Agodi Gardens Junction', time: '7:45 AM', passed: false, isNext: false },
      { id: 'a-5', name: 'Stanbax Campus Main Gate', time: '7:55 AM', passed: false, isNext: false }
    ]
  }
];

export const BusFleetTracker: React.FC = () => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-bodija');
  const [alertActive, setAlertActive] = useState<boolean>(true);
  const [alertNotificationSent, setAlertNotificationSent] = useState<boolean>(false);

  const activeRoute = BUS_ROUTES.find(r => r.id === selectedRouteId) || BUS_ROUTES[0];

  const handleTestAlert = () => {
    setAlertNotificationSent(true);
    setTimeout(() => setAlertNotificationSent(false), 5000);
  };

  return (
    <div className="space-y-6 font-['Nunito',sans-serif]">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-neutral-900 text-white p-6 rounded-3xl shadow-sm border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[11px] font-black uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>Real-Time Fleet Telematics Active</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            School Bus Live GPS Fleet Tracker
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
            Monitor air-conditioned school buses in transit across Ibadan. Receive instant WhatsApp and SMS notification when your child's bus is within 10 minutes of their stop.
          </p>
        </div>

        {/* Live Notification Toggle */}
        <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <div className="text-left sm:text-right">
            <span className="text-[10px] font-bold uppercase text-neutral-300 block">Proximity Alerts</span>
            <span className="text-xs font-black text-white">{alertActive ? 'SMS & WhatsApp Enabled' : 'Alerts Paused'}</span>
          </div>
          <button
            type="button"
            onClick={() => setAlertActive(!alertActive)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              alertActive ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-neutral-700 text-neutral-300'
            }`}
          >
            {alertActive ? 'Active' : 'Enable'}
          </button>
        </div>
      </div>

      {alertNotificationSent && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Simulated Proximity Alert dispatched to parent mobile: <strong>"Stanbax Bus 01 is 8 minutes away from Awolowo Ave Stop."</strong></span>
          </div>
          <span className="text-[10px] font-bold text-emerald-800">Delivered</span>
        </div>
      )}

      {/* Route Switcher Tabs */}
      <div className="flex flex-wrap gap-2">
        {BUS_ROUTES.map(route => (
          <button
            key={route.id}
            type="button"
            onClick={() => setSelectedRouteId(route.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
              selectedRouteId === route.id
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            <Bus className="w-4 h-4 text-amber-500" />
            <span>{route.routeName}</span>
          </button>
        ))}
      </div>

      {/* Main Bus Status Card */}
      <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-xs space-y-6">
        {/* Vehicle & Telematics Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
            <span className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Vehicle Details</span>
            <span className="text-xs font-black text-neutral-900 block truncate">{activeRoute.busNumber}</span>
            <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Speed Governor Installed</span>
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
            <span className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Current GPS Speed</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-neutral-900">{activeRoute.speedKmH}</span>
              <span className="text-xs font-bold text-neutral-500">km/h</span>
            </div>
            <span className="text-[11px] text-neutral-600 block mt-1">Regulated max: 50 km/h</span>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
            <span className="text-[10px] font-bold text-blue-900 uppercase block mb-1">Next Stop ETA</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-blue-950">{activeRoute.etaMinutes}</span>
              <span className="text-xs font-bold text-blue-800">minutes</span>
            </div>
            <span className="text-[11px] text-blue-700 font-semibold block mt-1">Traffic: Moderate Flow</span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
            <span className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Bus Chaperone</span>
            <span className="text-xs font-black text-neutral-900 block">{activeRoute.chaperoneName}</span>
            <span className="text-[11px] text-neutral-600 block mt-1">First-Aid Certified</span>
          </div>
        </div>

        {/* Driver Contact & Live Location Strip */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-neutral-900 to-neutral-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center font-black">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black">{activeRoute.driverName} (Licensed Driver)</div>
              <div className="text-[11px] text-neutral-300 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{activeRoute.currentLocation}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${activeRoute.driverPhone}`}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Driver</span>
            </a>
            <button
              type="button"
              onClick={handleTestAlert}
              className="px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-black transition flex items-center gap-1.5 cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Trigger Test Alert</span>
            </button>
          </div>
        </div>

        {/* Route Progression Timeline */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-neutral-700 mb-4">
            Route Stops and Schedule Timeline
          </h4>
          <div className="space-y-3">
            {activeRoute.stops.map((stop, idx) => (
              <div 
                key={stop.id}
                className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                  stop.isNext 
                    ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20' 
                    : stop.passed 
                      ? 'bg-neutral-50 border-neutral-200 opacity-80' 
                      : 'bg-white border-neutral-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                    stop.passed 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : stop.isNext 
                        ? 'bg-blue-600 text-white animate-pulse' 
                        : 'bg-neutral-200 text-neutral-600'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <span className="text-xs font-black text-neutral-900 block">{stop.name}</span>
                    <span className="text-[10px] text-neutral-500">Scheduled: {stop.time}</span>
                  </div>
                </div>

                <div className="text-right">
                  {stop.passed ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Departed
                    </span>
                  ) : stop.isNext ? (
                    <span className="px-2.5 py-1 rounded-full bg-blue-600 text-white text-[10px] font-black animate-pulse flex items-center gap-1">
                      <Navigation className="w-3 h-3" />
                      <span>Arriving in {activeRoute.etaMinutes} mins</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-bold">
                      Upcoming
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
