
import { useTranslation } from 'next-i18next';
import { ReactElement } from 'react';

interface DescriptionButtonInter {
    icon: ReactElement<any, any>;
    text: string;
    color: string;
}

export const DescriptionButton = (props: DescriptionButtonInter) => {
    const { t } = useTranslation();
    return (
        <div className="tooltip" data-tip="Coming soon!">
            <div className="flex flex-row items-center normal-case rounded-full border-0 p-2 px-2.5 bg-gray-400/30" style={{color: props.color, backgroundColor: "grey"}} onClick={() => alert("tip")}>
                {props.icon}<span className="font-semibold text-base">{props.text}</span>
            </div>
        </div>
    )
}