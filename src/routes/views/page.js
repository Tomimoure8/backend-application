const express = require('express');
const db = require('../../config/db');
const router = express.Router();

router.get('/', async (req, res) => {
    const products = await db.read('products');
    res.render('shop', { products });
});

router.get('/live', async (req, res) => {
    const products = await db.read('products');
    res.render('liveProducts', { products });
});

module.exports = router;