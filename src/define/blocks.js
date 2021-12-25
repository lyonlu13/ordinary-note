import { makeAutoObservable } from "mobx"
import { Position } from "./basic";
import { makeId } from "utils/generate";
import _ from "lodash";
export class BlockInfo {
    constructor(typename, name, color, icon) {
        this.typename = typename;
        this.name = name
        this.color = color
        this.icon = icon;
    }
}

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

    target.setData = function (data) {
        target.data = _.cloneDeep(data)
        return target
    }

    target.updateData = function (update) {
        if (update && typeof update === "object")
            update.keys.forEach(key => {
                target.data[key] = update.key
            });
    }

    target.setPos = function (x, y) {
        this.geometry.pos = new Position(x, y)
        return target
    }

    target.init = function () {
        target.id = makeId(5)
        return target
    }

    target.dom = null
    target.setDom = function (dom) {
        this.dom = dom
    }

    target.getName = function () {
        return this.name || this.info.name
    }
}
export class TextBlock {
    info = new BlockInfo("text", "文字方塊", "#00a2ff", "text")
    constructor(id, name, geometry, data) {
        this.data = {};
        this.id = id;
        this.name = name
        this.geometry = geometry || { pos: new Position(0, 0) };
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
    }
    setFontSize(size) {
        this.data.fontsize = size
    }
    paste(pastingObject) {
        if (pastingObject.type === "text") {
            this.setText(pastingObject.text)
        }
    }
}

export class ImageBlock {
    info = new BlockInfo("image", "圖片方塊", "#ffc400", "image")
    constructor(id, name, geometry, data) {
        this.data = {};
        this.id = id;
        this.name = name
        this.geometry = geometry || { pos: new Position(0, 0) };
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
    }
    setWidth(width) {
        if (width >= 100)
            this.data.width = width
    }
    paste(pastingObject) {
        const me = this
        if (pastingObject.type === "image") {
            if (pastingObject.file) {
                var reader = new FileReader();
                reader.readAsDataURL(pastingObject.file);
                reader.onload = function () {
                    me.setSrc(reader.result)
                };
                reader.onerror = function (error) {
                    console.log('Error: ', error);
                };
            } else {
                me.setSrc(pastingObject.url)
            }
        }
    }
}

export class LatexBlock {
    info = new BlockInfo("latex", "LaTeX方塊", "#00a808", "image")
    constructor(id, name, geometry, data) {
        this.data = {};
        this.id = id;
        this.name = name

        this.geometry = geometry || { pos: new Position(0, 0) };
        this.data = data;
        commonize(this)
        makeAutoObservable(this)
    }
    new() {
        this.data.code = "\\frac{1}{2}"
        return this
    }
    value() {
        return {
            type: "text",
            value: this.data.code
        }
    }
    setCode(code) {
        this.data.code = code
    }
    paste(pastingObject) {
        if (pastingObject.type === "text")
            this.setCode(pastingObject.text)
    }
}
export class ArrayBlock {
    info = new BlockInfo("array", "陣列方塊", "#5800fc", "image")
    constructor(id, name, geometry, data) {
        this.data = {};
        this.id = id;
        this.name = name

        this.geometry = geometry || { pos: new Position(0, 0) };
        this.data = data;
        commonize(this)
        makeAutoObservable(this)
    }
    new() {
        this.data.array = [0, 1, 2, 3, 4, 5]
        return this
    }
    value() {
        return {
            type: "array",
            value: this.data.array
        }
    }
    setArray(array) {
        this.data.array = array
    }
    setElement(index, value) {
        if (this.data.array[index] !== undefined)
            this.data.array[index] = value
    }
    paste(pastingObject) {
        if (pastingObject.type === "text") {
            try {
                const obj = JSON.parse(pastingObject.text)
                this.setArray(Array.isArray(obj) ? obj : obj.keys.map((k) => obj[k]))
            } catch {

            }
        }
    }
}
export class MusicBlock {
    info = new BlockInfo("music", "音樂方塊", "#FC0000", "music")
    constructor(id, name, geometry, data) {
        this.data = {};
        this.id = id;
        this.name = name

        this.geometry = geometry || { pos: new Position(0, 0) };
        this.data = data;
        commonize(this)
        makeAutoObservable(this)
    }
    new() {
        this.data.type = "yt"   //yt, url
        this.data.source = {
            url: "https://www.youtube.com/watch?v=8MG--WuNW1Y",
            preload: "",
            thumbnail: "https://i.ytimg.com/vi/8MG--WuNW1Y/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBIlMzA-QLc5PZl1T1x1Uaeh-xAQA"
        }
        return this
    }
    value() {
        return {
            type: "url",
            value: this.data.source
        }
    }
    setType(type) {
        this.data.type = type
    }
    setSource(source) {
        this.data.source = source
    }
    paste(pastingObject) {
        if (pastingObject.type === "text") {
            // Todo: detect if this text a valid url
        }
    }
}


MusicBlock.createByYt = (url, pos) => {
    return new MusicBlock().init().setData({
        type: "yt",
        source: {
            url
        }
    })
}

MusicBlock.createByUrl = (url, pos) => {
    return new MusicBlock().init().setData({
        type: "url",
        source: {
            url
        }
    })
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

        setInterval(() => {
            save()
        }, 2000)

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
    remove(models) {
        models.forEach(model => {
            if (model.onDelete) {
                model.onDelete()
            }
            this.ids = this.ids.filter((d) => d !== model.id)
            delete this.blocks[model.id]
        });
        this.save()
    }
    save() {
        localStorage.setItem("ids", JSON.stringify(this.ids))
        localStorage.setItem("blocks", JSON.stringify(this.ids.map(id => this.blocks[id].pure())))
    }

    sendToFront(id) {
        this.ids = [...this.ids.filter((d) => d !== id), id]
    }

    new(model) {
        this.blocks[model.id] = model
        this.ids.push(model.id)
        this.save()
    }
}

function save() {
    const blocksHolder = BlocksHolder.getInstance()
    blocksHolder.save()
}


const castMap = {
    text: TextBlock,
    image: ImageBlock,
    latex: LatexBlock,
    array: ArrayBlock,
    music: MusicBlock
}

function specify(raw) {
    const SpecificBlock = castMap[raw.type]
    if (SpecificBlock)
        return new SpecificBlock(raw.id, raw.name, raw.geometry, raw.data)
    else return null;
}