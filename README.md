# Trigonometric Convex Hull

Optimizing a convex hull using trigonometric elimination.

## Live Demo

https://richardnagy.gitlab.io/webprojects/trigonometric-convex-hull/

## Algorithm details

1. Calculate center point from average positions.
2. Sort points based on distance from center.
3. Eliminate center points using triangle intersection.
4. Sort remaining points based on theta angle from center.
5. Connect remaining points in sequence.

## Triangle intersection code sample

```javascript
let edges = []
for (let i = points.length - 1; i >= 0; i--) {
    let intersect = false
    for (let j = 0; !intersect && j < points.length - 1; j++) {
        if (j == i) {
            continue
        }
        for (let k = j + 1; !intersect && k < points.length; k++) {
            if (k == i) {
                continue
            }

            let a = points[i]
            let b = points[j]
            let c = points[k]
            let d = center

            let d1 = (a.pos.x - c.pos.x) * (b.pos.y - c.pos.y) - (b.pos.x - c.pos.x) * (a.pos.y - c.pos.y)
            let d2 = (a.pos.x - d.pos.x) * (b.pos.y - d.pos.y) - (b.pos.x - d.pos.x) * (a.pos.y - d.pos.y)
            let d3 = (a.pos.x - d.pos.x) * (c.pos.y - d.pos.y) - (c.pos.x - d.pos.x) * (a.pos.y - d.pos.y)

            let neg = (d1 < 0) || (d2 < 0) || (d3 < 0)
            let pos = (d1 > 0) || (d2 > 0) || (d3 > 0)

            if (!(neg && pos)) {
                intersect = true
            }
        }
    }
    if (!intersect) {
        edges.push(i)
    }
}
```


## Usage

Host the project on a static file server or open `index.html` locally.