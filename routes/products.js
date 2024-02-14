const express = require('express');
const fs = require('fs');
const router = express.Router();
const productosFilePath = './data/productos.json';

router.get('/', (req, res) => {
  fs.readFile(productosFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    const productos = JSON.parse(data);
    res.json(productos);
  });
});

router.get('/:pid', (req, res) => {
  const pid = parseInt(req.params.pid); // Convertir el ID a número (1)
  if (isNaN(pid)) {
    res.status(400).json({ error: 'ID de producto no válido' });
    return;
  }

  fs.readFile(productosFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    const productos = JSON.parse(data);
    const producto = productos.find(p => p.id === pid);
    if (!producto) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }
    res.json(producto);
  });
});

router.post('/', (req, res) => {
  const nuevoProducto = req.body;
  // Validar el tipo de datos y la presencia de los campos requeridos
  if (typeof nuevoProducto.title !== 'string' || typeof nuevoProducto.description !== 'string' || typeof nuevoProducto.code !== 'string' || typeof nuevoProducto.price !== 'number' || typeof nuevoProducto.stock !== 'number' || typeof nuevoProducto.category !== 'string') {
    res.status(400).json({ error: 'Los campos del producto son inválidos o faltan' });
    return;
  }
  fs.readFile(productosFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    const productos = JSON.parse(data);
    const id = productos.length > 0 ? productos[productos.length - 1].id + 1 : 1;
    const productoConId = { id, ...nuevoProducto };
    productos.push(productoConId);
    fs.writeFile(productosFilePath, JSON.stringify(productos, null, 2), (err) => {
      if (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
        return;
      }
      res.status(201).json(productoConId);
    });
  });
});

router.put('/:pid', (req, res) => {
  const pid = parseInt(req.params.pid); // Convertir el ID a número (2)
  if (isNaN(pid)) {
    res.status(400).json({ error: 'ID de producto no válido' });
    return;
  }

  const productoActualizado = req.body;
  fs.readFile(productosFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    let productos = JSON.parse(data);
    const indice = productos.findIndex(p => p.id === pid);
    if (indice === -1) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }
    const producto = productos[indice];
    const productoActualizadoConId = { ...producto, ...productoActualizado, id: pid };
    productos[indice] = productoActualizadoConId;
    fs.writeFile(productosFilePath, JSON.stringify(productos, null, 2), (err) => {
      if (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
        return;
      }
      res.json(productoActualizadoConId);
    });
  });
});

router.delete('/:pid', (req, res) => {
  const pid = parseInt(req.params.pid); // Convertir el ID a número (3)
  if (isNaN(pid)) {
    res.status(400).json({ error: 'ID de producto no válido' });
    return;
  }

  fs.readFile(productosFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    let productos = JSON.parse(data);
    const indice = productos.findIndex(p => p.id === pid);
    if (indice === -1) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }
    const productoEliminado = productos.splice(indice, 1)[0];
    fs.writeFile(productosFilePath, JSON.stringify(productos, null, 2), (err) => {
      if (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
        return;
      }
      res.json(productoEliminado);
    });
  });
});

module.exports = router;
