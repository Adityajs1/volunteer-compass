import { useEffect, useState } from 'react';
import { T } from '../theme';
import { useAuth } from '../context/AuthContext';
import { jsPDF } from 'jspdf';
import apiClient from '../api/client';

export default function VolunteerHours({ setPage }) {
  const { user } = useAuth();
  const [hours, setHours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHours = async () => {
      try {
        const data = await apiClient.get('/rsvps/my-hours');
        setHours(data.data || []);
      } catch (err) {
        console.error('Failed to fetch hours', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHours();
  }, []);

  const totalHours = hours.reduce((sum, h) => sum + (h.hoursVolunteered || 0), 0);

  const downloadCertificate = (entry) => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    // Background
    doc.setFillColor(250, 246, 237); // T.cream
    doc.rect(0, 0, pageW, pageH, 'F');

    // Border
    doc.setDrawColor(26, 122, 82); // T.leaf
    doc.setLineWidth(3);
    doc.rect(10, 10, pageW - 20, pageH - 20);
    doc.setLineWidth(1);
    doc.rect(13, 13, pageW - 26, pageH - 26);

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(36);
    doc.setTextColor(26, 122, 82);
    doc.text('VOLUNTEER COMPASS', pageW / 2, 38, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(82, 112, 96);
    doc.text('Certificate of Volunteer Service', pageW / 2, 50, { align: 'center' });

    // Divider line
    doc.setDrawColor(232, 218, 192);
    doc.setLineWidth(0.5);
    doc.line(30, 56, pageW - 30, 56);

    // Body
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(10, 26, 18);
    doc.text('This certifies that', pageW / 2, 70, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(10, 26, 18);
    doc.text(user?.name || 'Volunteer', pageW / 2, 84, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(10, 26, 18);
    doc.text('has successfully completed volunteer service for the event:', pageW / 2, 96, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(26, 122, 82);
    doc.text(`"${entry.event?.title || 'Volunteer Event'}"`, pageW / 2, 110, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(10, 26, 18);
    const dateStr = entry.checkedInAt
      ? new Date(entry.checkedInAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
      : new Date().toLocaleDateString();
    doc.text(`Date of Service: ${dateStr}`, pageW / 2, 124, { align: 'center' });
    doc.text(
      `Hours Completed: ${entry.hoursVolunteered?.toFixed(1) || '—'} hours`,
      pageW / 2, 134, { align: 'center' }
    );

    // Organised by
    if (entry.event?.organizer?.name) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(11);
      doc.setTextColor(82, 112, 96);
      doc.text(`Organized by: ${entry.event.organizer.name}`, pageW / 2, 147, { align: 'center' });
    }

    // Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(82, 112, 96);
    doc.text('Volunteer Compass — Connecting Hearts with Causes', pageW / 2, pageH - 18, { align: 'center' });

    doc.save(`VolunteerCertificate_${entry.event?.title?.replace(/\s+/g, '_') || 'event'}.pdf`);
  };

  return (
    <div style={{ maxWidth: 760, margin: '64px auto', padding: '0 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: '2.2rem', color: T.ink, letterSpacing: '-1px', marginBottom: 6 }}>
            My Volunteer Hours
          </h1>
          <p style={{ color: T.muted, fontSize: '0.95rem' }}>
            Download PDF certificates for events you've attended.
          </p>
        </div>
        <button
          onClick={() => setPage('dashboard')}
          style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 9, padding: '10px 20px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', color: T.ink, fontFamily: "'Cabinet Grotesk', sans-serif" }}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Total hours stat */}
      <div style={{ background: T.leaf, borderRadius: 18, padding: '22px 28px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div>
          <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: '2.8rem', color: '#fff', letterSpacing: '-1px', lineHeight: 1 }}>
            {totalHours.toFixed(1)}h
          </div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.82rem', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Total Hours Volunteered
          </div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '3rem' }}>🌱</div>
      </div>

      {/* Hours list */}
      <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 20, overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: `1px solid ${T.border}`, fontWeight: 800, fontSize: '0.95rem', color: T.ink }}>
          Attended Events ({hours.length})
        </div>

        {loading ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: T.muted }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>⏳</div>
            Loading your hours...
          </div>
        ) : hours.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: T.muted }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>📋</div>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>No verified hours yet</div>
            <div style={{ fontSize: '0.85rem', marginBottom: 16 }}>
              Once an organizer marks you as attended, your hours will appear here.
            </div>
            <button
              onClick={() => setPage('dashboard')}
              style={{ background: T.leaf, color: '#fff', border: 'none', borderRadius: 9, padding: '9px 22px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              Browse Events
            </button>
          </div>
        ) : (
          hours.map((entry, i) => (
            <div
              key={entry.id}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 24px',
                borderBottom: i === hours.length - 1 ? 'none' : `1px solid ${T.border}`,
                flexWrap: 'wrap', gap: 12,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: T.ink }}>
                  {entry.event?.title || 'Volunteer Event'}
                  {entry.checkedIn && (
                    <span style={{ marginLeft: 8, background: '#E8F5E9', color: '#2E7D32', borderRadius: 99, padding: '2px 8px', fontSize: '0.68rem', fontWeight: 700 }}>
                      ✅ Verified
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.74rem', color: T.muted, marginTop: 2 }}>
                  {entry.event?.organizer?.name} ·{' '}
                  {entry.checkedInAt
                    ? new Date(entry.checkedInAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                    : 'Date pending'}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {entry.hoursVolunteered != null && (
                  <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, fontSize: '1.2rem', color: T.leaf }}>
                    {entry.hoursVolunteered.toFixed(1)}h
                  </span>
                )}
                <button
                  onClick={() => downloadCertificate(entry)}
                  disabled={!entry.checkedIn}
                  style={{
                    background: entry.checkedIn ? T.gold : T.cream2,
                    color: entry.checkedIn ? T.ink : T.muted,
                    border: 'none', borderRadius: 8,
                    padding: '8px 16px', fontWeight: 700,
                    fontSize: '0.78rem', cursor: entry.checkedIn ? 'pointer' : 'not-allowed',
                    fontFamily: "'Cabinet Grotesk', sans-serif",
                    transition: 'background 0.15s',
                  }}
                  title={entry.checkedIn ? 'Download PDF Certificate' : 'Attendance not yet verified by organizer'}
                >
                  {entry.checkedIn ? '⬇ Certificate' : 'Pending Verification'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
