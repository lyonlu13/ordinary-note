import { makeAutoObservable } from "mobx"

export class Test {
    constructor(text) {
        this.text = text;
        makeAutoObservable(this)
    }
    static getInstance(text) {
        if (!this.instance) {
            this.instance = new Test(text);
        }
        return this.instance;
    }
    setText(text) {
        this.text = text;
    }
    getText() {
        return this.text
    }
}