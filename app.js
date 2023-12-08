require('dotenv').config({ path: './.env' });
const express = require('express');
const bodyParser = require('body-parser'); // Import body-parser
const app = express();
const indexRoutes = require('./routes/indexRoute');
const connectionRoute = require('./routes/connectionRoute');
const chatRoute = require('./routes/chatRoute');
const payment = require('./routes/paymentRoute');

// Database
require('./models/config');

// Logger
app.use(require('morgan')('tiny'));

// Body-parser middleware for JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', indexRoutes);
app.use('/connection',connectionRoute);
app.use('/chat',chatRoute);
app.use('/payment',payment);

app.listen(process.env.PORT, () =>
  console.log(`App listening on http://localhost:${process.env.PORT}`)
);
