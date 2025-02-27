const express = require('express');
const db = require('./src/config/db');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const app = express();
const PORT = 8080;
const API_PRODUCTS = '/api/products';
const API_CARTS = '/api/carts';

app.use(express.json());
app.use(API_PRODUCTS, productsRouter);
app.use(API_CARTS, cartsRouter);

app.get('/', (req, res) => {
  res.send('Servidor de e-commerce en funcionamiento');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

app.listen(PORT, () => {
  console.log(`Servidor de e-commerce escuchando en el puerto ${PORT}`);
  db.init().then(() => console.log('Base de datos inicializada'));
});
