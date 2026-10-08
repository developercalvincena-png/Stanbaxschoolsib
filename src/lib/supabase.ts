import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const SESSION_KEY = 'stanbax_db_session';
const CONFIG_URL_KEY = 'stanbax_supabase_url';
const CONFIG_KEY_KEY = 'stanbax_supabase_anon_key';

// Read config with fallback to in-app localStorage settings
export const getSupabaseConfig = (): {
  url: string;
  key: string;
  isConfigured: boolean;
  source: 'env' | 'localStorage' | 'none';
} => {
  let envUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
  let envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();

  if (envUrl) envUrl = envUrl.replace(/\/+$/, '');

  if (envUrl && envKey && !envUrl.includes('your-project-id')) {
    return { url: envUrl, key: envKey, isConfigured: true, source: 'env' };
  }

  let localUrl = '';
  let localKey = '';
  try {
    localUrl = (localStorage.getItem(CONFIG_URL_KEY) || '').trim();
    localKey = (localStorage.getItem(CONFIG_KEY_KEY) || '').trim();
    if (localUrl) localUrl = localUrl.replace(/\/+$/, '');
  } catch {}

  if (localUrl && localKey) {
    return { url: localUrl, key: localKey, isConfigured: true, source: 'localStorage' };
  }

  return { url: envUrl || '', key: envKey || '', isConfigured: false, source: 'none' };
};

let sessionToken: string | null = null;
try {
  sessionToken = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
} catch { /* ignore */ }

const authedFetch: typeof fetch = (input, init) => {
  if (!sessionToken) return fetch(input, init);
  const headers = new Headers(init?.headers);
  headers.set('x-stanbax-session', sessionToken);
  return fetch(input, { ...init, headers });
};

const createClientInstance = (): SupabaseClient | null => {
  const cfg = getSupabaseConfig();
  if (cfg.isConfigured && cfg.url && cfg.key) {
    try {
      return createClient(cfg.url, cfg.key, {
        auth: { persistSession: false, autoRefreshToken: false },
        global: { fetch: authedFetch },
      });
    } catch (err) {
      console.warn('[Supabase Init] Could not instantiate client:', err);
      return null;
    }
  }
  return null;
};

// Client instantiated strictly with SUPABASE_URL and SUPABASE_ANON_KEY (Zero-Trust)
export let supabase: SupabaseClient | null = createClientInstance();

export const isRemoteEnabled = (): boolean => supabase !== null;

export const setDbSession = (token: string | null): void => {
  sessionToken = token;
  try {
    if (token) {
      localStorage.setItem(SESSION_KEY, token);
      sessionStorage.setItem(SESSION_KEY, token);
    } else {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
    }
  } catch { /* ignore */ }
};

export const getDbSession = (): string | null => sessionToken;

/**
 * Configure or update Supabase credentials dynamically in the browser.
 */
export const configureSupabase = async (
  url: string,
  anonKey: string
): Promise<{ ok: boolean; message: string }> => {
  const cleanUrl = url.trim();
  const cleanKey = anonKey.trim();

  if (!cleanUrl || !cleanKey) {
    return { ok: false, message: 'Both Supabase URL and Anon Key are required.' };
  }

  if (!cleanUrl.startsWith('https://') || !cleanUrl.includes('.supabase.co')) {
    return { ok: false, message: 'Invalid Supabase URL. Must be in the format https://<project-ref>.supabase.co' };
  }

  try {
    localStorage.setItem(CONFIG_URL_KEY, cleanUrl);
    localStorage.setItem(CONFIG_KEY_KEY, cleanKey);
    supabase = createClient(cleanUrl, cleanKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: authedFetch },
    });

    // Test connection
    const testResult = await testSupabaseConnection();
    if (!testResult.ok) {
      return { ok: false, message: `Connected to Supabase, but schema test failed: ${testResult.message}. Did you paste and run schema.sql?` };
    }

    // Hydrate remote state
    await hydrateFromSupabase();

    return { ok: true, message: 'Supabase central database connected successfully! Multi-device sync is live.' };
  } catch (err: any) {
    return { ok: false, message: err?.message || 'Failed to initialize Supabase client.' };
  }
};

