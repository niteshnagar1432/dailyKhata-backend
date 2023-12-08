const mongoose = require('mongoose');

// const MONGODB_URI = `${process.env.MONGO_DB}dailyKhata`;

mongoose.connect(process.env.MONGO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.connect(MONGODB_URI);

