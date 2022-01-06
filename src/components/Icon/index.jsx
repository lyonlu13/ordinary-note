import iconList from "./list.js"

export default function Icon({ icon, color, size, style, onClick }) {
    const Selected = iconList[icon];
    return Selected ? <Selected style={{
        fill: color,
        width: size,
        height: size,
        ...style
    }} onClick={onClick} /> : ""
}