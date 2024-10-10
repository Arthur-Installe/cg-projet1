/* eslint-disable no-undef, no-unused-vars */

function orientation_determinant(a, b, c) {
	// > 0 is RIGHT, < 0 is LEFT, = 0 is colinear
	return (b.x * c.y) - (a.x * c.y) + (a.x * b.y) - (b.y * c.x) + (a.y * c.x) - (a.y * b.x);
}

class Shape{
	draw(){}
}

class Point extends Shape {
	constructor(x, y) {
		super();
		this.x = x;
		this.y = y;
	}
	draw() {
		ellipse(this.x, this.y, 4, 4);
	}
	distance(p) {
		return Math.sqrt(Math.pow(this.x - p.x, 2) + Math.pow(this.y - p.y, 2));
	}
	leftRadialComparator(a, b) {
		//Answers to : Is a more at left than b ?
		let od = orientation_determinant(this, a, b);
		if (od > 0) {
			return true;
		}
		if (od == 0) {
			return this.distance(a) > this.distance(b);
		}
		return false;
	}
}

var p0 = null;
var points = [];

function reset() {
	p0 = null;
	points = [];
}

function setup() {
	let c = createCanvas(windowWidth, windowHeight);
	c.mousePressed(onMousePressed);

	fill("black");
	textSize(50);
	textAlign(CENTER);

	button = createButton("Clear");
	button.style('font-size', '30px');
	button.size(2*windowWidth/20, windowHeight/20);
	button.position(windowWidth/2 - button.width/2, 19*windowHeight/20 - button.height/2);
	button.style('cursor', 'pointer');
	button.mousePressed(reset);
}

function draw() {
	background(200);
	if (p0 == null) {
		text("Behold the emptiness of the plane\n0o0", windowWidth/2, windowHeight/2);
		return;
	}
	
	if (p0 != null) {
		p0.draw();
		text("p0", p0.x, p0.y);
	}
	if (points.length > 0) {
		for (i in points) {
			points[i].draw();
		}
		line(p0.x, p0.y, points[0].x, points[0].y);
		for (let i = 0; i < points.length - 1; i++) {
			line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
		}
	}
}

function onMousePressed() {
	if (p0 == null) {
		p0 = new Point(mouseX, mouseY);
		return;
	}
	points.push(new Point(mouseX, mouseY));
	points.sort(p0.leftRadialComparator.bind(p0));
}

// This Redraws the Canvas when resized
windowResized = function () {
	resizeCanvas(windowWidth, windowHeight);
};

