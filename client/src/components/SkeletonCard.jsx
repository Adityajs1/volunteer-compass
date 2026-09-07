import { T } from '../theme';

/* Shimmer animation keyframes are injected here once */
const shimmerStyle = `
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }
`;

const shimmer = {
  background: `linear-gradient(90deg, ${T.cream} 25%, ${T.cream2} 50%, ${T.cream} 75%)`,
  backgroundSize: '600px 100%',
  animation: 'shimmer 1.5s infinite linear',
  borderRadius: 8,
};

export default function SkeletonCard() {
  return (
    <>
      <style>{shimmerStyle}</style>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '15px 24px',
          borderBottom: `1px solid ${T.border}`,
          gap: 16,
        }}
      >
        {/* Left: title + subtitle */}
        <div style={{ flex: 1 }}>
          <div style={{ ...shimmer, height: 14, width: '60%', marginBottom: 8 }} />
          <div style={{ ...shimmer, height: 11, width: '35%' }} />
        </div>

        {/* Right: badge + button placeholders */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ ...shimmer, height: 22, width: 70, borderRadius: 99 }} />
          <div style={{ ...shimmer, height: 22, width: 55 }} />
          <div style={{ ...shimmer, height: 30, width: 60, borderRadius: 7 }} />
        </div>
      </div>
    </>
  );
}
