import MoonLoader from "react-spinners/MoonLoader"

interface PermaSpinnerInter {
    divClass?: string;
    spinnerClass?: string;
    spinnerColor: string;
    size: number
}

export const PermaSpinner = (props: PermaSpinnerInter) => {
    return (
        <div className={props.divClass}>
            <MoonLoader 
                color={props.spinnerColor}
                className={props.spinnerClass}
                size={props.size} 
            />
        </div>
    )
}