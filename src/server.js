const express = require('express');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const path = require('path');
const db = require('./src/config/db');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const app = express();
const PORT = 8080;
const API_PRODUCTS = '/api/products';
const API_CARTS = '/api/carts';

const server = app.listen(PORT, () => {
  console.log(`Servidor de e-commerce escuchando en el puerto ${PORT}`);
  db.init().then(() => console.log('Base de datos inicializada'));
});
const io = new Server(server);

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src/views'));

app.use(express.json());
app.use(API_PRODUCTS, productsRouter);
app.use(API_CARTS, cartsRouter);

app.get('/', async (req, res) => {
  const products = await db.read('products');
  res.render('shop', { products });
});

io.on('connection', (socket) => {
  console.log('Cliente conectado');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

module.exports = { io };


