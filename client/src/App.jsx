import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import PatentTable from './components/PatentTable';
import PatentDetailModal from './components/PatentDetailModal';
import NewPatentModal from './components/NewPatentModal';
import TransferModal from './components/TransferModal';
import PublicVerifier from './components/PublicVerifier';
import { api } from './services/api';
import { CheckCircle2, AlertCircle, ShieldAlert, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('registry');
  const [currentRole, setCurrentRole] = useState('INVENTOR');
  const [userAddress, setUserAddress] = useState('0x70997970C51812dc3A010C7d01b50e0d17dc79C8');
  
  const [patents, setPatents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [jurisdictionFilter, setJurisdictionFilter] = useState('');

  // Modals
  const [selectedPatent, setSelectedPatent] = useState(null);
  const [transferPatent, setTransferPatent] = useState(null);
  const [isNewPatentOpen, setIsNewPatentOpen] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Initial bootstrap: login as default role & load initial data
  useEffect(() => {
    const init = async () => {
      try {
        const authRes = await api.login(currentRole);
        if (authRes.user?.walletAddress) {
          setUserAddress(authRes.user.walletAddress);
        }
        await refreshData();
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const refreshData = async () => {
    try {
      const [patentsRes, statsRes] = await Promise.all([
        api.fetchPatents({
          search: searchTerm,
          status: statusFilter,
          jurisdiction: jurisdictionFilter
        }),
        api.fetchStats()
      ]);

      if (patentsRes.success) {
        setPatents(patentsRes.patents || []);
      }
      if (statsRes.success) {
        setStats(statsRes.stats || null);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  // Trigger search / filter update
  useEffect(() => {
    refreshData();
  }, [searchTerm, statusFilter, jurisdictionFilter]);

  // Handle Role Switching
  const handleRoleChange = async (newRole) => {
    setCurrentRole(newRole);
    setLoading(true);
    try {
      const authRes = await api.login(newRole);
      if (authRes.user?.walletAddress) {
        setUserAddress(authRes.user.walletAddress);
      }
      showToast(`Switched active context to ${newRole} Authority`, 'info');
      await refreshData();
    } catch (err) {
      showToast(`Role switch failed: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Patent Registration
  const handlePatentCreated = async (formData) => {
    const res = await api.registerPatent(formData);
    showToast(`Patent application #${res.patent.patentId} successfully anchored to blockchain!`, 'success');
    await refreshData();
  };

  // Examiner Review Action
  const handleReviewClaim = async (patentId, office, approved, remarks) => {
    const res = await api.reviewClaim(patentId, office, approved, remarks);
    showToast(`${office} claim ${approved ? 'APPROVED' : 'REJECTED'} for Patent #${patentId}`, approved ? 'success' : 'error');
    await refreshData();
    return res;
  };

  // Transfer Initiation
  const handleTransferInitiated = async (patentId, proposedOwner, proposedOwnerName, legalAgreementHash) => {
    const res = await api.initiateTransfer(patentId, proposedOwner, proposedOwnerName, legalAgreementHash);
    showToast(`Ownership transfer request for Patent #${patentId} submitted to WIPO!`, 'info');
    await refreshData();
    return res;
  };

  // WIPO Finalize Transfer
  const handleFinalizeTransfer = async (patentId, approved, remarks) => {
    const res = await api.finalizeTransfer(patentId, approved, remarks);
    showToast(`WIPO international transfer ${approved ? 'CERTIFIED & FINALIZED' : 'REJECTED'} for Patent #${patentId}`, approved ? 'success' : 'error');
    await refreshData();
    return res;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '14px 20px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: toast.type === 'success' ? '#064e3b' : toast.type === 'error' ? '#881337' : '#1e1b4b',
          color: '#ffffff',
          boxShadow: 'var(--shadow-lg)',
          border: `1px solid ${toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#f43f5e' : '#6366f1'}`,
          animation: 'slideUp 0.25s ease'
        }}>
          {toast.type === 'success' ? <CheckCircle2 size={18} color="#34d399" /> : <AlertCircle size={18} color="#fb7185" />}
          <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{toast.message}</span>
        </div>
      )}

      {/* Modern Sticky Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        onOpenNewPatent={() => setIsNewPatentOpen(true)}
        userAddress={userAddress}
      />

      {/* Main Container */}
      <main style={{ flex: 1, maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '32px 24px' }}>
        {/* Dynamic Views */}
        {activeTab === 'registry' && (
          <div>
            <StatsCards stats={stats} />
            <PatentTable
              patents={patents}
              loading={loading}
              onSelectPatent={(p) => setSelectedPatent(p)}
              onOpenTransfer={(p) => setTransferPatent(p)}
              onReviewClaim={(p, office) => {
                setSelectedPatent(p);
              }}
              currentRole={currentRole}
              userAddress={userAddress}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              jurisdictionFilter={jurisdictionFilter}
              setJurisdictionFilter={setJurisdictionFilter}
            />
          </div>
        )}

        {activeTab === 'examination' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }}>
                Multi-Jurisdiction Examination Desk
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Official examination queue for <strong>{currentRole}</strong> jurisdiction claims. Switch roles above to evaluate USPTO, JPO, or EPO files.
              </p>
            </div>
            <PatentTable
              patents={patents.filter(p => p.claims?.[currentRole]?.status === 'Pending' || p.status === 'UnderExamination')}
              loading={loading}
              onSelectPatent={(p) => setSelectedPatent(p)}
              onOpenTransfer={(p) => setTransferPatent(p)}
              onReviewClaim={(p, office) => setSelectedPatent(p)}
              currentRole={currentRole}
              userAddress={userAddress}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              jurisdictionFilter={currentRole}
              setJurisdictionFilter={() => {}}
            />
          </div>
        )}

        {activeTab === 'transfers' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }}>
                WIPO International Ownership Transfers
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Cross-border patent assignments requiring bilateral verification and World Intellectual Property Organization certification.
              </p>
            </div>
            <PatentTable
              patents={patents.filter(p => p.status === 'TransferPending')}
              loading={loading}
              onSelectPatent={(p) => setSelectedPatent(p)}
              onOpenTransfer={(p) => setTransferPatent(p)}
              onReviewClaim={(p) => setSelectedPatent(p)}
              currentRole={currentRole}
              userAddress={userAddress}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter="TransferPending"
              setStatusFilter={() => {}}
              jurisdictionFilter=""
              setJurisdictionFilter={() => {}}
            />
          </div>
        )}

        {activeTab === 'verifier' && (
          <PublicVerifier />
        )}
      </main>

      {/* Detail Modal */}
      {selectedPatent && (
        <PatentDetailModal
          patent={selectedPatent}
          onClose={() => setSelectedPatent(null)}
          currentRole={currentRole}
          onReviewClaim={handleReviewClaim}
          onFinalizeTransfer={handleFinalizeTransfer}
        />
      )}

      {/* New Patent Filing Modal */}
      <NewPatentModal
        isOpen={isNewPatentOpen}
        onClose={() => setIsNewPatentOpen(false)}
        onPatentCreated={handlePatentCreated}
      />

      {/* Transfer Ownership Modal */}
      {transferPatent && (
        <TransferModal
          patent={transferPatent}
          isOpen={!!transferPatent}
          onClose={() => setTransferPatent(null)}
          onTransferInitiated={handleTransferInitiated}
        />
      )}

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '24px',
        backgroundColor: 'rgba(7, 10, 18, 0.95)',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-dim)'
      }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <strong>PatentRegistry Enterprise</strong> • Decentralized Intellectual Property Protocol
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Solidity 0.8.28</span>
            <span>•</span>
            <span>OpenZeppelin RBAC</span>
            <span>•</span>
            <span>Ethers.js v6</span>
            <span>•</span>
            <span>IPFS Anchored</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
