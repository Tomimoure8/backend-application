const express = require('express');
const db = require('../config/db');
const router = express.Router();

router.get('/', async (req, res) => {
  const { limit } = req.query;
  try {
    const products = await db.read('products');
    const limitedProducts = limit ? products.slice(0, parseInt(limit)) : products;
    res.json(limitedProducts);
  } catch (error) {
    console.error('Error al leer el archivo de productos:', error);
    res.status(500).send('Error al obtener los productos');
  }
});

router.get('/:pid', async (req, res) => {
  const { pid } = req.params;
  try {
    const products = await db.read('products');
    const product = products.find(p => p.id === pid);
    if (product) {
      res.json(product);
    } else {
      res.status(404).send('Producto no encontrado');
    }
  } catch (error) {
    console.error('Error al leer el archivo de productos:', error);
    res.status(500).send('Error al obtener el producto');
  }
});

router.post('/', async (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } = req.body;
  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).send('Todos los campos son obligatorios');
  }

  try {
    const products = await db.read('products');
    const id = Date.now().toString();
    const newProduct = {
      id,
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails: thumbnails || []
    };
    products.push(newProduct);
    await db.write('products', products);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al escribir en el archivo de productos:', error);
    res.status(500).send('Error al agregar el producto');
  }
});

router.put('/:pid', async (req, res) => {
  const { pid } = req.params;
  const { title, description, code, price, stock, category, thumbnails } = req.body;

  if (!title && !description && !code && !price && !stock && !category && !thumbnails) {
    return res.status(400).send('No se han proporcionado campos para actualizar');
  }

  try {
    const products = await db.read('products');
    const productIndex = products.findIndex(p => p.id === pid);
    if (productIndex === -1) {
      return res.status(404).send('Producto no encontrado');
    }

    const updatedProduct = {
      ...products[productIndex],
      title: title || products[productIndex].title,
      description: description || products[productIndex].description,
      code: code || products[productIndex].code,
      price: price || products[productIndex].price,
      stock: stock || products[productIndex].stock,
      category: category || products[productIndex].category,
      thumbnails: thumbnails || products[productIndex].thumbnails,
    };

    products[productIndex] = updatedProduct;
    await db.write('products', products);
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).send('Error al actualizar el producto');
  }
});

router.delete('/:pid', async (req, res) => {
  const { pid } = req.params;

  try {
    let products = await db.read('products');
    const productExists = products.some(p => p.id === pid);
    if (!productExists) {
      return res.status(404).send('Producto no encontrado');
    }
    products = products.filter(p => p.id !== pid);
    await db.write('products', products);
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).send('Error al eliminar el producto');
  }
});

module.exports = router;

