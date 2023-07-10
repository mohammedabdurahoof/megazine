// Import packages
const express = require("express");
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var db = require('./confiq/connection')
var hbs = require('express-handlebars');
var path = require('path');
const { handlebars } = require('hbs');
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var uplodeFiles = require('express-fileupload')


// Middlewares
const app = express();
app.use(express.json());

// view engine setup
const hbsHelper = hbs.create({
    extname:'hbs',
    defaultLayout:'layout',
    layoutsDir:__dirname+'/views/layout/',
    partialsDir:__dirname+"/views/partial/",
  
    helpers:{
      ifequals:function(v1,v2){
      if(v1===v2){
        console.log(v1+' & '+v2)
        return 'checked'
      }else{
        return false
      }
      },
      count:function(index){
        return index+1
      }
    }
  })

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbsHelper.engine )


app.use(logger('dev'));
app.use(uplodeFiles())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:"key",cookie:{maxAge:1000000}}))

// Routes
app.use('/', userRouter);
app.use('/admin', adminRouter);

// db
db.connect((err) => {
    if (err) console.log('error', err)
    else console.log('success')
})

// connection
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port ${port}`));