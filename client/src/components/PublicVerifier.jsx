import React, { useState } from 'react';
import { Search, ShieldCheck, CheckCircle2, XCircle, FileBadge, Lock, ArrowRight, ExternalLink } from 'lucide-react';
import { api } from '../services/api';

export default function PublicVerifier() {
  const [query, setQuery] = useState('1');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await api.verifyPublic(query.trim());
      setResult(res.certificate);
    } catch (err) {
      setError(err.message || 'Verification failed. No matching cryptographic anchor found.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', padding: '16px 0 48px' }}>
      {/* Intro Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          padding: '6px 16px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.8rem',
          color: '#818cf8',
          fontWeight: 600,
          marginBottom: '16px'
        }}>
          <Lock size={14} />
          <span>Zero-Knowledge Proofs & EVM Merkle Proof Engine</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.03em' }}>
          Public Patent Authenticity Verifier
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '620px', margin: '0 auto', lineHeight: 1.6 }}>
          Instantly verify the legal authenticity, ownership provenance, and multi-jurisdiction patent examination status directly against immutable Ethereum state.
        </p>
      </div>

      {/* Query Search Card */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px' }}>
        <form onSubmit={handleVerify}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1 1 360px' }}>
              <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                id="input-public-verifier-query"
                type="text"
                className="form-control"
                placeholder="Enter Patent ID (e.g. 1) or full SHA-256 Hash (0x8f3c...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ paddingLeft: '44px', height: '48px', fontSize: '0.95rem' }}
              />
            </div>
            <button
              id="btn-verify-authenticity"
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ height: '48px', padding: '0 24px' }}
            >
              <ShieldCheck size={18} />
              <span>{loading ? 'Verifying Proof...' : 'Verify Authenticity'}</span>
            </button>
          </div>
        </form>

        <div style={{ marginTop: '14px', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
          <span>Try quick queries:</span>
          <button
            onClick={() => setQuery('1')}
            style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Patent #0001 (ZK-Rollup)
          </button>
          <span>•</span>
          <button
            onClick={() => setQuery('2')}
            style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Patent #0002 (Microgrid)
          </button>
          <span>•</span>
          <button
            onClick={() => setQuery('3')}
            style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Patent #0003 (DNA Watermarking)
          </button>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="glass-panel" style={{
          padding: '24px',
          borderColor: 'rgba(244, 63, 94, 0.4)',
          backgroundColor: 'rgba(244, 63, 94, 0.08)',
          textAlign: 'center',
          animation: 'fadeIn 0.2s ease'
        }}>
          <XCircle size={36} color="#fb7185" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.15rem', color: '#fb7185', marginBottom: '6px' }}>
            Unverified / Counterfeit Record
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto' }}>
            {error}
          </p>
        </div>
      )}

      {/* Verified Certificate Showcase */}
      {result && (
        <div
          id="certificate-of-authenticity"
          className="glass-panel"
          style={{
            padding: '36px',
            border: '2px solid rgba(16, 185, 129, 0.5)',
            boxShadow: '0 0 35px rgba(16, 185, 129, 0.2)',
            position: 'relative',
            overflow: 'hidden',
            animation: 'slideUp 0.3s ease'
          }}
        >
          {/* Certificate Watermark Seal */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34d399',
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            fontWeight: 700,
            fontSize: '0.78rem',
            letterSpacing: '0.04em'
          }}>
            <CheckCircle2 size={16} />
            <span>CRYPTOGRAPHICALLY VERIFIED</span>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileBadge size={16} /> Official Certificate of Intellectual Property Authenticity
            </span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '6px', color: 'var(--text-main)', maxWidth: '80%' }}>
              {result.title}
            </h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              Anchored on Ethereum EVM • Patent Reference ID: <strong>#{String(result.patentId).padStart(4, '0')}</strong>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '18px',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            marginBottom: '24px'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Registered Inventor</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
                {result.inventorDetails}
              </div>
              <div className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {result.originalInventor}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Current Legal Assignee / Owner</div>
              <div className="mono" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-cyan)', marginTop: '2px' }}>
                {result.currentOwner}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Certified under WIPO international treaty
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Filing & Priority Date</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
                {result.registeredDate}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Statutory Term Expiration</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
                {result.expirationDate}
              </div>
            </div>
          </div>

          {/* Jurisdictional Approvals Row */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '10px' }}>
              Jurisdictional Grant Verification:
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {Object.entries(result.jurisdictionApprovals).map(([office, st]) => (
                <div key={office} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(13, 18, 31, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 14px'
                }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{office}:</span>
                  <span className={`badge ${st === 'Approved' ? 'badge-active' : st === 'Pending' ? 'badge-pending' : 'badge-none'}`}>
                    {st}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Cryptographic Footprint */}
          <div style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Deterministic SHA-256 Merkle Leaf Hash:
            </div>
            <div className="mono" style={{ fontSize: '0.8rem', color: '#a5b4fc', wordBreak: 'break-all' }}>
              {result.metadataHash}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <span>IPFS CID: <span className="mono" style={{ color: 'var(--accent-cyan)' }}>{result.ipfsMetadataURI}</span></span>
              <span>Verification Timestamp: {result.verifiedAt}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