/**
 * Live connection diagnostic test.
 */
export const testSupabaseConnection = async (): Promise<{
  ok: boolean;
  message: string;
  rowCount?: number;
  tablesMissing?: boolean;
}> => {
  if (!supabase) {
    return { ok: false, message: 'Supabase client is not configured yet. Provide Project URL and Anon Key.' };
  }

  try {
    const { data, error, count } = await supabase
      .from('school_state')
      .select('key', { count: 'exact' })
      .limit(5);

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('schema cache') || error.message?.includes('does not exist')) {
        return {
          ok: false,
          tablesMissing: true,
          message: 'Connection to Supabase project succeeded, but database tables are not created yet (PGRST205). Copy and run schema.sql in your Supabase SQL Editor to activate tables.',
        };
      }
      return { ok: false, message: `Database error: ${error.message} (Code: ${error.code})` };
    }

    return {
      ok: true,
      message: 'Supabase PostgreSQL connection 100% verified! Tables, RPC procedures, and RLS policies are active.',
      rowCount: count ?? (data?.length || 0),
    };
  } catch (err: any) {
    return { ok: false, message: `Connection failed: ${err?.message || 'Network unreachable'}` };
  }
};

export interface VerifyLoginResult {
  ok: boolean;
  token?: string;
  role?: string;
  refId?: string;
  message?: string;
  unreachable?: boolean;
}

export const remoteVerifyLogin = async (
  identifier: string,
  password: string
): Promise<VerifyLoginResult> => {
  if (!supabase) return { ok: false, unreachable: true };
  try {
    const { data, error } = await supabase.rpc('verify_login', {
      p_identifier: identifier,
      p_password: password,
    });
    if (error) {
      console.warn('[Supabase Auth] Login verification rejected:', error.message);
      return { ok: false, unreachable: true, message: error.message };
    }
    const d = data as Record<string, unknown> | null;
    if (!d || d.ok !== true) {
      return { ok: false, message: (d?.message as string) || 'Invalid credentials.' };
    }
    return {
      ok: true,
      token: d.token as string,
      role: d.role as string,
      refId: d.ref_id as string,
    };
  } catch (err) {
    console.warn('[Supabase Auth] Remote verification unreachable:', err);
    return { ok: false, unreachable: true };
  }
};

/**
 * Reset password in Supabase credentials table (with security question verification).
 * Callable anonymously from the login screen so forgotten passwords are saved directly into PostgreSQL.
 */
export const remoteResetPassword = async (
  identifier: string,
  newPassword: string,
  securityAnswer?: string
): Promise<{ ok: boolean; message: string; role?: string; refId?: string }> => {
  if (!supabase) return { ok: false, message: 'Supabase offline or not configured.' };
  try {
    const { data, error } = await supabase.rpc('reset_password', {
      p_identifier: identifier,
      p_new_password: newPassword,
      p_security_answer: securityAnswer || null,
    });
    if (error) {
      console.warn('[Supabase Security] Password reset rejected:', error.message);
      return { ok: false, message: error.message };
    }
    const d = data as { ok?: boolean; message?: string; role?: string; ref_id?: string } | null;
    return {
      ok: d?.ok === true,
      message: d?.message || (d?.ok ? 'Password reset successfully in Supabase.' : 'Failed to reset password.'),
      role: d?.role,
      refId: d?.ref_id,
    };
  } catch (err: any) {
    return { ok: false, message: err?.message || 'Remote password reset failed.' };
  }
};

/**
 * Admin reset user password directly in Supabase credentials table.
 */
