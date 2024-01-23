const express = require('express');
const app = express();

require('dotenv/config');

const api = process.env.API_URL;

//api/v1
app.get('/', (req, res) => {
    res.send('Hello API!'); 
});

app.listen(3000, () => {
    console.log(api);
    console.log('Backend server started at (http://localhost:3000/) !');
});