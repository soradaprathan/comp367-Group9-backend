const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv/config');
const api = process.env.API_URL;

//CORS
app.use(cors());
app.options('*', cors());

//Routing
const categoriesRouter = require('./routes/categories');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const usersRouter = require('./routes/users');

//Middleware
app.use(express.json());
app.use(morgan('tiny'));

//Routers
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/products`, productsRouter);
app.use(`${api}/orders`, ordersRouter);
app.use(`${api}/users`, usersRouter);

mongoose.connect(process.env.CONNECTION_STRING, {
    dbName: 'toyshub-database'
})
.then(() => {
    console.log('Database connection ready!')
})
.catch((err) => {
    console.log(err)
})

app.listen(3000, () => {
    console.log(api);
    console.log('Backend server started at (http://localhost:3000/)!');
});