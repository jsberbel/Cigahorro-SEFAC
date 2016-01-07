// Helper functions
function AABBIntersect(ax, ay, aw, ah, bx, by, bw, bh) {
	return ax < bx+bw && bx < ax+aw && ay < by+bh && by < ay+ah;
};

// Screen
function Display(id, width, height) {
	this.canvas = document.getElementById(id);
	this.canvas.width = this.width = width;
	this.canvas.height = this.height = height;
	this.ctx = this.canvas.getContext("2d");
};
Display.prototype.clear = function() {
	this.ctx.clearRect(0, 0, this.width, this.height);
};
Display.prototype.drawSprite = function(sp, x, y, w, h) {
	this.ctx.drawImage(sp.img, sp.x, sp.y, sp.w, sp.h, x, y, w, h);
};
Display.prototype.drawText = function(text, x, y, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, x, y);
};
Display.prototype.drawStrokeText = function(text, x, y, strokeColor, strokeWeight, textColor) {
	this.ctx.strokeStyle = strokeColor;
    this.ctx.lineWidth = strokeWeight;
    this.ctx.strokeText(text, x, y);
    this.ctx.fillStyle = textColor;
    this.ctx.fillText(text, x, y);
};
Display.prototype.drawRect = function(color, x, y, w, h) {
	this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, w, h);
};

// Sprite
function Sprite(img, x, y, w, h) {
	this.img = img;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
};

// Input Handler
function InputHandler() {
	this.down = {};
	this.pressed = {};

	var _this = this;
	document.addEventListener("keydown", function(evnt) {
		_this.down[evnt.keyCode] = true;
	});
	document.addEventListener("keyup", function(evnt) {
		delete _this.down[evnt.keyCode];
		delete _this.pressed[evnt.keyCode];
	});
};

InputHandler.prototype.isDown = function(code) {
	return this.down[code];
};

InputHandler.prototype.isPressed = function(code) {
	if (this.pressed[code]) return false;
	else if (this.down[code]) return this.pressed[code] = true;
	return false;
};