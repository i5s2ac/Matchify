const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Rutas (puedes definir las rutas más adelante)
app.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
