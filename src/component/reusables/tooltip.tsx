import Image from "next/image"
import { useTranslation } from "next-i18next"
import { FC, ReactNode } from "react"
import { Tooltip } from 'react-tooltip'

type tooltipPlacement = "top" | "topStart" | "topEnd" | "left" | "leftStart" | "leftEnd" | "bottom" | "bottomStart" | "bottomEnd" | "right" | "rightStart" | "rightEnd";

interface TooltipProps {
  id: string;
  tooltipClass?: string;
  triggerJSX?: ReactNode;
  tooltipJSX: ReactNode;
};

export const TooltipTrigger = ({ id, tooltipClass = "helper-tooltip" }: { id: string, tooltipClass?: string }) => (
  <div data-tooltip-id={id}>
    <span className={tooltipClass}>
      ?
    </span>
  </div>
);

const CommonTooltip = ({
  id,
  tooltipClass = "helper-tooltip",
  triggerJSX = <TooltipTrigger {...{ id, tooltipClass }} />,
  tooltipJSX
}: TooltipProps) => (
  <>
    <div data-tooltip-id={id}>
      {triggerJSX}
    </div>
    <Tooltip id={id}>
      {tooltipJSX}
    </Tooltip>
  </>
);

export const ComingSoonTooltip: FC<{ placement: tooltipPlacement, children: ReactNode }> = ({ placement, children }) => {

  const { t } = useTranslation();

  return (
    <>
      <div
        data-tooltip-id="my-tooltip"
        data-tooltip-content={t("tooltip.coming-soon")}
        data-tooltip-place="top"
      >
        {children}
      </div>
      <Tooltip id="comingSoonTip" />
    </>
  );
};

export const MarkDownToolTip: FC<{ placement: tooltipPlacement, size: number }> = ({ placement, size }) => {
  const { t } = useTranslation();
  return (
    <div
      data-tooltip-id="mkdownTip"
      data-tooltip-content={t("tooltip.markdown-supported")}
      data-tooltip-place="top"
    >
      <Image
        src="/markdownLogo.svg"
        alt="Markdown Logo"
        height={size}
        width={size}
        className="mt-2"
      />
      <Tooltip id="mkdownTip" />
    </div>
  )
}

export default CommonTooltip;