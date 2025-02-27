
const express = require('express');
const fs = require('fs-extra');
const router = express.Router();
const cartsFilePath = './carrito.json';

router.post('/', async (req, res) => {
  try {
    const carts = await fs.readJson(cartsFilePath);
    const id = Date.now().toString();
    const newCart = { id, products: [] };
    carts.push(newCart);
    await fs.writeJson(cartsFilePath, carts);
    res.status(201).json(newCart);
  } catch (error) {
    console.error('Error al crear el carrito:', error);
    res.status(500).send('Error al crear el carrito');
  }
});

router.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  try {
    const carts = await fs.readJson(cartsFilePath);
    const cart = carts.find(c => c.id === cid);
    if (cart) {
      res.json(cart.products);
    } else {
      res.status(404).send('Carrito no encontrado');
    }
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).send('Error al obtener el carrito');
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const carts = await fs.readJson(cartsFilePath);
    const cart = carts.find(c => c.id === cid);
    if (!cart) {
      return res.status(404).send('Carrito no encontrado');
    }

    const product = cart.products.find(p => p.product === pid);
    if (product) {
      product.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await fs.writeJson(cartsFilePath, carts);
    res.status(201).json(cart.products);
  } catch (error) {
    console.error('Error al agregar el producto al carrito:', error);
    res.status(500).send('Error al agregar el producto al carrito');
  }
});

module.exports = router;

