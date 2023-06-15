import { FC } from "react";
import { Tooltip } from 'react-tooltip'
import { useTranslation } from "next-i18next";

import { dimColorString, isTooDark, RGBstringToObject } from "@/utils/ui";
import { Icon } from "../icon";


interface VerificationInterface {
  size: number;
  ANSuserExists: boolean;
  includeText?: boolean;
  iconElem?: { style: { width: number; height: number; }; className: string; icon: string; }
  icon?: "CHECK"
};

export const VerificationButtonStyling = `rounded-full p-1.5 text-lg font-medium `;
export const ExplanationTextStyling = "text-gray-500 text-sm ";
export const LargeBoldFontStyling = "text-lg font-bold ";

const Verification: FC<VerificationInterface> = (props) => {
  const { t } = useTranslation();
  const { ANSuserExists, includeText } = props;
  const size = props.size || 24;
  const style = { width: size, height: size };

  const UserVerified = () => {
    const { t } = useTranslation();
    return (
      <div className={`flexCol`}>
        <div className={LargeBoldFontStyling}>{t("creator.verification.verified.text")}</div>
        <div className={ExplanationTextStyling}>{t("creator.verification.verified.explanation")}</div>
      </div>
    );
  };

  const UserNotVerified = () => {
    const { t } = useTranslation();
    return (
      <div className={`flexCol`}>
        <div className={LargeBoldFontStyling}>{t("creator.verification.unverified.text")}</div>
        <div className={ExplanationTextStyling + "max-w-[200px] "}>{t("creator.verification.unverified.explanation")}</div>
      </div>
    );
  };

  const IconElem: FC<any> = ({ size, ANSuserExists }) => (
    <div className={`rounded-full `}>
      {ANSuserExists ? <Icon style={style} className="text-emerald-500" icon="CHECK" /> : <Icon style={style} className="text-red-500" icon="XCIRCLE"/>}
    </div>
  );

  const color = ANSuserExists ? 'rgb(16, 185, 129)' : "rgb(239, 68, 68)";
  const colorWhite = 'rgb(255, 255, 255)';
  const colorBlack = 'rgb(0, 0, 0)';

  return (
    <>
      <div
        className={`flex items-center ` + VerificationButtonStyling + "gap-x-1 "}
        style={{
          backgroundColor: dimColorString(color, 0.25),
          color: isTooDark(RGBstringToObject(color), 0.2) ? colorBlack : colorWhite ,
        }}
        data-tooltip-content={ANSuserExists ? "Verified" : "Not Verified"}
        data-tooltip-id="verifiedTip"
      >
        <IconElem {...{ size, ANSuserExists }} />
        {includeText && <p>{ANSuserExists ? t("creator.verification.verified.text"): t("creator.verification.unverified.text")}</p>}
      </div>
      <Tooltip id="verifiedTip" />  
    </>
  );
};

export default Verification;
