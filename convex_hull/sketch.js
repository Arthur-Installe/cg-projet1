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

class Line extends Shape {
	constructor(a, b) {
		super();
		this.a = a;
		this.b = b;
	}
	draw() {
		line(this.a.x, this.a.y, this.b.x, this.b.y);
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
	pointInTriangle(p) {
		const ab = orientation_determinant(this.a, this.b, p);
		const bc = orientation_determinant(this.b, this.c, p);
		const ca = orientation_determinant(this.c, this.a, p);
		return (ab >= 0 && bc >= 0 && ca >= 0) || (ab <= 0 && bc <= 0 && ca <= 0);
	}
}

function center(points_list) {
	let x = 0;
	let y = 0;
	for (i in points_list) {
		x += points_list[i].x;
		y += points_list[i].y;
	}
	x /= points_list.length;
	y /= points_list.length;
	return new Point(x, y);
}

function boolMap(list, default_value) {
	let map = new Map();
	for (i in list) {
		map.set(list[i], default_value);
	}
	return map;
}

function findExtremePoints(points, map) {
	for (a in points) {
		for (b in points) {
			for (c in points) {
				for (d in points) {
					if (map.get(points[d]) || a == b || a == c || a == d || b == c || b == d || c == d) {
						continue;
					}
					if (new Triangle(points[a], points[b], points[c]).pointInTriangle(points[d])) {
						map.set(points[d], true);
					}
				}
			}
		}
	}
}

function findMinimalX(points) {
	let minX = points[0];
	for (i of points) {
		if (i.x < minX.x) {
			minX = i;
		}
	}
	return minX;
}

var points = [];
var isPointsCH = false;

function reset() {
	points = [];
	isPointsCH = false;
}

function makeConvexHull() {
	let map = boolMap(points, false);
	
	findExtremePoints(points, map);
	
	points = points.filter((x) => !map.get(x));
	
	let minX = findMinimalX(points);
	
	points = points.filter((x) => x !== minX);
	points.sort(minX.leftRadialComparator.bind(minX));
	points.unshift(minX);
	
	isPointsCH = true;
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

	ch_button = createButton("Convex Hull");
	ch_button.style('font-size', '30px');
	ch_button.size(2*windowWidth/20, windowHeight/20);
	ch_button.position(windowWidth/2 - button.width/2, 18*windowHeight/20 - button.height/2);
	ch_button.style('cursor', 'pointer');
	ch_button.mousePressed(makeConvexHull);
}

function draw() {
	background(200);
	if (points.length == 0) {
		text("Behold the emptiness of the plane\n0o0", windowWidth/2, windowHeight/2);
		return;
	}

	for (i in points) {
		points[i].draw();
	}
	if (!isPointsCH) {
		return;
	}
	for (let i = 0; i < points.length; i++) {
		a = points[i];
		b = points[(i + 1) % points.length];
		line(a.x, a.y, b.x, b.y);
	}
	ch_center = center(points);
	text("Convex Hull !!!\n\\*w*/", ch_center.x, ch_center.y);
}

function onMousePressed() {
	if (isPointsCH) {
		reset();
	}
	for (i in points) {
		if (points[i].x == mouseX && points[i].y == mouseY) {
			return;
		}
	}
	points.push(new Point(mouseX, mouseY));
}

// This Redraws the Canvas when resized
windowResized = function () {
	resizeCanvas(windowWidth, windowHeight);
};

