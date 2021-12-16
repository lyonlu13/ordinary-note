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

export function makeId(length) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}