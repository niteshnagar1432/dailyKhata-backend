const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/dailyKhata';

// mongoose.connect(MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true,
// });
mongoose.connect(MONGODB_URI);

