/// <reference path="../../includes/types/node.d.ts"/>
var path = require('path');
var express = require('express');
var app = express();

var port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, function () {
    console.log('server up on port %s', port);
});