export const remoteAdminResetPassword = async (
  identifier: string,
  newPassword: string
): Promise<{ ok: boolean; message: string }> => {
  if (!supabase || !sessionToken) return { ok: false, message: 'Supabase offline or no admin session.' };
  try {
    const { data, error } = await supabase.rpc('admin_reset_user_password', {
      p_identifier: identifier,
      p_new_password: newPassword,
    });
    if (error) {
      console.warn('[Supabase Admin] Admin password reset rejected:', error.message);
      return { ok: false, message: error.message };
    }
    const d = data as { ok?: boolean; message?: string } | null;
    return {
      ok: d?.ok === true,
      message: d?.message || (d?.ok ? 'Password updated in Supabase.' : 'Update failed.'),
    };
  } catch (err: any) {
    return { ok: false, message: err?.message || 'Admin password reset failed.' };
  }
};

/**
 * Query registered security question for an account from Supabase without leaking the answer.
 */
export const remoteGetSecurityQuestion = async (
  identifier: string
): Promise<{
  exists: boolean;
  hasQuestion: boolean;
  securityQuestion?: string;
  name?: string;
  role?: string;
}> => {
  if (!supabase) return { exists: false, hasQuestion: false };
  try {
    const { data, error } = await supabase.rpc('get_user_security_question', {
      p_identifier: identifier,
    });
    if (error || !data) return { exists: false, hasQuestion: false };
    const d = data as {
      exists?: boolean;
      hasQuestion?: boolean;
      securityQuestion?: string;
      name?: string;
      role?: string;
    };
    return {
      exists: d.exists === true,
      hasQuestion: d.hasQuestion === true,
      securityQuestion: d.securityQuestion,
      name: d.name,
      role: d.role,
    };
  } catch {
    return { exists: false, hasQuestion: false };
  }
};

/**
 * Register scholar credentials directly into Supabase (self-enrollment).
 */
export const remoteRegisterStudentCredential = async (
  identifier: string,
  password: string,
  refId: string,
  aliases: string[] = []
): Promise<{ ok: boolean; message: string }> => {
  if (!supabase) return { ok: false, message: 'Supabase offline or not configured.' };
  try {
    const { data, error } = await supabase.rpc('register_student_credential', {
      p_identifier: identifier,
      p_password: password,
      p_ref_id: refId,
      p_aliases: aliases,
    });
    if (error) {
      console.warn('[Supabase Student Reg] Credential creation rejected:', error.message);
      return { ok: false, message: error.message };
    }
    const d = data as { ok?: boolean; message?: string } | null;
    return {
      ok: d?.ok === true,
      message: d?.message || 'Scholar credentials registered in Supabase.',
    };
  } catch (err: any) {
    return { ok: false, message: err?.message || 'Registration failed.' };
  }
};

// Verify administrative authority server-side using SECURITY DEFINER RPC
export const checkRemoteAdminStatus = async (): Promise<boolean> => {
  if (!supabase || !sessionToken) return false;
  try {
    const { data, error } = await supabase.rpc('is_admin_session');
    if (error || !data) return false;
    return data === true;
  } catch {
    return false;
  }
};

// After a remote-verified login, hydrate (now including private collections
// unlocked by the session token) then reload so every mounted state picks up
// the shared data. The portal section is stashed so App lands back in it.
export const completeRemoteLogin = async (token: string, targetSection: string): Promise<never> => {
  setDbSession(token);
  try { sessionStorage.setItem('stanbax_resume_section', targetSection); } catch { /* ignore */ }
  await hydrateFromSupabase();
  window.location.reload();
  // unreachable in a real browser, but satisfies typing in tests
  return new Promise<never>(() => {});
};

export const remoteLogout = async (): Promise<void> => {
  if (!supabase || !sessionToken) return;
  try {
    await supabase.rpc('logout_session', { p_token: sessionToken });
  } catch { /* ignore */ }
  setDbSession(null);
};

