const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const dotenv = require("dotenv");


app.use(express.json());

const pool = new Pool({
  user: 'banco_marca_produto_user',
  host: 'dpg-cikttmdgkuvinflaehlg-a.oregon-postgres.render.com',
  database: 'banco_marca_produto',
  password: 'DjO0CiKGYypa0TMvARC9QgfccwSAH8Qa',
  port: 5432,
  ssl: true 
});

app.post('/marcas', (req, res) => {
  const { novaMarca } = req.body;
  pool.query('INSERT INTO marcas (nome) VALUES ($1)', [novaMarca], (err, result) => {
    if (err) {
      console.error('Erro ao inserir marca:', err);
      res.sendStatus(500);
    } else {
      res.sendStatus(201);
    }
  });
});

app.post('/produtos', (req, res) => {
  const { marcaSelecionada, novaDescricao, novoValor } = req.body;
  pool.query(
    'INSERT INTO produtos (marca, descricao, valor) VALUES ($1, $2, $3)',
    [marcaSelecionada, novaDescricao, novoValor],
    (err, result) => {
      if (err) {
        console.error('Erro ao inserir produto:', err);
        res.sendStatus(500);
      } else {
        res.sendStatus(201);
      }
    }
  );
});

app.get('/produtos', (req, res) => {
  pool.query('SELECT * FROM produtos', (err, result) => {
    if (err) {
      console.error('Erro ao obter produtos:', err);
      res.sendStatus(500);
    } else {
      const produtos = result.rows;
      res.json(produtos);
    }
  });
});

app.put('/produtos/:index', (req, res) => {
  const index = req.params.index;
  const { marcaSelecionada, novaDescricao, novoValor } = req.body;

  pool.query(
    'UPDATE produtos SET marca = $1, descricao = $2, valor = $3 WHERE id = $4',
    [marcaSelecionada, novaDescricao, novoValor, index],
    (err, result) => {
      if (err) {
        console.error('Erro ao atualizar produto:', err);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    }
  );
});

app.delete('/produtos/:index', (req, res) => {
  const index = req.params.index;
  pool.query('DELETE FROM produtos WHERE id = $1', [index], (err, result) => {
    if (err) {
      console.error('Erro ao excluir produto:', err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});
