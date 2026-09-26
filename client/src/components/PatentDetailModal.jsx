import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  ExternalLink, 
  Copy, 
  Check, 
  Clock, 
  ArrowRightLeft, 
  FileText, 
  CheckCircle2, 
  XCircle,
  FileBadge2
} from 'lucide-react';

export default function PatentDetailModal({ 
  patent, 
  onClose, 
  currentRole, 
  onReviewClaim, 
  onFinalizeTransfer 
}) {
  const [copiedHash, setCopiedHash] = useState(false);
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!patent) return null;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleExaminerDecision = async (approved) => {
    setSubmitting(true);
    try {
      await onReviewClaim(patent.patentId, currentRole, approved, reviewRemarks);
      onClose();
    } catch (err) {
      alert(`Examination error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleWipoDecision = async (approved) => {
    setSubmitting(true);
    try {
      await onFinalizeTransfer(patent.patentId, approved, reviewRemarks);
      onClose();
    } catch (err) {
      alert(`WIPO Transfer certification error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const isExaminer = ['USPTO', 'JPO', 'EPO'].includes(currentRole);
  const canExamineCurrentOffice = isExaminer && patent.claims[currentRole]?.status === 'Pending';
  const isWipo = currentRole === 'WIPO' || currentRole === 'ADMIN';
  const hasPendingTransfer = patent.status === 'TransferPending' && patent.transferRequest;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '16px',
          marginBottom: '20px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="mono" style={{
                color: 'var(--accent-cyan)',
                fontSize: '0.85rem',
                fontWeight: 700,
                background: 'rgba(6, 182, 212, 0.12)',
                padding: '2px 8px',
                borderRadius: '4px'
              }}>
                PATENT #{String(patent.patentId).padStart(4, '0')}
              </span>
              <span className="badge badge-active" style={{ fontSize: '0.7rem' }}>
                {patent.status}
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, lineHeight: 1.3 }}>
              {patent.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Cryptographic Anchor Bar */}
        <div style={{
          backgroundColor: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 18px',
          marginBottom: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} /> Cryptographic Proof & Integrity Anchor
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              Registered: {patent.registeredDate}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>SHA-256 Specification Hash:</div>
              <div className="mono" style={{ fontSize: '0.78rem', color: '#a5b4fc', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {patent.metadataHash}
              </div>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => copyToClipboard(patent.metadataHash)}
            >
              {copiedHash ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copiedHash ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>IPFS Storage CID: <span className="mono" style={{ color: 'var(--accent-cyan)' }}>{patent.ipfsMetadataURI}</span></span>
            {patent.expirationDate && <span>Term Expiration: <strong style={{ color: 'var(--text-main)' }}>{patent.expirationDate}</strong></span>}
          </div>
        </div>

        {/* Specification Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '24px' }}>
          <div>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '4px' }}>
              Technical Field
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              {patent.technicalField}
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '4px' }}>
              Technical Problem Identified
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', lineHeight: 1.6 }}>
              {patent.technicalProblem}
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '4px' }}>
              Technical Solution & Architecture
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', lineHeight: 1.6 }}>
              {patent.technicalSolution}
            </p>
          </div>

          {patent.description && (
            <div>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '4px' }}>
                Detailed Description & Claims
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', lineHeight: 1.6 }}>
                {patent.description}
              </p>
            </div>
          )}
        </div>

        {/* Multi-Jurisdiction Claims Matrix */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '10px' }}>
            Multi-Jurisdiction Examination Matrix
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {['USPTO', 'JPO', 'EPO'].map(office => {
              const claim = patent.claims?.[office];
              const isReq = claim && claim.requested;
              return (
                <div
                  key={office}
                  style={{
                    backgroundColor: 'rgba(13, 18, 31, 0.9)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{office}</span>
                    <span className={`badge ${!isReq ? 'badge-none' : claim.status === 'Approved' ? 'badge-active' : claim.status === 'Pending' ? 'badge-pending' : 'badge-rejected'}`}>
                      {!isReq ? 'Not Filed' : claim.status}
                    </span>
                  </div>
                  {isReq && claim.remarks && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      "{claim.remarks}"
                    </div>
                  )}
                  {isReq && claim.officer && (
                    <div className="mono" style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                      Officer: {claim.officer.substring(0, 6)}...{claim.officer.substring(38)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending Transfer Details (If applicable) */}
        {hasPendingTransfer && (
          <div style={{
            backgroundColor: 'rgba(2, 132, 199, 0.1)',
            border: '1px solid rgba(2, 132, 199, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <h4 style={{ fontSize: '0.9rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <ArrowRightLeft size={16} /> Pending International Ownership Transfer (WIPO)
            </h4>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '4px' }}>
              Proposed Recipient: <strong>{patent.transferRequest.proposedOwnerName}</strong>
            </div>
            <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '8px' }}>
              Recipient Address: {patent.transferRequest.proposedOwner}
            </div>
            <div className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              Legal Notarization Hash: {patent.transferRequest.legalAgreementHash}
            </div>
          </div>
        )}

        {/* Examiner Decision Action Box */}
        {canExamineCurrentOffice && (
          <div style={{
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '18px',
            marginBottom: '20px'
          }}>
            <h4 style={{ fontSize: '0.9rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <FileBadge2 size={18} /> Official Jurisdiction Action: {currentRole} Examination
            </h4>
            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label className="form-label">Examination Remarks / Novelty Assessment</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Substantive novelty criteria satisfied under jurisdictional statutory laws."
                value={reviewRemarks}
                onChange={(e) => setReviewRemarks(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn btn-success"
                onClick={() => handleExaminerDecision(true)}
                disabled={submitting}
              >
                <CheckCircle2 size={16} />
                <span>Grant & Approve {currentRole} Claim</span>
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleExaminerDecision(false)}
                disabled={submitting}
              >
                <XCircle size={16} />
                <span>Issue Rejection Notice</span>
              </button>
            </div>
          </div>
        )}

        {/* WIPO Decision Action Box */}
        {isWipo && hasPendingTransfer && (
          <div style={{
            backgroundColor: 'rgba(2, 132, 199, 0.12)',
            border: '1px solid rgba(2, 132, 199, 0.4)',
            borderRadius: 'var(--radius-md)',
            padding: '18px',
            marginBottom: '20px'
          }}>
            <h4 style={{ fontSize: '0.9rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <ArrowRightLeft size={18} /> WIPO Official Certification & Finalization
            </h4>
            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label className="form-label">WIPO Certification Docket Remarks</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Verified international bilateral deed of assignment."
                value={reviewRemarks}
                onChange={(e) => setReviewRemarks(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn btn-success"
                onClick={() => handleWipoDecision(true)}
                disabled={submitting}
              >
                <CheckCircle2 size={16} />
                <span>Finalize & Certify Ownership Transfer</span>
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleWipoDecision(false)}
                disabled={submitting}
              >
                <XCircle size={16} />
                <span>Reject Transfer Application</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
