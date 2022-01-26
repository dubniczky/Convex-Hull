'use strict';

const rad = (180.0 / Math.PI);

var lineColor;
var pointColor;

var pointRadius = 15;
var width = 800;
var height = 600;

var points = [];
var center = {};
var edges = null;
var ms = 0;

//Main
function setup()
{
   //Window stats
   width = window.innerWidth;
   height = window.innerHeight;

   //Setup rendering
   canvas = createCanvas(width, height);
   lineColor = color(20, 190, 190);
   pointColor = color(255, 255, 255);
   textSize(18);

   //Setup objects
   center = new Point(null, color(200, 200, 40), 12);
}
function draw()
{
   background(0);

   //Edges
   stroke(lineColor);
   strokeWeight(3);
   if (edges != null)
   {
      let p1;
      let p2;
      for (let i = 0; i < edges.length - 1; i++)
      {
         p1 = points[edges[i]];
         p2 = points[edges[i+1]];
         line(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y);
      }

      p1 = points[edges[0]];
      p2 = points[edges[edges.length-1]];
      line(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y);
   }

   //Points
   points.forEach((c) => c.draw());

   //Center
   noStroke();
   if (center.pos != null) center.draw();

   //Description
   if (points.length == 0)
   {
      textAlign(CENTER, CENTER);
      strokeWeight(1);
      stroke(0);
      fill(255);
      const centerText = 
      `
      Convex hull is an algorithm to connect the border dots in a 2D space.
      This solution uses optimized trigonometry to achieve high efficiency.
      Click to add dot and calculate hull when over 3 points. Press r to reset.
      `
      text(centerText, 0, 0, width, height);
   }
   else
   {
      textAlign(LEFT, TOP);
      strokeWeight(1);
      stroke(0);
      fill(255);
      text(`Hull time: ${ms}ms`, 0, 0, width, height);
   }
}


//Events
function mouseClicked(e)
{
   const p = createVector(e.clientX, e.clientY);
   points.push(new Point(p, pointColor, pointRadius));

   if (points.length >= 3)
   {
      center.pos = calculateCenter(points);

      var time = new Date();
      edges = convexHull(points);
      ms = new Date() - time;
   }
   else
   {
      center.pos = null;
      edges = null;
   }
}
function keyPressed()
{
   switch (keyCode)
   {
      case 32: //Space
         
         break;
      case 82: //R
         reset();
         break;
   }
}

//Methods
function reset()
{
   points = [];
   edges = null;   
   center.pos = null;
}
function calculateCenter(points)
{
   let plen = points.length;
   let avgX = 0;
   let avgY = 0;

   for (let i = 0; i < plen; i++)
   {
      avgX += points[i].pos.x;
      avgY += points[i].pos.y;
   }

   avgX /= plen;
   avgY /= plen;

   return createVector(avgX, avgY);
}
function convexHull(points) //Warning: modifies parameter array for efficiency
{
   //Guard
   let n = points.length;
   if (n < 3)
   {
      return null;
   }

   //Hull points
   var edges = [];
   points.sort((a, b) => a.distance(center) - b.distance(center));

   for (let i = points.length - 1; i >= 0; i--)
   {
      let intersect = false;
      for (let j = 0; !intersect && j < points.length - 1; j++)
      {
         if (j == i) continue;
         for (let k = j + 1; !intersect && k < points.length; k++)
         {
            if (k == i) continue;
            if (points[i].inTriangle(center, points[j], points[k]))
            {
               intersect = true;
            }
         }
      }
      if (!intersect) edges.push(i);
   }

   //Sort by theta from center
   edges.sort((i, j) => points[i].theta(center) - points[j].theta(center));
   return edges;
}