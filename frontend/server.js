// Import npm packages
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const routes= require('./routes/api');
const app=express();
const cors = require('cors');
const PORT=process.env.PORT || 8080;
const MONGODB_URI="mongodb+srv://rohit:mernapp@mernapp.blerx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

mongoose.connection.on('connected',()=>{
    console.log('mongoose in connected!')
})

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// HTTP request logger
app.use(morgan('tiny'));
app.use('/api',routes)

app.listen(PORT, console.log('Server is starting at port:'+PORT))