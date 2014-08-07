
var screenWidth = $(window).width();
var screenHeight = $(window).height();

var aspectRatio = 8.5/11;

var height = screenHeight * 0.8;
var width = height * aspectRatio;

var canvas = document.createElement("canvas");

canvas.width = width;
canvas.height = height;

$('#container').append(canvas);

var context = canvas.getContext("2d");
context.textBaseline = "top";

var scale = 72;

var margin = 0.5*scale;

context.rect(margin, margin, width-(margin*2), height - (margin*2));
context.stroke();

context.font = '14px Verdana';
context.fillText("Test", margin, margin);

context.scale(72,72);
