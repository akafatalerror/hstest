const http = require("http");
const formidable = require('formidable');
const db = require('./models/index')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const getUserFromRequest = require('./lib/getUserFromRequest')
const {UserRoles} = require("./lib/types");
const fs = require('fs')
const staticServer = require('node-static');
const apiController = require('./controllers/apiController')
const port = process.env.PORT || 3333
const fileServer = new staticServer.Server('./public');


http.createServer(async function(request, response) {

    const urlParts = request.url.split('/');

    if(urlParts[1] === 'api'){
        apiController(request, response)
    } else {
        fileServer.serveFile('/index.html', 200, {}, request, response);
    }

}).listen(port);
