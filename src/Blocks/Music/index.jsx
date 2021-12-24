import { observer } from "mobx-react-lite"
import styled from "styled-components"
import React, { useEffect, useRef, useState } from "react"
import { BiPlay, BiPause, } from "react-icons/bi"
import { BsDiscFill } from "react-icons/bs"
import { IoRepeatSharp } from "react-icons/io5"
import Marquee from "react-fast-marquee";
import { Howl, Howler } from 'howler';
import { BlocksHolder } from "define/blocks"
import { formatSec } from "utils/format.js"

const Cover = styled.div`
  border-radius:1000px 0 0 1000px;
  position: relative;
  width:130px;
  height:100px;
  background-position: center !important;
  flex-shrink: 0;
`

const Player = styled.div`
  width: calc(100% - 130px);
  flex-grow: 1;
  padding:10px;
  background-color:white;
`
const Progress = styled.div`
  overflow: hidden;
  width:100%;
  height:5px;
  background-color:#ffeded;
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

const Toggle = styled.div`
  position: relative;
  width:30px;
  height:30px;
  padding:0;
  & svg{
    position: absolute;
    transition:0.3s;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
  }
`

const Space = styled.div`
  width:30px;
`

export default observer(function Music({ model, isSelected, selectedBlock, draggingBlock }) {
  // const ref = useRef(null)
  const [loading, setLoading] = useState(true)
  const [duration, setDuration] = useState(0)
  const [seek, setSeek] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [loop, setLoop] = useState(false)

  useEffect(() => {

    function initHowl(url, fallback) {
      model.howl = new Howl({
        src: [url],
        html5: true,
        onload: () => {
          setDuration(model.howl.duration())
          setLoading(false)
        },
        onplay: () => {
          setPlaying(true)
        },
        onpause: () => {
          setPlaying(false)
        },
        onloaderror: (id, e) => {
          if (id) {
            console.log(id, e);
            fallback()
          }
        },
        onend: () => {
          if (!model.howl.loop()) {
            setPlaying(false)
          }
        },
        preload: "metadata"
      });

      model.howl.play()
      model.onDelete = () => {
        if (model.howl)
          model.howl.stop()
      }
    }

    async function doing() {

      Howler.autoUnlock = true
      const url = model.data.source.url
      if (model.data.type === "yt") {
        initHowl(model.data.source.preload, () => {
          fetch(`https://7rs07iiiz2.execute-api.ap-northeast-1.amazonaws.com/default/yt-dl?url=${url}&audio=true`)
            .then((res) => {
              return res.json();
            }).then((res) => {
              model.setSource({
                url,
                preload: res.formats[0].url,
                thumbnail: res.videoDetails.thumbnails[2].url,
                title: res.videoDetails.title,
              })
              initHowl(res.formats[2].url)
            })
        })
      } else if (model.data.type === "url") {
        initHowl(url)
      }

    }
    if (!model.howl)
      doing()
  }, [model])

  useEffect(() => {
    const id = setInterval(() => {
      if (!model.howl) return
      setSeek(model.howl.seek())
    }, 500);
    return () => {
      clearInterval(id)
    }
  }, [model.howl])

  useEffect(() => {
    if (!model.howl) return
    model.howl.onplay = () => {
      setPlaying(true)
    }
    model.howl.onpause = () => {
      setPlaying(false)
    }
  }, [model.howl, playing])


  function playToggle() {
    if (model.howl) {
      if (model.howl.playing()) {
        model.howl.pause()
      } else {
        model.howl.play()
      }
    }
  }

  function loopToggle() {
    if (model.howl) {
      if (model.howl.loop()) {
        model.howl.loop(false)
      } else {
        model.howl.loop(true)
      }
      setLoop(model.howl.loop())
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
      style={{
        filter: `brightness(${loading ? .7 : 1})`,
        background: model.data.source.thumbnail ? `url(${model.data.source.thumbnail})` : (model.data.type === 'yt' ? "gray" : model.info.color)
      }}>
      {model.data.type === "yt" ? <Loading show={loading ? 1 : 0} /> : <DiskIcon rotate={playing} />}
    </Cover>
    <Player>
      <Marquee gradientWidth={10} >{loading ? "載入音樂中" : (model.data.type === "yt" ? model.data.source.title : model.data.source.url)}<Space /></Marquee>
      <Time><span>{loading ? "00:00" : formatSec(seek)}</span><span>{loading ? "--:--" : formatSec(duration)}</span></Time>
      <Progress>
        <div style={{
          height: 10,
          width: loading ? "0" : seek / duration * 100 + "%",
          backgroundColor: model.info.color,
        }}>
        </div>
      </Progress>
      <Controller>
        <Toggle
          onClick={playToggle}
          style={{
            opacity: loading ? 0.5 : 1,
            cursor: loading ? "auto" : "pointer",
            pointerEvents: loading ? "none" : "auto"
          }}>
          <BiPlay color={model.info.color}
            size={30} style={{ opacity: playing ? 0 : 1 }} />
          <BiPause color={model.info.color}
            size={30} style={{ opacity: playing ? 1 : 0 }} />
        </Toggle>
        <Toggle style={{ opacity: loop ? 1 : 0.3, cursor: loading ? "auto" : "pointer" }} >
          <IoRepeatSharp
            onClick={loopToggle}
            color={model.info.color}
            size={25} />
        </Toggle>
      </Controller>
    </Player>
  </div >
})

function Loading({ show }) {
  return <div className="spinner"
    style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%,-50%)",
      opacity: show,
      transition: "0.5s"
    }}>
    <div className="double-bounce1"></div>
    <div className="double-bounce2"></div>
  </div>
}

function DiskIcon({ rotate }) {
  return <span style={{
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%,-50%)",
  }}>
    <BsDiscFill
      style={{
        animation: "spin 4s linear infinite",
        animationPlayState: rotate ? "" : "paused",
        transition: "0.3s"
      }} size={50}
      color={rotate ? "white" : "#ddd"} />
  </span>
}