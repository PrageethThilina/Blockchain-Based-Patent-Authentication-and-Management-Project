import React from 'react';
import { Award, Clock, ArrowRightLeft, ShieldCheck, Globe2 } from 'lucide-react';

export default function StatsCards({ stats }) {
  if (!stats) return null;

  const cardData = [
    {
      title: 'Total Anchored Patents',
      value: stats.totalPatents || 0,
      sub: 'Cryptographically registered on-chain',
      icon: Award,
      color: '#6366f1',
      bgGlow: 'rgba(99, 102, 241, 0.12)'
    },
    {
      title: 'Active Granted Patents',
      value: stats.activePatents || 0,
      sub: 'Enforceable across jurisdictions',
      icon: ShieldCheck,
      color: '#10b981',
      bgGlow: 'rgba(16, 185, 129, 0.12)'
    },
    {
      title: 'Under Examination',
      value: stats.underExamination || 0,
      sub: `USPTO: ${stats.pendingByOffice?.USPTO || 0} | JPO: ${stats.pendingByOffice?.JPO || 0} | EPO: ${stats.pendingByOffice?.EPO || 0}`,
      icon: Clock,
      color: '#f59e0b',
      bgGlow: 'rgba(245, 158, 11, 0.12)'
    },
    {
      title: 'Pending WIPO Transfers',
      value: stats.transferPending || 0,
      sub: 'Cross-border certification pending',
      icon: ArrowRightLeft,
      color: '#06b6d4',
      bgGlow: 'rgba(6, 182, 212, 0.12)'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '20px',
      marginBottom: '32px'
    }}>
      {cardData.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="glass-panel glass-panel-glow"
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Ambient Background Glow */}
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              backgroundColor: c.bgGlow,
              filter: 'blur(30px)',
              pointerEvents: 'none'
            }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                {c.title}
              </span>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: c.bgGlow,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: c.color
              }}>
                <Icon size={20} />
              </div>
            </div>

            <div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2.2rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                lineHeight: 1.1,
                marginBottom: '6px'
              }}>
                {c.value}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 500 }}>
                {c.sub}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
