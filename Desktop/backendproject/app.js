const express = require('express');
const app = express();
const userRoutes = require('./routes/user.routes');
const cookieParser = require('cookie-parser');
require('dotenv').config();

app.use(express.json());
app.use(cookieParser());
app.use('/api/users', userRoutes);

module.exports = app;
