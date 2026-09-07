import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { T } from '../theme';

const SKILLS_LIST = [
  'Teaching', 'Medical help', 'Environment', 'Management', 'Design & tech',
  'Logistics', 'Fundraising', 'Legal aid', 'Photography', 'Mental health',
  'IT Support', 'Cooking',
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DEPARTMENTS = [
  'Select department...', 'Operations', 'HR / People', 'Marketing & Outreach',
  'Technology', 'Community Programs', 'Finance', 'Legal', 'Other',
];

/* ─── Shared input style ─── */
const inp = {
  width: '100%',
  padding: '11px 14px',
  border: `1px solid #D4E6DA`,
  borderRadius: 8,
  fontSize: '0.88rem',
  color: T.ink,
  fontFamily: "'Cabinet Grotesk', sans-serif",
  outline: 'none',
  background: '#fff',
  boxSizing: 'border-box',
};

/* ─── Section divider ─── */
function SectionDivider({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '28px 0 20px' }}>
      <div style={{ flex: 1, height: 1, background: T.border }} />
      <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '1.5px', color: T.muted, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: T.border }} />
    </div>
  );
}

/* ─── 2-col grid wrapper ─── */
function Grid({ children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      {children}
    </div>
  );
}

/* ─── Field wrapper ─── */
function Field({ label, required, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>
        {label}{required && <span style={{ color: '#DC2626' }}> *</span>}
      </label>
      {children}
    </div>
  );
}

