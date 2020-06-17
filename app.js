const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { mongoose } = require('./db/mongoose');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const cartRoute = require('./routes/cart');
const addressRoute = require('./routes/address');
const wishlistRoute = require('./routes/wishlist');
const purchaseRoute = require('./routes/purchase');
const productRoute = require('./routes/product');
const paymentRoute = require('./routes/payment');

const app = express();

app.use(bodyParser.json());

app.use(cors({
    'allowedHeaders': ['sessionId', 'Content-Type', 'x-auth', 'Authorization'],
    'exposedHeaders': ['sessionId', 'x-auth', 'Authorization'],
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    'preflightContinue': false
}));

app.use(authRoute);
app.use(userRoute);
app.use(cartRoute);
app.use(addressRoute);
app.use(wishlistRoute);
app.use(purchaseRoute);
app.use(productRoute);
app.use(paymentRoute);

app.listen(process.env.PORT || 3000);