import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/config.js';

import authRoutes from './routes/authRoutes.js';
import patentRoutes from './routes/patentRoutes.js';
import verifyRoutes from './routes/verifyRoutes.js';

const app = express();

// Security Headers
app.use(helmet());

// CORS Configuration
app.use(cors({
  origin: config.corsOrigin === '*' ? true : config.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global Rate Limiting (Protection against DoS / Brute-force)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'TOO_MANY_REQUESTS',
    message: 'Rate limit exceeded. Please wait before retrying.'
  }
});
app.use('/api/', apiLimiter);

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/patents', patentRoutes);
app.use('/api/v1/verify', verifyRoutes);

// Health Check
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'PatentRegistry-Enterprise-API-v2',
    version: '2.0.0',
    uptimeSeconds: Math.floor(process.uptime()),
    features: ['EVM-Verification', 'SIWE-Auth', 'RBAC-Enforced', 'IPFS-Anchoring']
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to PatentRegistry Enterprise API',
    documentation: '/api/v1/health',
    endpoints: {
      auth: '/api/v1/auth/login',
      patents: '/api/v1/patents',
      stats: '/api/v1/patents/analytics/stats',
      verify: '/api/v1/verify/:hashOrId'
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'NOT_FOUND',
    message: `Resource '${req.method} ${req.originalUrl}' does not exist on this server.`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.name || 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected error occurred on the server.'
  });
});

// Start Server
const server = app.listen(config.port, () => {
  console.log(`
  ==============================================================
   🏛️  PatentRegistry Enterprise Backend API
  ==============================================================
   🚀 Status:      Running
   🌐 Port:        http://localhost:${config.port}
   🔒 Security:    Helmet, RateLimit, JWT + SIWE, RBAC Active
   📊 Endpoints:   /api/v1/patents | /api/v1/auth | /api/v1/verify
  ==============================================================
  `);
});

export default app;
