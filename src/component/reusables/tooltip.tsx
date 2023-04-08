import { FC, ReactNode } from "react";
import { Tooltip } from '@nextui-org/react';
import { useTranslation } from "next-i18next";
import Image from "next/image";

type tooltipPlacement = "top" | "topStart" | "topEnd" | "left" | "leftStart" | "leftEnd" | "bottom" | "bottomStart" | "bottomEnd" | "right" | "rightStart" | "rightEnd";


export const ComingSoonTooltip: FC<{ placement: tooltipPlacement, children: ReactNode }> = ({ placement,children }) => {
  
  const { t } = useTranslation();

  return (
    <Tooltip
      rounded
      placement={placement}
      color="invert"
      content={t("tooltip.coming-soon")}
    >
      {children}
    </Tooltip>  
  );
};

export const MarkDownToolTip: FC<{placement: tooltipPlacement, size:number }> = ({placement, size}) => {
  const { t } = useTranslation();
  return (
    <Tooltip
      rounded
      placement={placement}
      color="invert"
      content={t("tooltip.markdown-supported")}
    >
        <Image 
            src="/markdownLogo.svg"
            alt="Markdown Logo"
            height={size}
            width={size}
            className="mt-2"
        />
    </Tooltip>
  )
}