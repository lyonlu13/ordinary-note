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
        this.data.fontsize = 18
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
        return this
    }
    setFontSize(size) {
        this.data.fontsize = size
        return this
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
        this.data.src = "https://lyonlu13.github.io/Ordinary-Note/Logo.png"
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
        return this
    }
    setWidth(width) {
        if (width >= 100)
            this.data.width = width
        return this
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
        this.data.code = ""
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
            url: "https://www.youtube.com/watch?v=BFtzfdMHjkk",
            preload: "",
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
    }).setPos(pos.x, pos.y)
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
            const logoImage = new ImageBlock("_", "Logo", { pos: new Position(0, 0) }, {}).init().new()
            logoImage.setSrc("https://lyonlu13.github.io/Ordinary-Note/Logo.png")
            logoImage.setWidth(400)
            const welcome = new TextBlock("_", "歡迎文字", { pos: new Position(0, 160) }, {}).init().new()
            welcome.setText("歡迎使用平凡筆記").setFontSize(45)
            const descText = new TextBlock("_", "說明文字", { pos: new Position(0, 220) }, {}).init().new()
            descText.setText("嘗試看看各種不同的方塊吧!\nBy the way~ 我是文字方塊").setFontSize(20)
            const image1Image = new ImageBlock("_", "Image1", { pos: new Position(0, 330) }, {}).init().new()
            image1Image.setSrc("data:image/jpeg;base64,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")
            image1Image.setWidth(150)
            const image2Image = new ImageBlock("_", "Image2", { pos: new Position(150, 330) }, {}).init().new()
            image2Image.setSrc("https://megapx-assets.dcard.tw/images/75c77574-1d24-4ee9-bfef-ccc891a9cb2e/full.jpeg").setWidth(150)
            const latex = new LatexBlock("_", "LaTeX", { pos: new Position(0, 500) }, {}).init().new()
            latex.setCode("\\binom{n}{k} = \\frac{n!}{k!(n-k)!}")
            const music = MusicBlock.createByYt("https://www.youtube.com/watch?v=NPBCbTZWnq0", new Position(350, 350))

            this.blocks[logoImage.id] = logoImage
            this.blocks[welcome.id] = welcome
            this.blocks[descText.id] = descText
            this.blocks[image1Image.id] = image1Image
            this.blocks[image2Image.id] = image2Image
            this.blocks[latex.id] = latex
            this.blocks[music.id] = music
            this.ids = [logoImage.id, welcome.id, descText.id, image1Image.id, latex.id, image2Image.id, music.id]
        }

        setInterval(() => {
            save()
        }, 5000)

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

export const castMap = {
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

export function alignVertical(targets, gap) {
    targets = _.sortBy(targets, [(block) => block.geometry.pos.y, (block) => block.geometry.pos.x])
    // Unfortunately, JS classic sort is unstable.
    // Random alignment for blocks with the same x-coordinate is a kind little bit weird...
    // targets.sort((block) => block.geometry.pos.x).sort((block) => block.geometry.pos.y)
    const posX = targets[0].geometry.pos.x
    let posY = targets[0].geometry.pos.y
    targets.forEach((block) => {
        block.setPos(posX, posY)
        posY += block.dom.offsetHeight + gap
    })
}

export function alignHorizontal(targets, gap) {
    targets = _.sortBy(targets, [(block) => block.geometry.pos.x, (block) => block.geometry.pos.y])
    const posY = targets[0].geometry.pos.y
    let posX = targets[0].geometry.pos.x
    targets.forEach((block) => {
        block.setPos(posX, posY)
        posX += block.dom.offsetWidth + gap
    })
}