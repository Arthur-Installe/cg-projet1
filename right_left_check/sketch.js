/* eslint-disable no-undef, no-unused-vars */

function orientation_determinant(a, b, c) {
	// > 0 is RIGHT, < 0 is LEFT, = 0 is colinear
	return (b.x * c.y) - (a.x * c.y) + (a.x * b.y) - (b.y * c.x) + (a.y * c.x) - (a.y * b.x);
}

class Shape{
	draw(){}
	line(point){}
	orientationTest(point){}
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
	line(point) {
		line(this.x, this.y, point.x, point.y);
	}
	orientationTest(point) {
		return "Colinear";
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
	line(p) {
		line(this.b.x, this.b.y, p.x, p.y);
	}
	orientationTest(point) {
		var test = orientation_determinant(this.a, this.b, point);
		return test > 0 ? "Right" : test < 0 ? "Left" : "Colinear";
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
		}
	}
	reset() {
		this.points = [];
	}
}

const maxShapePoints = 2;
var shapeBuilder = new ShapeBuilder();
var points = [];
var mainShape = null;
var testPoint = null;

function reset() {
	shapeBuilder.reset();
	points = [];
	mainShape = null;
	testPoint = null;
}

function setup() {
	let c = createCanvas(windowWidth, windowHeight);
	c.mousePressed(onMousePressed);

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
		mainShape.line(testPoint);
		text(mainShape.orientationTest(testPoint), windowWidth/2, windowHeight/20);
	}
}

function onMousePressed() {
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

