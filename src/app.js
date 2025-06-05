import dotenv from 'dotenv';
import express from 'express';
import connectToDB from './DB/dbConnection.js';

dotenv.config();

const app = express();


connectToDB();

app.get('/', (req, res) => {
  res.send('backend is working!');
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});