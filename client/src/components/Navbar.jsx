import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  ArrowRightLeft, 
  Search, 
  Lock, 
  PlusCircle, 
  ChevronDown, 
  Wallet,
  Globe,
  UserCheck
} from 'lucide-react';

export const ROLES = [
  { id: 'INVENTOR', label: 'Inventor Portal', icon: '🎓', sub: 'Dr. Elena Rostova', desc: 'File Inventions & Manage Portfolio' },
  { id: 'USPTO', label: 'USPTO Examiner', icon: '🇺🇸', sub: 'United States Patent Office', desc: 'Examine US Jurisdiction Claims' },
  { id: 'JPO', label: 'JPO Examiner', icon: '🇯🇵', sub: 'Japan Patent Office (特許庁)', desc: 'Examine JP Jurisdiction Claims' },
  { id: 'EPO', label: 'EPO Examiner', icon: '🇪🇺', sub: 'European Patent Office', desc: 'Examine EU Jurisdiction Claims' },
  { id: 'WIPO', label: 'WIPO Director', icon: '🌐', sub: 'World Intellectual Property Org', desc: 'Certify Cross-Border Transfers' },
  { id: 'ADMIN', label: 'Super Admin', icon: '⚡', sub: 'Registry Root Authority', desc: 'Full System RBAC Override' }
];

export default function Navbar({ activeTab, setActiveTab, currentRole, onRoleChange, onOpenNewPatent, userAddress }) {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const activeRoleObj = ROLES.find(r => r.id === currentRole) || ROLES[0];

  const handleSelectRole = (roleId) => {
    onRoleChange(roleId);
    setRoleDropdownOpen(false);
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(7, 10, 18, 0.88)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0 24px'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '76px'
      }}>
        {/* Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
          }}>
            <ShieldCheck size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                PatentRegistry
              </span>
              <span style={{
                background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: '4px',
                letterSpacing: '0.05em'
              }}>
                ENTERPRISE
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="pulse-dot"></span>
              <span>Smart Contract: <span className="mono">0x5FbD...aa3</span> (EVM Verified)</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {[
            { id: 'registry', label: 'Patent Registry', icon: FileText },
            { id: 'examination', label: 'Examinations', icon: CheckCircle2 },
            { id: 'transfers', label: 'WIPO Transfers', icon: ArrowRightLeft },
            { id: 'verifier', label: 'Public Verifier', icon: Search }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  backgroundColor: isActive ? 'rgba(99, 102, 241, 0.18)' : 'transparent',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.35)' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} color={isActive ? '#818cf8' : 'currentColor'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section: Role Switcher & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* New Patent Button */}
          <button
            id="btn-open-new-patent"
            className="btn btn-primary btn-sm"
            onClick={onOpenNewPatent}
          >
            <PlusCircle size={16} />
            <span>File New Patent</span>
          </button>

          {/* Interactive Role Switcher Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              id="btn-role-switcher"
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '7px 12px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                color: 'var(--text-main)',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{activeRoleObj.icon}</span>
              <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.1 }}>
                  {activeRoleObj.label}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  {activeRoleObj.id} Active
                </span>
              </div>
              <ChevronDown size={14} color="var(--text-muted)" />
            </button>

            {roleDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '320px',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                padding: '8px',
                zIndex: 200,
                animation: 'slideUp 0.15s ease'
              }}>
                <div style={{
                  padding: '8px 12px 6px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--text-dim)',
                  borderBottom: '1px solid var(--border-subtle)',
                  marginBottom: '6px'
                }}>
                  Simulated Institutional RBAC Roles
                </div>

                {ROLES.map(r => (
                  <button
                    key={r.id}
                    id={`role-option-${r.id.toLowerCase()}`}
                    onClick={() => handleSelectRole(r.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: currentRole === r.id ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                      border: currentRole === r.id ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>{r.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: currentRole === r.id ? '#818cf8' : 'var(--text-main)' }}>
                          {r.label}
                        </span>
                        {currentRole === r.id && (
                          <span style={{ fontSize: '0.65rem', background: '#4f46e5', color: '#fff', padding: '1px 6px', borderRadius: '4px' }}>
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {r.desc}
                      </p>
                    </div>
                  </button>
                ))}

                <div style={{
                  marginTop: '8px',
                  padding: '8px 12px',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.75rem',
                  color: 'var(--text-dim)'
                }}>
                  <Wallet size={14} />
                  <span>Wallet: <span className="mono">{userAddress ? `${userAddress.substring(0, 6)}...${userAddress.substring(38)}` : 'Connecting...'}</span></span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
