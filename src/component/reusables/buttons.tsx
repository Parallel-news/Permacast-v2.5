
import { useTranslation } from 'next-i18next';
import { FC, MouseEventHandler, ReactElement } from 'react';

interface DescriptionButtonInter {
    icon: ReactElement<any, any>;
    text: string;
    color: string;
    onClick?: MouseEventHandler<HTMLDivElement>;
};

const descriptionButtonStyling = `flex flex-row items-center normal-case rounded-full border-0 p-2 px-2 sm:px-2.5 bg-gray-400/30 cursor-pointer w-fit `;

export const DescriptionButton: FC<DescriptionButtonInter> = ({ color, icon, text, onClick }) => {
    const { t } = useTranslation();
    if (icon && text && color) return (
        <div className={descriptionButtonStyling} style={{ color: color, backgroundColor: "grey" }} onClick={onClick}>
            {icon}<span className="font-semibold text-base whitespace-nowrap">{text}</span>
        </div>
    );
};