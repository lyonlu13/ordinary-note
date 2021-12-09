import styled from 'styled-components';

const General = props => `
  position:absolute;
  top:0;
  left:0;
  width:100vw;
  height:100vh;
  background: ${props.bgColor};
  z-index:0;
`

const Blank = styled.div`
   ${General}
`

const Grid = styled.div`
 ${General}
  background-image:${props => `
      linear-gradient(${props.gridColor} 1px, transparent 0),
      linear-gradient(90deg, ${props.gridColor} 1px, transparent 0),
      linear-gradient(${props.gridColor} 2px, transparent 0),
      linear-gradient(90deg, ${props.gridColor} 2px, transparent 0)`};
`

const Line = styled.div`
${General}
  background-image:${props => `linear-gradient(${props.lineColor} ${props.lineWidth}px, transparent 0)`};
  background-size: ${props => `${props.space}px ${props.space}px, ${props.space}px ${props.space}px`};
`

export default function BackPatten({ type = "blank", color = "white", offsetX = 0, offsetY = 0, option }) {
  switch (type) {
    case "blank":
      return (<Blank
        bgColor={color}
        offsetX={offsetX}
        offsetY={offsetY}
        style={{
          backgroundPositionX: offsetX,
          backgroundPositionY: offsetY
        }} />)
    case "line":
      return (<Line
        bgColor={color}
        offsetX={offsetX}
        offsetY={offsetY}
        space={option?.space || 30}
        lineWidth={option?.width || 1}
        lineColor={option?.lineColor || "lightgray"}
        style={{
          backgroundPositionX: offsetX,
          backgroundPositionY: offsetY
        }} />)
    case "grid":
      return (
        <Grid bgColor={color} offsetX={offsetX} offsetY={offsetY} gridColor={option?.gridColor || "#e0e0e0"} style={{
          backgroundPositionX: offsetX,
          backgroundPositionY: offsetY,
          backgroundSize:
            `${option?.size || 30}px ${option?.size || 30}px, 
          ${option?.size || 30}px ${option?.size || 30}px, 
          ${(option?.size || 30) * (option?.groupSize || 5)}px ${(option?.size || 30) * (option?.groupSize || 5)}px,
           ${(option?.size || 30) * (option?.groupSize || 5)}px ${(option?.size || 30) * (option?.groupSize || 5)}px`
        }} />)
    default:
      return (
        <Blank bgColor={color} offsetX={offsetX} offsetY={offsetY} style={{
          backgroundPositionX: offsetX,
          backgroundPositionY: offsetY
        }} />)
  }

}
