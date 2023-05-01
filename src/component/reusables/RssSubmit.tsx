
import { MouseEventHandler, ReactElement } from "react";


interface RssSubmitButtonInter {
    icon: ReactElement<any, any>;
    color: string;
    dimensions: string; //h-10 w-10
    onClick?: () => void;
};

export default function RssSubmit(props: RssSubmitButtonInter) {
    return (
        <button 
            style={{color: "#27272a"}}
            className={`rounded-full flex items-center justify-center ${props.color} ${props.dimensions}`} 
            onClick={props.onClick}
        >
            {props.icon}
        </button>
    )
}