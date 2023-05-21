require('dotenv').config();
const express = require('express');
const app = express();
require('./db/conn');
const router = require('./routes/router');
const venuerouter = require('./routes/venuesrouter');
const artistsRouter = require('./routes/artistsRouter');
const cors = require('cors');
const cookiParser = require('cookie-parser');
const port = 8080;

// app.get("/",(req,res)=>{
//     res.status(201).json("server created")
// });
app.use('/public', express.static('public'));
app.use(express.json());
app.use(cookiParser());
app.use(cors());
app.use(venuerouter);
app.use(router);
app.use(artistsRouter);

app.listen(port, () => {
  console.log(`server start at port no : ${port}`);
});