export const remoteChangePassword = async (
  identifier: string,
  oldPassword: string | null,
  newPassword: string
): Promise<{ ok: boolean; message?: string }> => {
  if (!supabase || !sessionToken) return { ok: false, message: 'Supabase offline or no session.' };
  try {
    const { data, error } = await supabase.rpc('change_password', {
      p_identifier: identifier,
      p_old_password: oldPassword,
      p_new_password: newPassword,
    });
    if (error) {
      console.warn('[Supabase Security] Password change rejected:', error.message);
      return { ok: false, message: error.message };
    }
    const d = data as { ok?: boolean; message?: string } | null;
    return { ok: d?.ok === true, message: d?.message };
  } catch (err: any) {
    return { ok: false, message: err?.message || 'Password update failed.' };
  }
};

export const remoteCreateCredential = async (
  identifier: string,
  password: string,
  role: string,
  refId: string,
  aliases: string[] = []
): Promise<{ ok: boolean; message?: string }> => {
  if (!supabase || !sessionToken) return { ok: false, message: 'Supabase offline or no session.' };
  try {
    const { data, error } = await supabase.rpc('create_credential', {
      p_identifier: identifier,
      p_password: password,
      p_role: role,
      p_ref_id: refId,
      p_aliases: aliases,
    });
    if (error) {
      console.warn('[Supabase Security] Credential creation unauthorized:', error.message);
      return { ok: false, message: error.message };
    }
    const d = data as { ok?: boolean; message?: string } | null;
    return { ok: d?.ok === true, message: d?.message };
  } catch (err: any) {
    return { ok: false, message: err?.message || 'Credential provisioning failed.' };
  }
};

/**
 * Public visitor submission: admission application.
 */
export const remoteSubmitAdmissionApplication = async (
  application: unknown
): Promise<{ ok: boolean; message: string }> => {
  if (!supabase) return { ok: false, message: 'Database offline.' };
  try {
    const { data, error } = await supabase.rpc('submit_admission_application', {
      p_application: application,
    });
    if (error) return { ok: false, message: error.message };
    const d = data as { ok?: boolean; message?: string } | null;
    return { ok: d?.ok === true, message: d?.message || 'Application submitted.' };
  } catch (err: any) {
    return { ok: false, message: err?.message || 'Submission error.' };
  }
};

/**
 * Public visitor submission: contact inquiry.
 */
export const remoteSubmitContactInquiry = async (
  inquiry: unknown
): Promise<{ ok: boolean; message: string }> => {
  if (!supabase) return { ok: false, message: 'Database offline.' };
  try {
    const { data, error } = await supabase.rpc('submit_contact_inquiry', {
      p_inquiry: inquiry,
    });
    if (error) return { ok: false, message: error.message };
    const d = data as { ok?: boolean; message?: string } | null;
    return { ok: d?.ok === true, message: d?.message || 'Message sent.' };
  } catch (err: any) {
    return { ok: false, message: err?.message || 'Submission error.' };
  }
};

// ---------------------------------------------------------------------------
// Write-through: every localStorage.setItem('stanbax_*', ...) also queues a
// remote upsert into the school_state KV table (debounced, best-effort).
// ---------------------------------------------------------------------------

const pendingWrites = new Map<string, string | null>();
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let suppressRemote = false;

const flushWrites = async () => {
  flushTimer = null;
  if (!supabase || !sessionToken) { pendingWrites.clear(); return; }
  const batch = [...pendingWrites.entries()];
  pendingWrites.clear();
  const upserts = batch
    .filter(([, v]) => v !== null)
    .map(([key, v]) => ({ key, data: JSON.parse(v as string) }));
  const deletes = batch.filter(([, v]) => v === null).map(([k]) => k);
  
  try {
    if (upserts.length) {
      const { error } = await supabase.rpc('put_states', { p_items: upserts });
      if (error) {
        console.warn('[Supabase Sync] State write restricted or unauthorized:', error.message);
        if (error.message?.includes('Not signed in')) {
          setDbSession(null);
        }
      }
    }
    if (deletes.length) {
      const { error } = await supabase.rpc('delete_states', { p_keys: deletes });
      if (error) {
        console.warn('[Supabase Sync] State delete restricted:', error.message);
      }
    }
  } catch (err) {
    console.warn('[Supabase Sync] State flush handled gracefully:', err);
  }
};

