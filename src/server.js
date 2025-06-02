// Load environment variables from .env
require('dotenv').config();

// Required modules
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require("swagger-ui-express");
const path = require("path");

// Create express app
const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Optional: Rate limiting (uncomment if needed)
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100
// });
// app.use(limiter);

// Sample route
app.get('/hello', (req, res) => {
  res.send("hello");
});

// Routes
const AreaRoutes = require('./routes/AreaRoutes');
const AuthRoutes = require('./routes/AuthRoutes');
const GenderRoutes = require('./routes/GenderRoutes');

app.use('/api/area', AreaRoutes);
app.use('/api/auth', AuthRoutes);
app.use('/api/gender', GenderRoutes);

// Swagger Setup
const swaggerFilePath = path.join(__dirname, "./swagger-output.json");
const swaggerFile = require(swaggerFilePath);
app.use("/app", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Port & Host setup
const PORT = process.env.PORT || 5000;
// const HOST = process.env.HOST || 'localhost'; // Optional: set in .env
const HOST = '192.168.1.35';  
// const HOST = '192.168.130.119';  



app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://localhost:${PORT} or http://${HOST}:${PORT}`);
});
// Start server (✅ only one listen)
// app.listen(PORT, HOST, () => {
//   console.log(`🚀 Server is running at http://${HOST}:${PORT}`);
// });

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
