import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import { ArrayBlock, BlocksHolder, MusicBlock, TextBlock } from 'define/blocks';
import { LatexBlock } from './../../define/blocks';
import { Position } from 'define/basic';

const blocksHolder = BlocksHolder.getInstance()

export function CommandBar() {
    const [text, setText] = useState("");
    const [display, setDisplay] = useState([]);
    const triggered = useRef(false)

    useEffect(() => {
        const splits = text.split(" ")
        const raw = splits.map((s, k) => {
            if (s[0] === "/" && k === 0) return <Command>{s}</Command>
            //blocksHolder.id            
            if (s[0] === "$") {
                if (blocksHolder.ids.includes(s.replace("$", "")))
                    return <ID>{s}</ID>
                else return <WrongID>{s}</WrongID>
            }
            if (s === "*") {
                return <All>{s}</All>
            }
            return s
        })
        const result = []
        raw.forEach(e => {
            result.push(e)
            result.push(" ")
        });
        setDisplay(result)
    }, [text])

    function trigger() {
        triggered.current = true
        if (text[0] === "/") {
            execute(text)
        } else {
            blocksHolder.new(
                new TextBlock(null,
                    "",
                    {
                        pos: { x: 0, y: 0 }
                    },
                    {
                        text: text
                    }
                ).init())
        }
    }

    function execute(command) {
        const parts = command.split(" ")
        switch (parts[0].replace("/", "")) {
            case "text": {
                parts.splice(0, 1)
                let arg = parts.join(" ")
                blocksHolder.new(
                    new TextBlock(null,
                        "",
                        {
                            pos: { x: 0, y: 0 }
                        },
                        {
                            text: arg
                        }
                    ).init())
                break
            }
            case "latex": {
                parts.splice(0, 1)
                let arg = parts.join(" ") || "LaTeX"
                blocksHolder.new(
                    new LatexBlock(null,
                        "",
                        {
                            pos: { x: 0, y: 0 }
                        },
                        {
                            code: arg
                        }
                    ).init())
                break
            }
            case "array": {
                parts.splice(0, 1)
                let arg = parts.join(" ") || "[]"
                try {
                    const obj = JSON.parse(arg)
                    blocksHolder.new(new ArrayBlock("",
                        "",
                        { pos: { x: 0, y: 0 } },
                        { array: Array.isArray(obj) ? obj : obj.keys.map((k) => obj[k]) }
                    ).init())

                } catch (e) {
                    console.log(e);
                }
                break
            }
            case "youtube":
            case "yt": {
                parts.splice(0, 1)
                let arg = parts.join(" ")
                blocksHolder.new(MusicBlock.createByYt(arg, new Position(0, 0)))
                break
            }
            default: break
        }
    }


    return <Frame>
        <Input
            spellCheck="false"
            contentEditable="plaintext-only"
            onKeyPress={(e) => {
                if (e.key === "Enter") {
                    trigger()
                }
            }}
            onInput={(e) => {
                if (triggered.current) {
                    triggered.current = false
                    e.target.innerHTML = ""
                    setText("")
                } else
                    setText(e.target.innerHTML)
            }}
            onPaste={(e) => {
                e.stopPropagation()
                var pastedText = undefined;
                if (window.clipboardData && window.clipboardData.getData) { // IE
                    pastedText = window.clipboardData.getData('Text');
                } else if (e.clipboardData && e.clipboardData.getData) {
                    pastedText = e.clipboardData.getData('text/plain');
                }
                const processed = pastedText.match(/(\r\n|\n|\r)/gm, "")

                if (processed)
                    e.preventDefault()
            }}
        >
        </Input>
        <InputFrame>
            {display}
        </InputFrame>
    </Frame>;
}

const Frame = styled.div`
            position: absolute;
            z-index:3;
            bottom:0;
            width:100vw;
            height:40px;
            font-family:monospace;
            `
const InputFrame = styled.div`
            position: absolute;
            width:100%;
            height:40px;
            padding:10px;
            background-color:#00000022;
            font-size:18px;
            top:0;
            `
const Input = styled.div`
            position: absolute;
            padding:10px;
            width:100%;
            top:0;
            font-size:18px;
            outline: none;
            border:none;
            background-color: transparent;
            color:transparent;
            z-index:2;
            caret-color:black;
            `

const Command = styled.span`
            font-weight:bold;
            color:#00A7F5;
            `

const ID = styled.span`
         background-color:#F5D000;
        border-radius:2px;
        color:white;
            `

const WrongID = styled.span`
text-decoration: wavy underline red;
`

const All = styled.span`
        background-color:#0072F5;
        border-radius:2px;
        color:white;
 `