const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT;

const MONGO_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('DB connection error:', error.message);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(PORT || 3000, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