export default function Signup({ setPage, defaultRole = 'VOLUNTEER' }) {
  const { register } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [role, setRole] = useState(defaultRole);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);

  const [form, setForm] = useState({
    name: '', city: '', email: '', phone: '', password: '',
    // Volunteer fields
    hoursPerWeek: '', yearsExperience: '',
    emergencyName: '', emergencyPhone: '', bio: '',
    // Organizer fields
    jobTitle: '', orgName: '', department: 'Select department...', orgWebsite: '',
    contactPerson: '', contactEmail: '', volunteerNeeds: '',
  });

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const toggleSkill = (skill) => setSelectedSkills(prev =>
    prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
  );
  const toggleDay = (day) => setSelectedDays(prev =>
    prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return addToast('Please fill all required fields', 'error');
    if (form.password.length < 8) return addToast('Password must be at least 8 characters', 'error');

    setLoading(true);
    try {
      // Build a rich bio string storing all the extra info
      let bioText = '';
      if (role === 'VOLUNTEER') {
        const parts = [];
        if (selectedSkills.length) parts.push(`Skills: ${selectedSkills.join(', ')}`);
        if (selectedDays.length) parts.push(`Available: ${selectedDays.join(', ')}`);
        if (form.hoursPerWeek) parts.push(`Hours/week: ${form.hoursPerWeek}`);
        if (form.yearsExperience) parts.push(`Experience: ${form.yearsExperience} yrs`);
        if (form.bio) parts.push(form.bio);
        bioText = parts.join(' | ');
      } else {
        const parts = [];
        if (form.jobTitle) parts.push(`Title: ${form.jobTitle}`);
        if (form.orgName) parts.push(`Org: ${form.orgName}`);
        if (form.department && form.department !== 'Select department...') parts.push(`Dept: ${form.department}`);
        if (form.orgWebsite) parts.push(`Web: ${form.orgWebsite}`);
        if (form.volunteerNeeds) parts.push(form.volunteerNeeds);
        bioText = parts.join(' | ');
      }

      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role,
        city: form.city,
        bio: bioText,
      });

      addToast(role === 'ORGANIZER' ? 'Organisation registered successfully! 🎉' : 'Welcome to Volunteer Compass! 🎉', 'success');
      setPage('dashboard');
    } catch (err) {
      addToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: T.cream }}>
      {/* Dark header */}
      <div style={{
        background: `linear-gradient(135deg, ${T.ink} 0%, ${T.ink2} 100%)`,
        padding: '48px 24px 40px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontFamily: "'Fraunces', serif", fontWeight: 900,
          fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
          color: '#fff', letterSpacing: '-1px', marginBottom: 10,
        }}>
          Join the VolunteerCompass{' '}
          <em style={{ fontStyle: 'italic', color: T.gold }}>
            {role === 'ORGANIZER' ? 'network' : 'community'}
          </em>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem' }}>
          {role === 'ORGANIZER'
            ? 'Post your events and connect with skilled volunteers ready to help.'
            : 'Be the first to connect with the right opportunities or volunteers.'}
        </p>
      </div>

      {/* Form card */}
      <div style={{ maxWidth: 600, margin: '-20px auto 60px', padding: '0 20px' }}>
        <div style={{
          background: '#fff',
          borderRadius: 20,
          padding: '36px 36px 40px',
          boxShadow: '0 4px 32px rgba(10,26,18,0.08)',
          border: `1px solid ${T.border}`,
        }}>
          <form onSubmit={handleSubmit}>

            {/* ── Role Selector ── */}
            <div style={{ marginBottom: 4 }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>
                I AM JOINING AS <span style={{ color: '#DC2626' }}>*</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { value: 'VOLUNTEER', icon: '👤', title: 'Volunteer', sub: 'I want to find & join events' },
                  { value: 'ORGANIZER', icon: '📋', title: 'Organizer', sub: 'I want to recruit volunteers' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRole(opt.value)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '14px 16px', borderRadius: 10, cursor: 'pointer',
                      border: `2px solid ${role === opt.value ? T.leaf : T.border}`,
                      background: role === opt.value ? T.leaf : '#fff',
                      transition: 'all 0.2s', textAlign: 'left',
                    }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                      background: role === opt.value ? 'rgba(255,255,255,0.2)' : T.cream,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.1rem',
                    }}>
                      {opt.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: role === opt.value ? '#fff' : T.ink }}>
                        {opt.title}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: role === opt.value ? 'rgba(255,255,255,0.75)' : T.muted }}>
                        {opt.sub}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Your Details ── */}
            <SectionDivider label="Your Details" />
            <Grid>
              <Field label="Full Name" required>
                <input style={inp} type="text" placeholder="e.g. Priya Sharma" value={form.name} onChange={set('name')} />
              </Field>
              <Field label="City / Location" required>
                <input style={inp} type="text" placeholder="e.g. New Delhi" value={form.city} onChange={set('city')} />
              </Field>
              <Field label="Email Address" required>
                <input style={inp} type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} />
              </Field>
              <Field label="Phone Number">
                <input style={inp} type="tel" placeholder="10-digit number" value={form.phone} onChange={set('phone')} />
              </Field>
              <Field label="Password" required>
                <input style={inp} type="password" placeholder="Min. 8 characters" value={form.password} onChange={set('password')} />
              </Field>
            </Grid>

            {/* ── Volunteer-specific ── */}
            {role === 'VOLUNTEER' && (
              <>
                <SectionDivider label="Volunteer Details" />

                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>
                    SKILLS YOU CAN OFFER
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {SKILLS_LIST.map(skill => (
                      <button
                        key={skill} type="button"
                        onClick={() => toggleSkill(skill)}
                        style={{
                          padding: '6px 14px', borderRadius: 99,
                          fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                          fontFamily: "'Cabinet Grotesk', sans-serif",
                          border: `1px solid ${selectedSkills.includes(skill) ? T.leaf : T.border}`,
                          background: selectedSkills.includes(skill) ? T.leaf : '#fff',
                          color: selectedSkills.includes(skill) ? '#fff' : T.ink,
                          transition: 'all 0.15s',
                        }}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>
                    AVAILABILITY — DAYS
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {DAYS.map(day => (
                      <button
                        key={day} type="button"
                        onClick={() => toggleDay(day)}
                        style={{
                          width: 46, height: 36, borderRadius: 8,
                          fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                          fontFamily: "'Cabinet Grotesk', sans-serif",
                          border: `1px solid ${selectedDays.includes(day) ? T.leaf : T.border}`,
                          background: selectedDays.includes(day) ? T.leaf : '#fff',
                          color: selectedDays.includes(day) ? '#fff' : T.ink,
                          transition: 'all 0.15s',
                        }}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <Grid>
                  <Field label="Hours Available Per Week">
                    <input style={inp} type="text" placeholder="e.g. 5–10 hours" value={form.hoursPerWeek} onChange={set('hoursPerWeek')} />
                  </Field>
                  <Field label="Years of Volunteer Experience">
                    <input style={inp} type="text" placeholder="e.g. 2 years" value={form.yearsExperience} onChange={set('yearsExperience')} />
                  </Field>
                </Grid>

                <SectionDivider label="Emergency Contact" />
                <Grid>
                  <Field label="Contact Name">
                    <input style={inp} type="text" placeholder="e.g. Arun Sharma" value={form.emergencyName} onChange={set('emergencyName')} />
                  </Field>
                  <Field label="Contact Phone">
                    <input style={inp} type="tel" placeholder="10-digit number" value={form.emergencyPhone} onChange={set('emergencyPhone')} />
                  </Field>
                </Grid>

                <div style={{ marginTop: 18 }}>
                  <Field label="Tell us about yourself (Optional)">
                    <textarea
                      style={{ ...inp, minHeight: 90, resize: 'vertical' }}
                      placeholder="Share your motivation, past experience, or anything you'd like us to know..."
                      value={form.bio} onChange={set('bio')}
                    />
                  </Field>
                </div>
              </>
            )}

            {/* ── Organizer-specific ── */}
            {role === 'ORGANIZER' && (
              <>
                <SectionDivider label="Organizer Details" />
                <Grid>
                  <Field label="Job Title" required>
                    <input style={inp} type="text" placeholder="e.g. Program Coordinator" value={form.jobTitle} onChange={set('jobTitle')} />
                  </Field>
                  <Field label="Organization Name" required>
                    <input style={inp} type="text" placeholder="e.g. GreenEarth NGO" value={form.orgName} onChange={set('orgName')} />
                  </Field>
                  <Field label="Department">
                    <select
                      style={{ ...inp, appearance: 'none', cursor: 'pointer' }}
                      value={form.department} onChange={set('department')}
                    >
                      {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </Field>
                  <Field label="Organization Website">
                    <input style={inp} type="url" placeholder="https://yourorg.org" value={form.orgWebsite} onChange={set('orgWebsite')} />
                  </Field>
                </Grid>

                <SectionDivider label="Event Contact" />
                <Grid>
                  <Field label="Primary Contact Person" required>
                    <input style={inp} type="text" placeholder="e.g. Neha Gupta" value={form.contactPerson} onChange={set('contactPerson')} />
                  </Field>
                  <Field label="Contact Email" required>
                    <input style={inp} type="email" placeholder="contact@yourorg.org" value={form.contactEmail} onChange={set('contactEmail')} />
                  </Field>
                </Grid>

                <div style={{ marginTop: 18 }}>
                  <Field label="Describe Your Volunteer Needs (Optional)">
                    <textarea
                      style={{ ...inp, minHeight: 90, resize: 'vertical' }}
                      placeholder="What kind of volunteers are you looking for? What events are you planning?"
                      value={form.volunteerNeeds} onChange={set('volunteerNeeds')}
                    />
                  </Field>
                </div>
              </>
            )}

            {/* ── Submit ── */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', marginTop: 28,
                background: loading ? T.muted : T.leaf,
                color: '#fff', border: 'none', borderRadius: 10,
                padding: '14px', fontWeight: 800, fontSize: '0.95rem',
                fontFamily: "'Cabinet Grotesk', sans-serif",
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = T.leaf2; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = T.leaf; }}
            >
              {loading ? 'Creating account...' : (role === 'ORGANIZER' ? 'Register Organisation →' : 'Join Volunteer Compass →')}
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.72rem', color: T.muted, marginTop: 12 }}>
              By submitting, you agree to be contacted about VolunteerCompass. No spam, ever.
            </p>

            <div style={{ textAlign: 'center', marginTop: 16, fontSize: '0.85rem', color: T.muted }}>
              Already have an account?{' '}
              <span onClick={() => setPage('login')} style={{ color: T.leaf, fontWeight: 700, cursor: 'pointer' }}>
                Log in
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
