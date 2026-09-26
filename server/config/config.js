import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'patent_registry_enterprise_jwt_secret_2026_super_secure',
  jwtExpiresIn: '24h',
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  rpcUrl: process.env.RPC_URL || 'http://127.0.0.1:7545',
  contractAddress: process.env.CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  roles: {
    ADMIN: 'ADMIN',
    INVENTOR: 'INVENTOR',
    USPTO: 'USPTO',
    JPO: 'JPO',
    EPO: 'EPO',
    WIPO: 'WIPO'
  }
};
