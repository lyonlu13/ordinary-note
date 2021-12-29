import iconList from "./list.js"

export default function Icon({ icon, color, size, style, onClick }) {
    const Selected = iconList[icon];
    console.log(Selected);
    return Selected && <Selected style={{
        fill: color,
        fontSize: size,
        ...style
    }} onClick={onClick} />
}