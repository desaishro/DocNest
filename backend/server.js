const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config();

connectDB();

const app = express();


app.use(express.json());
app.use(cors());

// Add a logging middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
app.use('/users', userRoutes);

const criteriaRoutes = require('./routes/criteriaRoutes');
app.use('/api/criteria', criteriaRoutes);
app.use('/criteria', criteriaRoutes);

const documentRoutes = require('./routes/documentRoutes');
app.use('/api/documents', documentRoutes);
app.use('/documents', documentRoutes);

const submissionRoutes = require('./routes/submissionRoutes');
app.use('/api/submissions', submissionRoutes);
app.use('/submissions', submissionRoutes);

const PORT = process.env.PORT || 5000;

// Error handling middleware
app.use((err, req, res, next) => {
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  console.error('[ERROR]', err.message);
  if (err.stack) console.error(err.stack);
  res.status(status).json({ message: err.message || 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

