
import { useTranslation } from 'next-i18next';
import { FC, MouseEventHandler, ReactElement } from 'react';

interface DescriptionButtonInter {
    icon: ReactElement<any, any>;
    text: string;
    color: string;
    onClick?: MouseEventHandler<HTMLDivElement>;
};

const descriptionButtonStyling = `flex flex-row items-center justify-center normal-case rounded-full border-0 p-2 px-2 sm:px-2.5 bg-gray-400/30 cursor-pointer w-[20px] h-[40px] `;

export const DescriptionButton: FC<DescriptionButtonInter> = ({ color, icon, text, onClick }) => {
    if (icon && color) return (
        <div className={descriptionButtonStyling} style={{ color: color, backgroundColor: "grey" }} onClick={onClick}>
            {icon}{text && (<span className="font-semibold text-base whitespace-nowrap">{text}</span>)}
        </div>
    );
};