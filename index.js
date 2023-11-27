// app.mjs

const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.get('/', async (req, res) => {
  try {
    const allusers = await prisma.user.findMany();
    res.json(allusers);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`🚀 Development is running on port ${PORT}.`);
  console.log(process.env);
});
