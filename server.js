const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.static(__dirname));
app.use(bodyParser.json());

const usersFile = path.join(__dirname, 'data/users.json');

app.post('/register', (req, res) => {
  const { username, descriptor } = req.body;
  let users = [];
  if (fs.existsSync(usersFile)) users = JSON.parse(fs.readFileSync(usersFile));

  users.push({ username, descriptors: [descriptor] });
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

  res.send({ success: true });
});

app.get('/users', (req, res) => {
  let users = [];
  if (fs.existsSync(usersFile)) users = JSON.parse(fs.readFileSync(usersFile));
  res.send(users);
});

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
