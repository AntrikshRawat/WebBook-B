const connectToMongo = require("./database");
const express = require('express');
const cors = require("cors");
connectToMongo();
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

//available routes
app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));

app.get('/', (req, res) => {
  res.send("Welcome To the backend of webbook");
})

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})