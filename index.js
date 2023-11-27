// app.mjs

const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
// const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');

// const prisma = new PrismaClient();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.get('/', async (req, res) => {
  res.status(200).json({
    message: 'Hello world!',
  });
});

app.post('/api/v1/youtrack/minerva', async (req, res) => {
  try {
    // const allusers = await prisma.user.findMany();
    console.log(req.body);
    return res.json(req.body);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`🚀 Development is running on port ${PORT}.`);
  console.log(process.env);
});
