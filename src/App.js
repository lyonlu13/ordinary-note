import styled from 'styled-components';
import BackPatten from "components/BackPatten";
import { useEffect, useRef, useState } from 'react';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import { observer } from "mobx-react-lite" // Or "mobx-react".
import { Test } from 'define/test';
import { BlocksHolder, TextBlock } from 'define/blocks';
import { Position } from 'define/basic';
import Detector from 'Blocks';

const Touch = styled.div`
  position:absolute;
  top:0;
  left:0;
  width:100vw;
  height:100vh;
  z-index:1;
  cursor: ${props => props.isHold ? "grabbing" : "auto"};
  
`

const Display = styled.div`
  position:absolute;
  top:20px;
  right:20px;
  width:200px;
  height:80px;
  z-index:2;
  background-color: gray;
  overflow: hidden;
`

const blocksHolder = BlocksHolder.getInstance()


const WorkSpace = observer(({ offsetX, offsetY, zoom, ids, zooming }) =>
  <>
    {ids.map((id) =>
      <Detector
        offsetX={offsetX}
        offsetY={offsetY}
        zoom={zoom}
        id={id} />)}
  </>)


function App() {
  const [offsetX, setOffsetX] = useState(500);
  const [offsetY, setOffsetY] = useState(100);
  const [zoom, setZoom] = useState(1);
  const [isHold, setHold] = useState(false);

  const originOffset = useRef({ x: 0, y: 0 })
  const originMouse = useRef({ x: 0, y: 0 })
  const ref = useRef(null)
  const ref2 = useRef(null)

  const st = Test.getInstance("Yes");



  function mouseMove(e) {
    if (isHold) {
      window.requestAnimationFrame(() => {
        setOffsetX(originOffset.current.x - (originMouse.current.x - e.clientX))
        setOffsetY(originOffset.current.y - (originMouse.current.y - e.clientY))
      });

    }
  }

  function mouseDown(e) {
    if (e.buttons === 4) {
      originOffset.current.x = offsetX
      originOffset.current.y = offsetY
      originMouse.current.x = e.clientX
      originMouse.current.y = e.clientY
      setHold(true)
    }
  }

  function dragEnd() {
    setHold(false)
  }

  function zooming(e) {
    e = e || window.event
    if (e.deltaY > 0) {
      if (zoom > 0.5) {
        let after = zoom - 0.1

        // let gapX = e.clientX * after - e.clientX * zoom
        // let gapY = e.clientY * after - e.clientY * zoom
        // setOffsetX(offsetX - gapX)
        // setOffsetY(offsetY - gapY)
        setZoom(after)
      }
    } else {
      if (zoom < 2) {
        let after = zoom + 0.1

        // let gapX = e.clientX * after - e.clientX * zoom
        // let gapY = e.clientY * after - e.clientY * zoom
        // setOffsetX(offsetX - gapX)
        // setOffsetY(offsetY - gapY)
        setZoom(after)
      }
    }
  }

  useEffect(() => {
    document.onpaste = (evt) => {
      const dT = evt.clipboardData || window.clipboardData;
      const file = dT.files[0];
      console.log(dT.types);
      console.log(file);
      dT.items[0].getAsString((txt) => { console.log(txt) })
      if (file) {

      }
      //console.log(URL.createObjectURL(file));
      if (file) {
        if (file.type.startsWith('image/'))
          ref2.current.src = URL.createObjectURL(file)
        if (file.type.startsWith('audio/'))
          ref.current.src = URL.createObjectURL(file)
      }
    };
  }, [])

  return (
    <>
      <BackPatten type="grid" offsetX={offsetX} offsetY={offsetY} option={{ size: 30 * zoom, groupSize: 20 }} />
      <WorkSpace
        zooming={zooming}
        offsetX={offsetX}
        offsetY={offsetY}
        zoom={zoom}
        ids={blocksHolder.ids}
      />
      <Touch
        onWheel={zooming}
        isHold={isHold}
        onMouseDown={mouseDown}
        onMouseUp={dragEnd}
        onMouseMove={mouseMove} />
      {/* <Block
          x={30}
          y={0}
          offsetX={offsetX}
          offsetY={offsetY}
          zoom={zoom}
          color={"#00a2ff"}
          label={"Audio"}
        >
          <audio ref={ref} src="file:///D:\Users\Lyon\Desktop\test.mp3" controls="true"></audio>
        </Block>

        <Block
          x={300}
          y={150}
          offsetX={offsetX}
          offsetY={offsetY}
          zoom={zoom}
          color={"#ff008c"}
          label={"Text Area"}
        >
          <textarea name="" id="" cols="30" rows="10">
            I am invisible!!!!!!!
          </textarea>
        </Block>

        <Block
          x={200}
          y={400}
          offsetX={offsetX}
          offsetY={offsetY}
          zoom={zoom}
          color={"#7700ff"}
          label={"Text Area"}
        >
          <Input storage={st} />
          <Text storage={st} />
        </Block>

        <Block
          x={-330}
          y={90}
          offsetX={offsetX}
          offsetY={offsetY}
          zoom={zoom}
          color={"#00a808"}
          label={"LaTeX"}
        >
          <BlockMath math="\displaystyle \frac{1}{\Bigl(\sqrt{\phi \sqrt{5}}-\phi\Bigr) e^{\frac25 \pi}} = 1+\frac{e^{-2\pi}} {1+\frac{e^{-4\pi}} {1+\frac{e^{-6\pi}} {1+\frac{e^{-8\pi}} {1+\cdots} } } }" />
        </Block>

        <Block
          x={-300}
          y={260}
          offsetX={offsetX}
          offsetY={offsetY}
          zoom={zoom}
          color={"#ffc400"}
          label={"Image"}
        >
          <img ref={ref2} width="400" src="https://www.mirrormedia.com.tw/assets/images/20210811183042-492063c52c4c70e0ffe94db30f8395b8-mobile.jpg" alt="" />        </Block>
     
      */}


      <Display>({offsetX},{offsetY})<br />{zoom}</Display>

    </>
  );
}

export default App;
