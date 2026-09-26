import React, { useState } from 'react';
import { X, ArrowRightLeft, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function TransferModal({ patent, isOpen, onClose, onTransferInitiated }) {
  const [proposedOwner, setProposedOwner] = useState('0xB444f386DaE8baC4Cdc508385331214F5aBC8d31');
  const [proposedOwnerName, setProposedOwnerName] = useState('Global Tech Ventures Intellectual Property Corp');
  const [legalHash, setLegalHash] = useState('0x9a8421c0b7849abd3c0b73643E8Fd4f103D9fd5718a20984cde');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !patent) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proposedOwner) {
      setError('Recipient wallet address is required.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await onTransferInitiated(patent.patentId, proposedOwner, proposedOwnerName, legalHash);
      onClose();
    } catch (err) {
      setError(err.message || 'Transfer initiation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '16px',
          marginBottom: '20px'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowRightLeft size={16} /> International Patent Deed of Assignment
            </span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>
              Initiate Patent Ownership Transfer
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Patent Summary Banner */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 18px',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            PATENT #{String(patent.patentId).padStart(4, '0')}
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
            {patent.title}
          </div>
          <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Current Registered Owner: {patent.currentOwner}
          </div>
        </div>

        {/* WIPO Protocol Notice */}
        <div style={{
          backgroundColor: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          color: '#fbbf24',
          fontSize: '0.82rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          marginBottom: '20px',
          lineHeight: 1.5
        }}>
          <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>
            Under the decentralized WIPO Patent Cooperation Treaty (PCT) framework, initiating this transfer will place the patent in <strong>TransferPending</strong> status. The assignee ownership will only execute on-chain once certified by a designated WIPO Officer.
          </span>
        </div>

        {error && (
          <div style={{ color: '#fb7185', fontSize: '0.85rem', marginBottom: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Proposed Recipient / Assignee Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Acme Quantum Innovations Ltd."
              value={proposedOwnerName}
              onChange={(e) => setProposedOwnerName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Recipient Ethereum Wallet Address (0x...) *</label>
            <input
              type="text"
              className="form-control mono"
              placeholder="0x..."
              value={proposedOwner}
              onChange={(e) => setProposedOwner(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Digital Bill of Sale / Legal Notarization Hash</label>
            <input
              type="text"
              className="form-control mono"
              value={legalHash}
              onChange={(e) => setLegalHash(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <CheckCircle2 size={16} />
              <span>{submitting ? 'Submitting to WIPO...' : 'Submit Transfer Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
