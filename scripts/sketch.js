'use strict'

// Constants
const description = 
`
Convex hull is an algorithm to connect the bordering dots in an nD space.
This solution uses trigonometric elimination to achieve higher efficiency.
Click to add dots. Press R to reset. Press Space to add a random dot.
`
const rad = (180.0 / Math.PI)
const backgroundColor = `rgb(0, 0, 0)`
const centerColor = `rgb(255, 204, 92)`
const pointRadius = 15
const descriptionSize = 18
const pointSize = 12
const lineWidth = 3

// Variables
let lineColor
let pointColor
let width = 800
let height = 600
let points = []
let center = {}
let edges = null
let hullTime = 0

//Main
function setup() {
    //Window stats
    width = window.innerWidth
    height = window.innerHeight

    //Setup rendering
    canvas = createCanvas(width, height)
    lineColor = color(20, 190, 190)
    pointColor = color(0, 0, 0)
    textSize(descriptionSize)

    //Setup objects
    center = new Point(null, color(centerColor), pointSize)
}
function draw() {
    // Background
    background(color(backgroundColor))

    // Edges
    stroke(lineColor)
    strokeWeight(lineWidth)
    if (edges != null) {
        let p1
        let p2
        for (let i = 0; i < edges.length - 1; i++) {
            p1 = points[edges[i]]
            p2 = points[edges[i+1]]
            line(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y)
        }

        p1 = points[edges[0]]
        p2 = points[edges[edges.length-1]]
        line(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y)
    }

    // Points
    points.forEach((c) => c.draw())

    // Center
    noStroke()
    if (center.pos != null) center.draw()

    // Description
    if (points.length < 3) {
        textAlign(CENTER, CENTER)
        strokeWeight(1)
        stroke(0)
        fill(255)        
        text(description, 0, 0, width, height)
    }
    else { // Performance
        textAlign(LEFT, TOP)
        strokeWeight(1)
        stroke(0)
        fill(255)
        text(`Hull time: ${hullTime.toFixed(1)}ms`, 0, 0, width, height)
    }
}


//Events
function mouseClicked(e) {
    addDot(e.clientX, e.clientY)
}
function keyPressed() {
    switch (keyCode) {
        case 32: //Space
            addRandom()
            break
        case 82: //R
            reset()
            break
    }
}

//Methods
function addDot(x, y) {
    const p = createVector(x, y)
    points.push(new Point(p, pointColor, pointRadius))

    if (points.length >= 3) {
        center.pos = calculateCenter(points)

        let time = performance.now()
        edges = convexHull(points)
        hullTime = performance.now() - time
    }
    else {
        center.pos = null
        edges = null
    }
}
function reset() {
    points = []
    edges = null   
    center.pos = null
}
function addRandom() {
    let x = Math.floor( Math.random() * width)
    let y = Math.floor( Math.random() * height)
    addDot(x, y)
}
function calculateCenter(points) {
    let n = points.length
    let avgX = 0
    let avgY = 0

    for (let i = 0; i < n; i++) {
        avgX += points[i].pos.x
        avgY += points[i].pos.y
    }

    avgX /= n
    avgY /= n

    return createVector(avgX, avgY)
}
function convexHull(points) {
    //Guard
    if (points.length < 3) {
        return null
    }
    
    // Sort points by dinstance from center
    points.sort((a, b) => a.distance(center) - b.distance(center))

    //Hull points
    let edges = []
    for (let i = points.length - 1; i >= 0; i--) {
        let intersect = false
        for (let j = 0; !intersect && j < points.length - 1; j++) {
            if (j == i) continue
            for (let k = j + 1; !intersect && k < points.length; k++) {
                if (k == i) continue
                if (points[i].inTriangle(center, points[j], points[k])) {
                    intersect = true
                }
            }
        }
        if (!intersect) edges.push(i)
    }

    //Sort by theta from center
    edges.sort((i, j) => points[i].theta(center) - points[j].theta(center))
    return edges
}