interface blurInter {
    blurClass?: string;
}
const blurStyling = "absolute inset-0 bg-zinc-800 opacity-75 blur"
export const Blur = (props: blurInter) => {
    return (
        <div className={blurStyling+" "+props.blurClass}></div> 
    )
}

