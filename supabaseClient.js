/**
 * Bulwark SEC, Inc. — Supabase Client Configuration & Data Service Layer
 * Project URL: https://ejxqjavwgfrqtaxvlvol.supabase.co
 */

const SUPABASE_URL = 'https://ejxqjavwgfrqtaxvlvol.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_MRn4w9bPjaiZgKDqVXtCJQ_d6e0-OP3';

// Initialize Supabase Client (supports browser global `supabase` from CDN)
let sbClient = null;

function getSupabaseClient() {
  if (sbClient) return sbClient;
  if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
    sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return sbClient;
  }
  return null;
}

// ── BULWARK SEC DATABASE SERVICES ──────────────────────────────────────────

const BulwarkDB = {
  get client() {
    return getSupabaseClient();
  },

  /**
   * 1. HIRE & QUOTE REQUESTS (hire.html, estimator.html)
   */
  async submitGuardRequest(formData) {
    const client = getSupabaseClient();
    if (!client) {
      console.warn('Supabase not initialized; falling back to local simulation.');
      return { success: true, data: formData, simulated: true };
    }
    const { data, error } = await client
      .from('guard_requests')
      .insert([
        {
          full_name: formData.fullName || formData.name,
          company_name: formData.companyName || formData.company,
          email: formData.email,
          phone: formData.phone,
          property_type: formData.propertyType || formData.facilityType,
          guard_type: formData.guardType || 'uniformed_armed',
          coverage_hours: formData.coverageHours || '24_7',
          officers_needed: parseInt(formData.officersCount || formData.officersNeeded || 1, 10),
          estimated_weekly_budget: formData.estimatedBudget || null,
          start_date: formData.startDate || null,
          site_address: formData.address || null,
          special_instructions: formData.notes || formData.message || null,
          status: 'pending_review',
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Error submitting guard request to Supabase:', error);
      throw error;
    }
    return { success: true, data };
  },

  /**
   * 2. ACTIVE GUARD POSTS (portal.html, patrol.html)
   */
  async fetchActivePosts(clientId = null) {
    const client = getSupabaseClient();
    if (!client) return { data: null, error: 'Client unavailable' };

    let query = client
      .from('guard_posts')
      .select('*')
      .order('post_code', { ascending: true });

    if (clientId) {
      query = query.eq('client_id', clientId);
    }

    const { data, error } = await query;
    return { data, error };
  },

  /**
   * 3. INCIDENT REPORTS (portal.html, patrol.html)
   */
  async fetchIncidents(clientId = null) {
    const client = getSupabaseClient();
    if (!client) return { data: null, error: 'Client unavailable' };

    let query = client
      .from('incident_reports')
      .select('*')
      .order('logged_at', { ascending: false })
      .limit(50);

    if (clientId) {
      query = query.eq('client_id', clientId);
    }

    const { data, error } = await query;
    return { data, error };
  },

  async logIncident(incident) {
    const client = getSupabaseClient();
    if (!client) return { success: true, data: incident, simulated: true };

    const { data, error } = await client
      .from('incident_reports')
      .insert([
        {
          post_code: incident.postCode || 'MBU-01',
          severity: incident.severity || 'low',
          title: incident.title,
          description: incident.description,
          officer_name: incident.officerName || 'Officer On Post',
          status: incident.status || 'open',
          logged_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;
    return { success: true, data };
  },

  /**
   * 4. GUARD TOUR & NFC CHECKPOINTS (portal.html)
   */
  async fetchTourScans(clientId = null) {
    const client = getSupabaseClient();
    if (!client) return { data: null, error: 'Client unavailable' };

    let query = client
      .from('guard_tour_scans')
      .select('*')
      .order('scanned_at', { ascending: false })
      .limit(100);

    const { data, error } = await query;
    return { data, error };
  },

  /**
   * 5. OFFICER RECRUITMENT & VETTING (vetting.html)
   */
  async submitOfficerApplication(applicant) {
    const client = getSupabaseClient();
    if (!client) return { success: true, data: applicant, simulated: true };

    const { data, error } = await client
      .from('officer_applicants')
      .insert([
        {
          full_name: applicant.fullName,
          email: applicant.email,
          phone: applicant.phone,
          guard_card_number: applicant.guardCardNumber || null,
          military_law_enforcement_exp: !!applicant.priorService,
          vetting_stage: 'stage_1_identity',
          status: 'under_review',
          applied_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;
    return { success: true, data };
  },

  /**
   * 6. REALTIME SUBSCRIPTION FOR LIVE PATROL FEEDS (patrol.html, portal.html)
   */
  subscribeToLivePatrol(onUpdate) {
    const client = getSupabaseClient();
    if (!client) return null;

    const channel = client
      .channel('public:guard_tour_scans')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'guard_tour_scans' },
        (payload) => {
          if (typeof onUpdate === 'function') onUpdate(payload.new);
        }
      )
      .subscribe();

    return channel;
  }
};

// Expose globally to window
if (typeof window !== 'undefined') {
  window.BulwarkDB = BulwarkDB;
  window.SUPABASE_CONFIG = {
    URL: SUPABASE_URL,
    ANON_KEY: SUPABASE_ANON_KEY
  };
}
