const express = require('express')
require('dotenv').config();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require ('nodemailer');
const hbs = require('express-handlebars');
const cors = require("cors");
const path = require('path');
const userRoute = require("./router/userRoutes");
const blogRoute = require("./router/blogRouter");

const app = express();
const PORT = process.env.PORT || 3000 

var corsOptions = {
    origin: "http://localhost:3001"
  };
  app.use(cors(corsOptions));

const connectDB = require('./config/db');
connectDB();


app.use(express.static(path.join(__dirname, 'public')));

app.engine('.hbs', hbs({
    defaultLayout: 'layout',
    extname: 'hbs'
}));

app.set('view engine', '.hbs');
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/user', userRoute);
app.use('/blog', blogRoute);



app.get('/',(req,res)=>{
    res.render('');
})


app.listen(PORT, (req,res)=>{
    console.log("http://localhost:3000")
})