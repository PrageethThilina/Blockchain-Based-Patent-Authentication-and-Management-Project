import React, { useState } from 'react';
import { 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  Clock, 
  ArrowRightLeft, 
  Check, 
  X, 
  Eye, 
  CheckCircle, 
  AlertCircle,
  FileCheck2
} from 'lucide-react';

export default function PatentTable({ 
  patents, 
  loading, 
  onSelectPatent, 
  onOpenTransfer, 
  onReviewClaim, 
  currentRole, 
  userAddress,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  jurisdictionFilter,
  setJurisdictionFilter
}) {
  const isExaminer = ['USPTO', 'JPO', 'EPO'].includes(currentRole);
  const isWipo = currentRole === 'WIPO';

  const renderClaimBadge = (officeName, claimObj) => {
    if (!claimObj || !claimObj.requested || claimObj.status === 'None') {
      return (
        <span className="badge badge-none" title={`${officeName}: Not Claimed`}>
          {officeName} —
        </span>
      );
    }
    if (claimObj.status === 'Approved') {
      return (
        <span className="badge badge-active" title={`${officeName}: Approved by Examiner`}>
          <Check size={11} /> {officeName}
        </span>
      );
    }
    if (claimObj.status === 'Pending') {
      return (
        <span className="badge badge-pending" title={`${officeName}: Under Examination`}>
          <Clock size={11} /> {officeName}
        </span>
      );
    }
    return (
      <span className="badge badge-rejected" title={`${officeName}: Rejected`}>
        <X size={11} /> {officeName}
      </span>
    );
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <span className="badge badge-active"><ShieldCheck size={12} /> Granted / Active</span>;
      case 'UnderExamination':
      case 'Submitted':
        return <span className="badge badge-pending"><Clock size={12} /> Under Examination</span>;
      case 'TransferPending':
        return <span className="badge badge-pending" style={{ color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.4)' }}><ArrowRightLeft size={12} /> Transfer Pending WIPO</span>;
      default:
        return <span className="badge badge-none">{status}</span>;
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
      {/* Top Filter Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '20px'
      }}>
        {/* Search Bar */}
        <div style={{ position: 'relative', minWidth: '320px', flex: '1 1 320px' }}>
          <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            id="input-patent-search"
            type="text"
            className="form-control"
            placeholder="Search patents by title, technical field, or SHA-256 hash..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '42px' }}
          />
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(255, 255, 255, 0.04)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            {['ALL', 'Active', 'UnderExamination', 'TransferPending'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st === 'ALL' ? '' : st)}
                style={{
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: (statusFilter === st || (st === 'ALL' && !statusFilter)) ? 'var(--accent-primary)' : 'transparent',
                  color: (statusFilter === st || (st === 'ALL' && !statusFilter)) ? '#fff' : 'var(--text-muted)'
                }}
              >
                {st === 'ALL' ? 'All Status' : st === 'UnderExamination' ? 'Examining' : st === 'TransferPending' ? 'Transfers' : st}
              </button>
            ))}
          </div>

          {/* Jurisdiction Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(255, 255, 255, 0.04)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            {['ALL', 'USPTO', 'JPO', 'EPO'].map(jur => (
              <button
                key={jur}
                onClick={() => setJurisdictionFilter(jur === 'ALL' ? '' : jur)}
                style={{
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: (jurisdictionFilter === jur || (jur === 'ALL' && !jurisdictionFilter)) ? '#0284c7' : 'transparent',
                  color: (jurisdictionFilter === jur || (jur === 'ALL' && !jurisdictionFilter)) ? '#fff' : 'var(--text-muted)'
                }}
              >
                {jur === 'ALL' ? 'All Offices' : jur}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{
              borderBottom: '1px solid var(--border-subtle)',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--text-dim)',
              letterSpacing: '0.04em'
            }}>
              <th style={{ padding: '12px 14px' }}>Patent ID</th>
              <th style={{ padding: '12px 14px' }}>Invention Title & Technical Field</th>
              <th style={{ padding: '12px 14px' }}>Current Owner / Inventor</th>
              <th style={{ padding: '12px 14px' }}>Jurisdiction Claims</th>
              <th style={{ padding: '12px 14px' }}>Lifecycle Status</th>
              <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                  <div className="pulse-dot" style={{ marginRight: '10px' }} /> Loading anchored patent records...
                </td>
              </tr>
            ) : patents.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '56px', color: 'var(--text-muted)' }}>
                  <AlertCircle size={32} style={{ margin: '0 auto 12px', opacity: 0.6 }} />
                  <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>No matching patents found</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Try adjusting your search criteria or register a new patent.</p>
                </td>
              </tr>
            ) : (
              patents.map(p => {
                const isOwner = userAddress && p.currentOwner?.toLowerCase() === userAddress.toLowerCase();
                const canReviewOffice = isExaminer && p.claims[currentRole]?.status === 'Pending';
                const canTransferWipo = (isWipo || currentRole === 'ADMIN') && p.status === 'TransferPending';

                return (
                  <tr
                    key={p.patentId}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {/* ID */}
                    <td style={{ padding: '16px 14px' }}>
                      <span className="mono" style={{
                        fontWeight: 700,
                        color: 'var(--accent-cyan)',
                        fontSize: '0.9rem',
                        background: 'rgba(6, 182, 212, 0.1)',
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(6, 182, 212, 0.2)'
                      }}>
                        #{String(p.patentId).padStart(4, '0')}
                      </span>
                    </td>

                    {/* Title & Field */}
                    <td style={{ padding: '16px 14px', maxWidth: '380px' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '3px' }}>
                        {p.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        {p.technicalField}
                      </div>
                    </td>

                    {/* Owner / Inventor */}
                    <td style={{ padding: '16px 14px' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-main)' }}>
                        {p.inventorDetails?.split(',')[0] || 'Registered Entity'}
                      </div>
                      <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                        {p.currentOwner ? `${p.currentOwner.substring(0, 6)}...${p.currentOwner.substring(38)}` : '0x000...'}
                      </div>
                    </td>

                    {/* Jurisdiction Claims */}
                    <td style={{ padding: '16px 14px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {renderClaimBadge('USPTO', p.claims?.USPTO)}
                        {renderClaimBadge('JPO', p.claims?.JPO)}
                        {renderClaimBadge('EPO', p.claims?.EPO)}
                      </div>
                    </td>

                    {/* Lifecycle Status */}
                    <td style={{ padding: '16px 14px' }}>
                      {renderStatusBadge(p.status)}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '16px 14px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        {/* Inspect Specs */}
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => onSelectPatent(p)}
                          title="View Specifications & Cryptographic Proof"
                        >
                          <Eye size={14} />
                          <span>Inspect</span>
                        </button>

                        {/* Examiner Review Action */}
                        {canReviewOffice && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => onReviewClaim(p, currentRole)}
                            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
                          >
                            <FileCheck2 size={14} />
                            <span>Examine {currentRole}</span>
                          </button>
                        )}

                        {/* WIPO Certify Action */}
                        {canTransferWipo && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => onSelectPatent(p)}
                            style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)' }}
                          >
                            <ArrowRightLeft size={14} />
                            <span>WIPO Review</span>
                          </button>
                        )}

                        {/* Owner Transfer Button */}
                        {p.status === 'Active' && (isOwner || currentRole === 'ADMIN') && (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => onOpenTransfer(p)}
                            title="Initiate Ownership Transfer"
                          >
                            <ArrowRightLeft size={14} />
                            <span>Transfer</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
