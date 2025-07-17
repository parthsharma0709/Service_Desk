export function Button({ text,onClick, width, hover ,bgColor = "bg-purple-600", padding}){
    return (
        <button className={`${padding} ${width} ${hover}  ${bgColor} text-white border-2 cursor-pointer rounded`} onClick={onClick} >{text}</button>
    )
}