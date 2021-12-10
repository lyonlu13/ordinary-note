import { makeAutoObservable } from "mobx"
import _ from "lodash"
import { makeId, makeSimpleAutoObservable, Position } from "./basic";

export class BlockInfo {
    constructor(typename, name, color, icon) {
        this.typename = typename;
        this.name = name
        this.color = color
        this.icon = icon;
    }
}

// export class Block {
//     constructor(id, name, type, geometry) {
//         this.data = {};
//         this.id = id;
//         this.name = name
//         this.type = type;
//         this.geometry = geometry;
//     }
//     valid() {
//         if (!this.id) return false;
//         if (!this.name) return false;
//         if (!this.type) return false;
//         if (!this.geometry?.pos?.x || !this.geometry?.pos?.y) return false;
//         if (!this.geometry?.dim?.w || !this.geometry?.dim?.h) return false;
//         return true;
//     }
//     pure() {
//         return {
//             id: this.id,
//             name: this.name,
//             type: this.type,
//             geometry: this.geometry,
//             data: this.data,
//         }
//     }
//     value() {
//         return {
//             type: "empty",
//             value: null
//         }
//     }
//     updateData(update) {
//         if (update && typeof update === "object")
//             update.keys.forEach(key => {
//                 this.data[key] = update.key
//             });
//     }
//     setPos(x, y) {
//         this.pos = new Position(x, y)
//     }
// }

function commonize(target) {
    target.type = target.info.typename
    target.pure = function () {
        return {
            id: target.id,
            name: target.name,
            type: target.type,
            geometry: target.geometry,
            data: target.data,
        }
    }

    target.pure = function () {
        return {
            id: target.id,
            name: target.name,
            type: target.type,
            geometry: target.geometry,
            data: target.data,
        }
    }

    target.updateData = function (update) {
        if (update && typeof update === "object")
            update.keys.forEach(key => {
                target.data[key] = update.key
            });
    }

    target.setPos = function (x, y) {
        this.geometry.pos = new Position(x, y)
        save()
    }

    target.init = function () {
        target.id = makeId(5)
        return target
    }
}

export class TextBlock {
    info = new BlockInfo("text", "文字方塊", "#00a2ff", "text")
    constructor(id, name, geometry, data) {
        this.data = {};
        this.id = id;
        this.name = name
        this.geometry = geometry;
        this.data = data;
        commonize(this)
        makeAutoObservable(this)
    }
    new() {
        this.data.text = "Hello World"
        return this
    }
    value() {
        return {
            type: "string",
            value: this.data.text
        }
    }
    setText(text) {
        this.data.text = text
        save()
    }
}

export class ImageBlock {
    info = new BlockInfo("image", "圖片方塊", "#ffc400", "image")
    constructor(id, name, geometry, data) {
        this.data = {};
        this.id = id;
        this.name = name
        this.geometry = geometry;
        this.data = data;
        commonize(this)
        makeAutoObservable(this)
    }
    new() {
        this.data.src = "https://michaelh.cc/images/for_post/popcat.webp"
        this.data.width = 400
        return this
    }
    value() {
        return {
            type: "image",
            value: this.data.src
        }
    }
    setSrc(src) {
        this.data.src = src
        save()
    }
    setWidth(width) {
        this.data.width = width
        save()
    }
}

export class BlocksHolder {
    constructor() {
        let local_ids = localStorage.getItem("ids")
        let local_blocks = localStorage.getItem("blocks")

        if (local_ids && local_blocks) {
            this.ids = JSON.parse(local_ids)
            this.blocks = {}
            const list = JSON.parse(local_blocks)
            list.forEach(b => {
                let BlockModel = specify(b)
                if (BlockModel)
                    this.blocks[b.id] = BlockModel
            })
        } else {
            this.blocks = {}
            const newText = new TextBlock("id", "文字", { pos: new Position(100, 300) }, {}).init().new()
            const newImage = new ImageBlock("id", "圖片", { pos: new Position(500, 150) }, {}).init().new()
            this.blocks[newText.id] = newText
            this.blocks[newImage.id] = newImage
            this.ids = [newText.id, newImage.id]
        }

        makeAutoObservable(this)
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new BlocksHolder();
        }
        return this.instance;
    }
    get(id) {
        return this.blocks[id]
    }
    remove(id) {
        this.ids = this.ids.filter((d) => d !== id)
        delete this.blocks[id]
    }
    save() {
        localStorage.setItem("ids", JSON.stringify(this.ids))
        localStorage.setItem("blocks", JSON.stringify(this.ids.map(id => this.blocks[id].pure())))
    }
}

function save() {
    const blocksHolder = BlocksHolder.getInstance()
    blocksHolder.save()
}


const castMap = {
    text: TextBlock,
    image: ImageBlock,
}

function specify(raw) {
    const SpecificBlock = castMap[raw.type]
    if (SpecificBlock)
        return new SpecificBlock(raw.id, raw.name, raw.geometry, raw.data)
    else return null;
}
