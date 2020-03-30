'use strict';
const express = require('express');
const routes = express.Router();
const path = require('path');
//paginas
routes.get('/',(req,res)=>{
  res.sendFile(path.normalize(__dirname+"/../pag") +"\\index.html");
});
routes.get('/css',(req,res)=>{
  res.sendFile(path.normalize(__dirname+"/../pag/css") +"\\style.css");
});
routes.get('/js',(req,res)=>{
  res.sendFile(path.normalize(__dirname+"/../pag/js") +"\\script.js");
});

module.exports = routes;
