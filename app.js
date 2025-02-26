const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Servidor de e-commerce funcionando');
});

app.listen(8080, () => console.log('Server running on port 8080'));