'use strict';
const express = require('express');
const http = require('http');
const sockets = require('./../socket/room');
const routes = require('./routes');

const server = express();

server.use(express.json());
server.use(routes);

const http2 = http.createServer(server);

sockets.ativa(http2);

http2.listen(3000);
