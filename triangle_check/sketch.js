/* eslint-disable no-undef, no-unused-vars */

function orientation_determinant(a, b, c) {
	// > 0 is RIGHT, < 0 is LEFT, = 0 is colinear
	return (b.x * c.y) - (a.x * c.y) + (a.x * b.y) - (b.y * c.x) + (a.y * c.x) - (a.y * b.x);
}

class Shape{
	draw(){}
	pointInShape(p){}
	getCentroid(){}
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
	pointInShape(p) {
		return p.x == this.x && p.y == this.y;
	}
	getCentroid(){
		return this;
	}
}

class Line extends Shape {
	constructor(a, b) {
		super();
		this.a = a;
		this.b = b;
	}
	draw() {
		line(this.a.x, this.a.y, this.b.x, this.b.y);
	}
	pointInShape(p) {
		return orientation_determinant(this.a, this.b, p) == 0 && 
		p.x >= Math.min(this.a.x, this.b.x) && 
		p.x <= Math.max(this.a.x, this.b.x) && 
		p.y >= Math.min(this.a.y, this.b.y) && 
		p.y <= Math.max(this.a.y, this.b.y);
	}
	getCentroid(){
		return new Point((this.a.x + this.b.x)/2, (this.a.y + this.b.y)/2);
	}
}

class Triangle extends Shape {
	constructor(a, b, c) {
		super();
		this.a = a;
		this.b = b;
		this.c = c;
	}
	draw() {
		line(this.a.x, this.a.y, this.b.x, this.b.y);
		line(this.b.x, this.b.y, this.c.x, this.c.y);
		line(this.c.x, this.c.y, this.a.x, this.a.y);
	}
	//Assume general position :)
	pointInShape(p) {
		const ab = orientation_determinant(this.a, this.b, p);
		const bc = orientation_determinant(this.b, this.c, p);
		const ca = orientation_determinant(this.c, this.a, p);
		return (ab >= 0 && bc >= 0 && ca >= 0) || (ab <= 0 && bc <= 0 && ca <= 0);
	}
	getCentroid(){
		return new Point((this.a.x + this.b.x + this.c.x)/3, (this.a.y + this.b.y + this.c.y)/3);
	}
}

class ShapeBuilder{
	constructor() {
		this.points = [];
	}
	includes(p) {
		for (i in this.points) {
			if (this.points[i].x == p.x && this.points[i].y == p.y) {
				return true;
			}
		}
		return false;
	}
	addPoint(p) {
		if (this.includes(p)) {
			return;
		}
		this.points.push(p);
	}
	build() {
		switch (this.points.length) {
			case 0:
				return null;
			case 1:
				return new Point(this.points[0].x, this.points[0].y);
			case 2:
				return new Line(this.points[0], this.points[1]);
			case 3:
				return new Triangle(this.points[0], this.points[1], this.points[2]);
		}
	}
	reset() {
		this.points = [];
	}
}

function insiderTest(shape, point) {
	return shape.pointInShape(point) ? "Inside" : "Outside";
}

const maxShapePoints = 3;
var shapeBuilder = new ShapeBuilder();
var points = [];
var flag = false;
var mainShape = null;
var testPoint = null;

function reset() {
	shapeBuilder.reset();
	points = [];
	flag = true;
	mainShape = null;
	testPoint = null;
}

function setup() {
	createCanvas(windowWidth, windowHeight);

	// Put setup code here
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
	// Put drawings here
	background(200);
	if (mainShape == null) {
		text("Behold the emptiness of the plane\n0o0", windowWidth/2, windowHeight/2);
		return;
	}
	for (i in points) {
		points[i].draw();
	}
	mainShape.draw();
	if (testPoint != null) {
		testPoint.draw();
		centroid = mainShape.getCentroid();
		text(insiderTest(mainShape, testPoint), centroid.x, centroid.y);
	}
}

function mousePressed() {
	// Remove the point generated when pressing the clear button
	if (flag) {
		shapeBuilder.reset();
		points = [];
		flag = false;
		return;
	}
	if (points.length < maxShapePoints) {
		shapeBuilder.addPoint(new Point(mouseX, mouseY));
		points.push(new Point(mouseX, mouseY));
	}
	else {
		testPoint = new Point(mouseX, mouseY);
	}
	mainShape = shapeBuilder.build();
}

// This Redraws the Canvas when resized
windowResized = function () {
	resizeCanvas(windowWidth, windowHeight);
};

