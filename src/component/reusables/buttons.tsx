
import { useTranslation } from 'next-i18next';
import { MouseEventHandler, ReactElement } from 'react';

interface DescriptionButtonInter {
    icon: ReactElement<any, any>;
    text: string;
    color: string;
    onClick?: MouseEventHandler<HTMLDivElement>;
}

export const DescriptionButton = (props: DescriptionButtonInter) => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-row items-center normal-case rounded-full border-0 p-2 px-2 sm:px-2.5 bg-gray-400/30 cursor-pointer w-fit" style={{color: props.color, backgroundColor: "grey"}} onClick={props.onClick}>
            {props.icon}<span className="font-semibold text-base">{props.text}</span>
        </div>
    )
}