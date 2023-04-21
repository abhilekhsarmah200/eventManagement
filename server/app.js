require('dotenv').config();
const express = require('express');
const app = express();
require('./db/conn');
const router = require('./routes/router');
const adminRouter = require('./routes/adminRouter');
const organiserRouter = require('./routes/organiserRouter');
const cors = require('cors');
const cookiParser = require('cookie-parser');
const port = 8010;

// app.get("/",(req,res)=>{
//     res.status(201).json("server created")
// });

app.use('/public', express.static('public'));
app.use(express.json());
app.use(cookiParser());
app.use(cors());
app.use(router);
app.use(adminRouter);
app.use(organiserRouter);

app.listen(port, () => {
  console.log(`server start at port no : ${port}`);
});
