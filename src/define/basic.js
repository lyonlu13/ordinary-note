export class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    offset(x, y) {
        this.x += x;
        this.y += y;
    }
}

export class Dimension {
    constructor(w, h) {
        this.w = w;
        this.h = h;
    }
}

export class Geometry {
    constructor(pos) {
        this.pos = pos;
    }
}

