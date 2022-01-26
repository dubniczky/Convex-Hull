//Required globals:
//   pointRadius: integer (>=0)
//   rad: float

class Point
{
   constructor(pos, col, rad)
   {
      this.pos = pos;
      this.col = col;
      this.rad = rad;
   }

   draw(col)
   {
      if (col == null) fill(this.col);
      else fill(col);
      
      circle(this.pos.x, this.pos.y, this.rad);
   }

   distance(point)
   {
      return Math.sqrt(point.x**2 + point.y**2);
   }
   theta(point)
   {
      let a = this.pos.x - point.pos.x;
      let b = this.pos.y - point.pos.y;

      return (Math.atan2(b, a) * rad);
   }
   triSign(a, b)
   {
      return (this.pos.x - b.pos.x) * (a.pos.y - b.pos.y) - (a.pos.x - b.pos.x) * (this.pos.y - b.pos.y);
   }

   inTriangle(p1, p2, p3)
   {
      let d1 = this.triSign(p1, p2);
      let d2 = this.triSign(p2, p3);
      let d3 = this.triSign(p3, p1);

      let neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
      let pos = (d1 > 0) || (d2 > 0) || (d3 > 0);

      return !(neg && pos);
   }
}