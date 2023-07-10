const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

app.use(express.json());

const pool = new Pool({
  user: 'banco_marca_produto_user',
  host: 'dpg-cikttmdgkuvinflaehlg-a.oregon-postgres.render.com',
  database: 'banco_marca_produto',
  password: 'DjO0CiKGYypa0TMvARC9QgfccwSAH8Qa',
  port: 5432 
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Marca:
 *       type: object
 *       properties:
 *         novaMarca:
 *           type: string
 *           description: O nome da nova marca
 *     Produto:
 *       type: object
 *       properties:
 *         marcaSelecionada:
 *           type: string
 *           description: A marca do produto
 *         novaDescricao:
 *           type: string
 *           description: A descrição do produto
 *         novoValor:
 *           type: number
 *           description: O valor do produto
 *     ProdutoAtualizado:
 *       type: object
 *       properties:
 *         marcaSelecionada:
 *           type: string
 *           description: A marca atualizada do produto
 *         novaDescricao:
 *           type: string
 *           description: A descrição atualizada do produto
 *         novoValor:
 *           type: number
 *           description: O valor atualizado do produto
 *     ProdutoExcluido:
 *       type: object
 *       properties:
 *         mensagem:
 *           type: string
 *           description: Mensagem de sucesso ao excluir o produto
 */

/**
 * @swagger
 * tags:
 *   name: Marcas
 *   description: API de cadastro de marcas
 */

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: API de cadastro, obtenção, atualização e exclusão de produtos
 */

/**
 * @swagger
 * /marcas:
 *   post:
 *     summary: Cadastrar nova marca
 *     tags: [Marcas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Marca'
 *     responses:
 *       201:
 *         description: Marca cadastrada com sucesso
 *       500:
 *         description: Erro ao cadastrar marca
 */
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

/**
 * @swagger
 * /produtos:
 *   post:
 *     summary: Cadastrar novo produto
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Produto'
 *     responses:
 *       201:
 *         description: Produto cadastrado com sucesso
 *       500:
 *         description: Erro ao cadastrar produto
 */
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

/**
 * @swagger
 * /produtos:
 *   get:
 *     summary: Obter todos os produtos
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Lista de produtos obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produto'
 *       500:
 *         description: Erro ao obter produtos
 */
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

/**
 * @swagger
 * /produtos/{index}:
 *   put:
 *     summary: Atualizar produto
 *     tags: [Produtos]
 *     parameters:
 *       - name: index
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         description: Índice do produto a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProdutoAtualizado'
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       500:
 *         description: Erro ao atualizar produto
 */
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

/**
 * @swagger
 * /produtos/{index}:
 *   delete:
 *     summary: Excluir produto
 *     tags: [Produtos]
 *     parameters:
 *       - name: index
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *         description: Índice do produto a ser excluído
 *     responses:
 *       200:
 *         description: Produto excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProdutoExcluido'
 *       500:
 *         description: Erro ao excluir produto
 */
app.delete('/produtos/:index', (req, res) => {
  const index = req.params.index;
  pool.query('DELETE FROM produtos WHERE id = $1', [index], (err, result) => {
    if (err) {
      console.error('Erro ao excluir produto:', err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }

    }
    
  );

});
  


