const express = require('express');
const fs = require('fs');
const router = express.Router();
const carritoFilePath = './data/carrito.json';

router.post('/', (req, res) => {
  fs.readFile(carritoFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    const carritos = JSON.parse(data);
    const id = Math.floor(Math.random() * 1000) + 1; // Genera un id aleatorio
    const nuevoCarrito = { id, products: [] };
    carritos.push(nuevoCarrito);
    fs.writeFile(carritoFilePath, JSON.stringify(carritos, null, 2), (err) => {
      if (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
        return;
      }
      res.status(201).json(nuevoCarrito);
    });
  });
});

router.get('/:cid', (req, res) => {
  const cid = req.params.cid;
  fs.readFile(carritoFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    const carritos = JSON.parse(data);
    const carrito = carritos.find(c => c.id == cid);
    if (!carrito) {
      res.status(404).json({ error: 'Carrito no encontrado' });
      return;
    }
    res.json(carrito);
  });
});

router.post('/:cid/product/:pid', (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  fs.readFile(carritoFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    const carritos = JSON.parse(data);
    const carrito = carritos.find(c => c.id == cid);
    if (!carrito) {
      res.status(404).json({ error: 'Carrito no encontrado' });
      return;
    }
    const product = { id: pid };
    const existingProduct = carrito.products.find(p => p.id === pid);
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      product.quantity = 1;
      carrito.products.push(product);
    }
    fs.writeFile(carritoFilePath, JSON.stringify(carritos, null, 2), (err) => {
      if (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
        return;
      }
      res.status(201).json(carrito);
    });
  });
});

module.exports = router;
