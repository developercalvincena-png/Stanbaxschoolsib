import React, { useState, useRef, useEffect } from 'react';
import { 
  Database, 
  Cloud, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  ExternalLink, 
  X, 
  Download, 
  Upload, 
  FileCode, 
  Server, 
  RefreshCw,
  Sparkles,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  Laptop,
  Smartphone
} from '../../RealIcons';
import { useSchool } from '../../../context/SchoolContext';
import { 
  isRemoteEnabled, 
  getSupabaseConfig, 
  configureSupabase, 
  testSupabaseConnection 
} from '../../../lib/supabase';
import schemaSql from '../../../../supabase/schema.sql?raw';

interface NetlifyCloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NetlifyCloudSyncModal: React.FC<NetlifyCloudSyncModalProps> = ({
  isOpen,
  onClose
}) => {
  const { 
    exportDatabaseSnapshot, 
    importDatabaseSnapshot, 
    syncEntireDatabaseToSupabase,
    students, 
    tutors, 
    classes 
  } = useSchool();
  
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live in-app Supabase Configurator
  const [inputUrl, setInputUrl] = useState('');
  const [inputKey, setInputKey] = useState('');
  const [configStatus, setConfigStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });
  const [pushStatus, setPushStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string; tablesMissing?: boolean } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const cfg = getSupabaseConfig();
      setInputUrl(cfg.url || '');
      setInputKey(cfg.key || '');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isConnected = isRemoteEnabled();
  const currentConfig = getSupabaseConfig();

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(schemaSql);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 3000);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testSupabaseConnection();
      setTestResult(res);
    } catch (err: any) {
      setTestResult({ ok: false, message: err?.message || 'Connection test failed.' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveAndConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfigStatus({ type: 'loading', message: 'Connecting to Supabase...' });
    try {
      const res = await configureSupabase(inputUrl, inputKey);
      if (res.ok) {
        setConfigStatus({ type: 'success', message: res.message });
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setConfigStatus({ type: 'error', message: res.message });
      }
    } catch (err: any) {
      setConfigStatus({ type: 'error', message: err?.message || 'Failed to save configuration.' });
    }
  };

  const handlePushAllData = async () => {
    setPushStatus({ type: 'loading', message: 'Synchronizing all records to Supabase...' });
    try {
      const res = await syncEntireDatabaseToSupabase();
      if (res.ok) {
        setPushStatus({ type: 'success', message: res.message });
      } else {
        setPushStatus({ type: 'error', message: res.message });
      }
    } catch (err: any) {
      setPushStatus({ type: 'error', message: err?.message || 'Data push failed.' });
    }
  };

  const handleDownloadBackup = () => {
    setIsExporting(true);
    try {
      const snapshot = exportDatabaseSnapshot();
      const blob = new Blob([snapshot], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      link.href = url;
      link.download = `stanbax_schools_data_backup_${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Failed to export backup', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const result = importDatabaseSnapshot(text);
        setImportStatus(result);
        if (result.success) {
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      } catch (err: any) {
        setImportStatus({
          success: false,
          message: 'Could not read backup file: ' + (err?.message || 'Invalid format')
        });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/80 backdrop-blur-sm animate-fade-in font-['Nunito',sans-serif]">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        
        {/* Header */}
        <div className={`p-5 sm:p-6 text-white flex items-start justify-between gap-4 ${
          isConnected ? 'bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950' : 'bg-gradient-to-r from-stone-900 via-neutral-900 to-amber-950'
        }`}>
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-md shrink-0 ${
              isConnected ? 'bg-emerald-600/60 border border-emerald-400' : 'bg-amber-500/20 border border-amber-400/40 text-amber-300'
            }`}>
              {isConnected ? <Cloud className="w-6 h-6 text-emerald-200" /> : <Database className="w-6 h-6 text-amber-300" />}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                  isConnected 
                    ? 'bg-emerald-400/20 text-emerald-200 border border-emerald-400/30' 
                    : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                }`}>
                  {isConnected ? '🟢 Supabase PostgreSQL Live' : 'Single-Browser LocalStorage Mode'}
                </span>
                <span className="text-[11px] text-emerald-300 font-bold bg-white/10 px-2 py-0.5 rounded-full">
                  100% Free Forever (Up to 150 Users)
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black mt-1">
                Central Database & Free Forever Hosting Hub
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-stone-800 text-xs sm:text-sm">

          {/* 150 USERS FREE FOREVER ARCHITECTURE BANNER */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-950 space-y-2.5">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-black text-sm text-emerald-900">
                  How This Website Runs 100% Free Forever for 150 Users:
                </strong>
                <p className="mt-1 leading-relaxed text-xs text-emerald-800">
                  You do not need to pay a single dollar or enter credit card information. The school architecture is specifically optimized for zero ongoing hosting costs:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
              <div className="p-2.5 bg-white/80 rounded-xl border border-emerald-200/80">
                <span className="font-black text-emerald-900 block text-[11px] uppercase tracking-wide">1. Central Database</span>
                <p className="text-stone-700 mt-1 text-[11px]">
                  <strong>Supabase Free Tier:</strong> Gives you 50,000 monthly active users and 500 MB storage. Your 150 users require &lt; 10 MB, fitting permanently within the free quota.
                </p>
              </div>

              <div className="p-2.5 bg-white/80 rounded-xl border border-emerald-200/80">
                <span className="font-black text-emerald-900 block text-[11px] uppercase tracking-wide">2. Web Hosting</span>
                <p className="text-stone-700 mt-1 text-[11px]">
                  <strong>Netlify / Vercel / GitHub:</strong> Static single-page application hosting includes 100 GB free monthly bandwidth and automatic SSL security.
                </p>
              </div>

              <div className="p-2.5 bg-white/80 rounded-xl border border-emerald-200/80">
                <span className="font-black text-emerald-900 block text-[11px] uppercase tracking-wide">3. Passwords & Data</span>
                <p className="text-stone-700 mt-1 text-[11px]">
                  <strong>Bcrypt Encrypted in Cloud:</strong> Passwords, password resets, grades, and registrations are stored in Supabase PostgreSQL, not in isolated browser storage.
                </p>
              </div>
            </div>
          </div>

          {/* LIVE IN-APP SUPABASE CONFIGURATOR */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-2.5 border-stone-200">
              <h3 className="font-black text-sm uppercase tracking-wider text-stone-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" />
                Live Supabase Connection Manager
              </h3>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                isConnected 
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                  : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}>
                {isConnected ? `Connected (${currentConfig.source})` : 'Not Connected'}
              </span>
            </div>

            <form onSubmit={handleSaveAndConnect} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="url"
                    required
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://xyzabcdef.supabase.co"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 outline-none"
                  />
                  <span className="text-[10px] text-stone-500 mt-0.5 block">
                    Found in Supabase: Project Settings → API → Project URL
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Supabase Anon / Public Key
                  </label>
                  <input
                    type="text"
                    required
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 outline-none"
                  />
                  <span className="text-[10px] text-stone-500 mt-0.5 block">
                    Found in Supabase: Project Settings → API → Project API Keys (anon)
                  </span>
                </div>
              </div>

              {configStatus.message && (
                <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  configStatus.type === 'success' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                  configStatus.type === 'error' ? 'bg-rose-100 text-rose-900 border border-rose-300' :
                  'bg-blue-100 text-blue-900 border border-blue-300'
                }`}>
                  {configStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
                  <span>{configStatus.message}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  type="submit"
                  disabled={configStatus.type === 'loading'}
                  className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Cloud className="w-4 h-4 text-emerald-200" />
                  <span>{configStatus.type === 'loading' ? 'Connecting...' : 'Save & Connect Database'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting || !inputUrl || !inputKey}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 font-bold text-xs flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
                </button>

                {isConnected && (
                  <button
                    type="button"
                    onClick={handlePushAllData}
                    disabled={pushStatus.type === 'loading'}
                    className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-amber-300 font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>{pushStatus.type === 'loading' ? 'Syncing...' : 'Push All Current Records to Supabase'}</span>
                  </button>
                )}
              </div>

              {testResult && (
                <div className={`p-3.5 rounded-xl text-xs font-semibold flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  testResult.ok ? 'bg-emerald-50 text-emerald-900 border border-emerald-300' : 'bg-amber-50 text-amber-950 border border-amber-300'
                }`}>
                  <div className="flex items-center gap-2">
                    {testResult.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
                    <span>{testResult.message}</span>
                  </div>
                  {testResult.tablesMissing && (
                    <button
                      type="button"
                      onClick={handleCopySchema}
                      className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-black text-amber-300 text-[11px] font-bold flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                    >
                      {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSchema ? 'SQL Copied!' : 'Copy SQL Schema Now'}</span>
                    </button>
                  )}
                </div>
              )}

              {pushStatus.message && (
                <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  pushStatus.type === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-300' : 'bg-rose-50 text-rose-900 border border-rose-300'
                }`}>
                  {pushStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
                  <span>{pushStatus.message}</span>
                </div>
              )}
            </form>
          </div>

          {/* 3-MINUTE SETUP WORKFLOW */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2 border-stone-200">
              <h3 className="font-black text-sm uppercase tracking-wider text-stone-900 flex items-center gap-2">
                <Server className="w-4 h-4 text-red-600" />
                Permanent 3-Minute Cloud Database Setup
              </h3>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                100% Free
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between space-y-3">
                <div>
                  <div className="w-6 h-6 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center mb-2">
                    1
                  </div>
                  <strong className="block text-stone-900 font-bold mb-1">Create Free Project</strong>
                  <p className="text-stone-600 text-xs leading-relaxed">
                    Sign up at Supabase (free forever, no credit card). Create a project named <strong>stanbax-schools</strong>.
                  </p>
                </div>
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Open Supabase.com</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between space-y-3">
                <div>
                  <div className="w-6 h-6 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center mb-2">
                    2
                  </div>
                  <strong className="block text-stone-900 font-bold mb-1">Paste & Run SQL Schema</strong>
                  <p className="text-stone-600 text-xs leading-relaxed">
                    In Supabase Dashboard → <strong>SQL Editor</strong> → click <strong>New Query</strong>, paste the schema below, and click <strong>Run</strong>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopySchema}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    copiedSchema 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-red-700 hover:bg-red-800 text-white'
                  }`}
                >
                  {copiedSchema ? <Check className="w-3.5 h-3.5" /> : <FileCode className="w-3.5 h-3.5" />}
                  <span>{copiedSchema ? 'SQL Master Schema Copied!' : 'Copy SQL Schema (schema.sql)'}</span>
                </button>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between space-y-3">
                <div>
                  <div className="w-6 h-6 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center mb-2">
                    3
                  </div>
                  <strong className="block text-stone-900 font-bold mb-1">Save Credentials in App</strong>
                  <p className="text-stone-600 text-xs leading-relaxed">
                    Paste the Project URL and Anon Key into the Connection Manager above, or into your Netlify / Vercel Environment Variables.
                  </p>
                </div>
                <a
                  href="https://app.netlify.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Open Netlify App</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Environment Variables Copy Panel */}
            <div className="p-4 rounded-2xl bg-stone-900 text-stone-100 space-y-3 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-amber-400 font-bold uppercase tracking-wider">
                  Netlify / Vercel Environment Variables (Optional for CI/CD):
                </span>
                <span className="text-[10px] text-stone-400">
                  (Site configuration → Environment variables)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                {/* Variable 1 */}
                <div className="p-3 rounded-xl bg-stone-800/90 border border-stone-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-stone-400 font-sans font-bold">Variable 1 Name</span>
                    <button
                      type="button"
                      onClick={() => handleCopy('VITE_SUPABASE_URL', 'v1')}
                      className="px-2 py-1 rounded bg-stone-700 hover:bg-stone-600 text-white text-[10px] font-sans font-bold cursor-pointer flex items-center gap-1"
                    >
                      {copiedKey === 'v1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'v1' ? 'Copied' : 'Copy Name'}</span>
                    </button>
                  </div>
                  <div className="text-emerald-400 font-bold text-xs">VITE_SUPABASE_URL</div>
                  <div className="text-[11px] text-stone-400 font-sans">
                    Value from Supabase: <strong>Project Settings → API → Project URL</strong>
                  </div>
                </div>

                {/* Variable 2 */}
                <div className="p-3 rounded-xl bg-stone-800/90 border border-stone-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-stone-400 font-sans font-bold">Variable 2 Name</span>
                    <button
                      type="button"
                      onClick={() => handleCopy('VITE_SUPABASE_ANON_KEY', 'v2')}
                      className="px-2 py-1 rounded bg-stone-700 hover:bg-stone-600 text-white text-[10px] font-sans font-bold cursor-pointer flex items-center gap-1"
                    >
                      {copiedKey === 'v2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'v2' ? 'Copied' : 'Copy Name'}</span>
                    </button>
                  </div>
                  <div className="text-emerald-400 font-bold text-xs">VITE_SUPABASE_ANON_KEY</div>
                  <div className="text-[11px] text-stone-400 font-sans">
                    Value from Supabase: <strong>Project Settings → API → Project API Keys → anon</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* INSTANT DATA BACKUP & TRANSFER (MIGRATION TOOLS) */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-black text-xs uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-amber-700" />
                  Instant Backup & Local File Export
                </h4>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  You can also download a complete JSON archive of all {students.length} students, {tutors.length} tutors, classes, and exam records anytime.
                </p>
              </div>
            </div>

            {importStatus && (
              <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                importStatus.success ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300'
              }`}>
                {importStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
                <span>{importStatus.message}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleDownloadBackup}
                disabled={isExporting}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4 text-amber-300" />
                <span>Download School Data Backup (.json)</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
                id="school-backup-input"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white hover:bg-amber-100/60 text-stone-900 border border-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Upload className="w-4 h-4 text-stone-600" />
                <span>Import Backup File to Browser</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between">
          <span className="text-xs text-stone-500 font-medium">
            Stanbax Schools Ibadan • Supabase PostgreSQL Multi-Device Architecture
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition cursor-pointer"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