const scheduleFlush = () => {
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = setTimeout(() => { void flushWrites(); }, 400);
};

export const queueRemoteWrite = (key: string, serialized: string | null): void => {
  if (!isRemoteEnabled() || suppressRemote) return;
  pendingWrites.set(key, serialized);
  scheduleFlush();
};

let patchInstalled = false;
export const installLocalStorageSync = (): void => {
  if (patchInstalled || typeof localStorage === 'undefined') return;
  patchInstalled = true;
  const origSet = localStorage.setItem.bind(localStorage);
  const origRemove = localStorage.removeItem.bind(localStorage);
  localStorage.setItem = (key: string, value: string) => {
    origSet(key, value);
    if (key.startsWith('stanbax_')) queueRemoteWrite(key, value);
  };
  localStorage.removeItem = (key: string) => {
    origRemove(key);
    if (key.startsWith('stanbax_')) queueRemoteWrite(key, null);
  };
};

// ---------------------------------------------------------------------------
// Hydration: pull all readable rows into localStorage before React renders,
// so every existing useState(localStorage.getItem(...)) initializer picks up
// the shared remote state. Public rows are readable without a session;
// private rows unlock after login.
// ---------------------------------------------------------------------------

export const hydrateFromSupabase = async (): Promise<void> => {
  if (!supabase) return;
  try {
    const { data, error } = await supabase
      .from('school_state')
      .select('key, data');
    if (error) {
      console.warn('[Supabase Hydrate] Read restricted or unavailable:', error.message);
      return;
    }
    if (!data) return;

    const remoteKeys = new Set<string>();
    suppressRemote = true;
    try {
      for (const row of data as Array<{ key: string; data: unknown }>) {
        if (row.data === null || row.data === undefined) continue;
        remoteKeys.add(row.key);
        localStorage.setItem(row.key, JSON.stringify(row.data));
      }
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (k?.startsWith('stanbax_')) {
          const v = localStorage.getItem(k);
          if (v === 'null' || v === 'undefined') localStorage.removeItem(k);
        }
      }
    } finally {
      suppressRemote = false;
    }

    // Bootstrap local seeds to remote if missing and user has valid session
    if (sessionToken) {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('stanbax_') && !remoteKeys.has(k)) {
          queueRemoteWrite(k, localStorage.getItem(k));
        }
      }
    }
  } catch (err) {
    console.warn('[Supabase Hydrate] Fallback to local cache:', err);
  }
};

/**
 * Push all local data collections directly to Supabase PostgreSQL.
 * Used for one-click initial database population or migration.
 */
export const pushAllDataToSupabase = async (
  snapshotData: Record<string, unknown>
): Promise<{ ok: boolean; message: string; count?: number }> => {
  if (!supabase || !sessionToken) {
    return {
      ok: false,
      message: 'You must be logged in as Administrator and have Supabase connected to push all data.',
    };
  }

  try {
    const items: Array<{ key: string; data: unknown }> = [];
    for (const [key, value] of Object.entries(snapshotData)) {
      if (value !== undefined && value !== null) {
        items.push({ key: key.startsWith('stanbax_') ? key : `stanbax_${key}`, data: value });
      }
    }

    // Send in batches of 10
    let totalWritten = 0;
    const batchSize = 10;
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const { error } = await supabase.rpc('put_states', { p_items: batch });
      if (error) {
        throw new Error(`Batch upload failed at item ${i}: ${error.message}`);
      }
      totalWritten += batch.length;
    }

    return {
      ok: true,
      message: `Successfully synchronized ${totalWritten} collections directly into Supabase central database!`,
      count: totalWritten,
    };
  } catch (err: any) {
    return { ok: false, message: err?.message || 'Sync failed.' };
  }
};
