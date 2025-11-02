const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Servir todos os arquivos da raiz e subpastas
app.use(express.static(__dirname));
app.use(bodyParser.json());

// Caminho do arquivo JSON
const usersFile = path.join(__dirname, 'data/users.json');

// Endpoint para registrar usuário
app.post('/register', (req, res) => {
  const { username, descriptor } = req.body;
  let users = [];
  if (fs.existsSync(usersFile)) {
    try {
      users = JSON.parse(fs.readFileSync(usersFile));
    } catch {
      users = [];
    }
  }
  users.push({ username, descriptors: [descriptor] });
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  res.send({ success: true });
});

// Endpoint para obter usuários
app.get('/users', (req, res) => {
  let users = [];
  if (fs.existsSync(usersFile)) {
    try {
      users = JSON.parse(fs.readFileSync(usersFile));
    } catch {
      users = [];
    }
  }
  res.json(users);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
