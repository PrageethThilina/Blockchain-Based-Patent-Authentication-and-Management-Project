const API_BASE = '/api/v1';

class ApiService {
  getToken() {
    return localStorage.getItem('patent_registry_jwt');
  }

  setToken(token) {
    if (token) {
      localStorage.setItem('patent_registry_jwt', token);
    } else {
      localStorage.removeItem('patent_registry_jwt');
    }
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `API error ${response.status}`);
    }
    return data;
  }

  // --- Auth ---
  async login(role, customAddress) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ role, customAddress })
    });
    if (res.token) {
      this.setToken(res.token);
    }
    return res;
  }

  async getChallenge(walletAddress) {
    return this.request('/auth/challenge', {
      method: 'POST',
      body: JSON.stringify({ walletAddress })
    });
  }

  async verifySignature(walletAddress, signature, role) {
    const res = await this.request('/auth/verify-signature', {
      method: 'POST',
      body: JSON.stringify({ walletAddress, signature, role })
    });
    if (res.token) {
      this.setToken(res.token);
    }
    return res;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  logout() {
    this.setToken(null);
  }

  // --- Patents ---
  async fetchPatents(params = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        searchParams.append(k, v);
      }
    });
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.request(`/patents${qs}`);
  }

  async fetchPatentById(id) {
    return this.request(`/patents/${id}`);
  }

  async registerPatent(payload) {
    return this.request('/patents', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async reviewClaim(id, office, approved, remarks) {
    return this.request(`/patents/${id}/claims/${office}`, {
      method: 'PATCH',
      body: JSON.stringify({ approved, remarks })
    });
  }

  async initiateTransfer(id, proposedOwner, proposedOwnerName, legalAgreementHash) {
    return this.request(`/patents/${id}/transfer`, {
      method: 'POST',
      body: JSON.stringify({ proposedOwner, proposedOwnerName, legalAgreementHash })
    });
  }

  async finalizeTransfer(id, approved, remarks) {
    return this.request(`/patents/${id}/transfer/wipo`, {
      method: 'PATCH',
      body: JSON.stringify({ approved, remarks })
    });
  }

  async fetchStats() {
    return this.request('/patents/analytics/stats');
  }

  // --- Public Verifier ---
  async verifyPublic(query) {
    return this.request(`/verify/${encodeURIComponent(query)}`);
  }

  async verifyPayload(payload) {
    return this.request('/verify/payload', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
}

export const api = new ApiService();
