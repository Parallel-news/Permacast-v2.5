interface LoadingFormInter {
    justify: string;
    width: string; //w-[25px]
    height: string;
}

export default function LoadingForm(props: LoadingFormInter) {

    const loadingForm = `${props.height} ${props.width} rounded-2xl bg-zinc-700 animate-pulse`
    
    return (
        <div className={`w-full ${props.justify}`} >
            <div className={loadingForm}>
            </div>
        </div>
    )
}