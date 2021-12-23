import { observer } from "mobx-react-lite"
import styled from "styled-components"
import React, { useEffect, useRef, useState } from "react"
import { BiPlay, BiPause } from "react-icons/bi"
import { Position } from "define/basic"
import Marquee from "react-fast-marquee";
import { Howl, Howler } from 'howler';
import { BlocksHolder } from "define/blocks"
import { formatSec } from "utils.js"

const Cover = styled.div`
  border-radius:1000px 0 0  1000px;
  position: relative;
  width:130px;
  height:100px;
  background:${props => props.src ? `url(${props.src})` : "gray"};
  background-position: center;
  flex-shrink: 0;
`

const Player = styled.div`
  flex-grow: 1;
  padding:10px;
  background-color:white;
`
const Progress = styled.div`
  overflow: hidden;
  width:100%;
  height:10px;
  border: red solid 1px;
  border-radius: 1000px;;
`
const Time = styled.div`
  display: flex;
  justify-content: space-between;
  & span{
    font-size: 12px;
  }
`
const Controller = styled.div`
  display: flex;
  justify-content: space-around;
  padding:5px;
`

const PlayNPause = styled.div`
  width:30px;
  height:30px;
  padding:0;
  & svg{
    position: absolute;
    font-size:30px;
    transition:0.3s;
  }
`

export default observer(function Music({ model, isSelected, selectedBlock, draggingBlock }) {
  const ref = useRef(null)
  const info = useRef(null)
  const howl = useRef(null)
  const [loading, setLoading] = useState(true)
  const [duration, setDuration] = useState(0)
  const [seek, setSeek] = useState(0)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    async function doing() {
      const url = model.data.source.url
      fetch(`https://7rs07iiiz2.execute-api.ap-northeast-1.amazonaws.com/default/yt-dl?url=${url}&audio=true`)
        .then((res) => {
          return res.json();
        }).then((res) => {
          Howler.autoUnlock = true
          info.current = res;
          model.setSource({
            url,
            preload: res.formats[0].url,
            thumbnail: res.videoDetails.thumbnails[0].url,
            title: res.videoDetails.title,
          })
          howl.current = new Howl({
            src: [res.formats[0].url],
            html5: true,
            loop: true,
            onload: () => {
              setDuration(howl.current.duration())
              setLoading(false)
            },
            onplay: () => {
              setPlaying(true)
            },
            onpause: () => {
              setPlaying(false)
            },
            preload: "metadata"
          });

          howl.current.play()

        })
    }

    doing()
  }, [])

  useEffect(() => {
    setInterval(() => {
      if (!howl.current) return
      setSeek(howl.current.seek())
    }, 500);
  }, [])

  useEffect(() => {
    if (!howl.current) return
    howl.current.onplay = () => {
      setPlaying(true)
    }
    howl.current.onpause = () => {
      setPlaying(false)
    }
  }, [playing])


  function play() {
    if (howl.current) {
      if (howl.current.playing()) {
        howl.current.pause()
      } else {
        howl.current.play()
      }
    }
  }

  return <div style={{ display: 'flex', width: 400, height: 100, filter: "drop-shadow(0 0 2px #575757)" }}>
    <Cover
      onMouseDown={() => {
        if (isSelected) {
          draggingBlock(true)
          if (selectedBlock().length === 1)
            BlocksHolder.getInstance().sendToFront(model.id)
        }
      }}
      src={model.data.source.thumbnail}
      style={{ filter: `brightness(${loading ? .7 : 1})` }}>
      <div className="spinner"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          opacity: loading ? 1 : 0,
          transition: "0.5s"
        }}>
        <div className="double-bounce1"></div>
        <div className="double-bounce2"></div>
      </div>
    </Cover>
    <Player>
      <Marquee gradientWidth={10} >{model.data.source.title}</Marquee>
      <Time><span>{loading ? "00:00" : formatSec(seek)}</span><span>{loading ? "--:--" : formatSec(duration)}</span></Time>
      <Progress>
        <div style={{
          height: 10,
          width: loading ? "0" : seek / duration * 100 + "%",
          backgroundColor: "red"
        }}>

        </div>
      </Progress>
      <Controller>
        <PlayNPause onClick={play}>
          <BiPlay color="red" style={{ opacity: playing ? 0 : 1 }} />
          <BiPause color="red" style={{ opacity: playing ? 1 : 0 }} />
        </PlayNPause>
      </Controller>
    </Player>
  </div>
})
