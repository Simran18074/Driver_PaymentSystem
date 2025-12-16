const express = require('express');
const cors = require('cors');
const driverRoutes = require('./routes/driverRoutes');
const tripRoutes = require('./routes/tripRoutes');
const settlementRoutes = require('./routes/settlementRoute');
const historyRoutes = require('./routes/historyRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/drivers', driverRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/settlements', settlementRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
    res.send('Driver Payment System API is running');
});

module.exports = app;
