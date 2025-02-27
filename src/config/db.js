const fs = require('fs-extra');
const path = require('path');

const cartsPath = path.join(__dirname, '../../carrito.json');
const productsPath = path.join(__dirname, '../../productos.json');

const db = {
    async init() {
        await fs.ensureFile(cartsPath);
        await fs.ensureFile(productsPath);
        if (!(await fs.readJson(cartsPath).catch(() => false))) {
            await fs.writeJson(cartsPath, []);
        }
        if (!(await fs.readJson(productsPath).catch(() => false))) {
            await fs.writeJson(productsPath, []);
        }
    },
    async read(file) {
        return await fs.readJson(file === 'carts' ? cartsPath : productsPath);
    },
    async write(file, data) {
        await fs.writeJson(file === 'carts' ? cartsPath : productsPath, data, { spaces: 2 });
    }
};

module.exports = db;