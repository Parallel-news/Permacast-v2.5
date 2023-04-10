import { FC } from "react";
import { useTranslation } from "next-i18next";
import { Tooltip } from '@nextui-org/react';
import { CheckIcon } from "@heroicons/react/24/solid";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { flexCenter } from "../creator/featuredCreators";
import { flexCol } from "../creator";
import { dimColorString, isTooDark, RGBstringToObject } from "../../utils/ui";
import { rFull } from "../creator/edit";

interface VerificationInterface {
  size: number;
  ANSuserExists: boolean;
  includeText?: boolean;
};

export const VerificationButtonStyling = rFull + `p-1.5 text-lg font-medium `;
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
      <div className={flexCol}>
        <div className={LargeBoldFontStyling}>{t("creator.verification.verified.text")}</div>
        <div className={ExplanationTextStyling}>{t("creator.verification.verified.explanation")}</div>
      </div>
    );
  };

  const UserNotVerified = () => {
    const { t } = useTranslation();
    return (
      <div className={flexCol}>
        <div className={LargeBoldFontStyling}>{t("creator.verification.unverified.text")}</div>
        <div className={ExplanationTextStyling + "max-w-[200px] "}>{t("creator.verification.unverified.explanation")}</div>
      </div>
    );
  };

  const Icon: FC<VerificationInterface> = ({ size, ANSuserExists }) => (
    <div className={rFull}>
      {ANSuserExists ? <CheckIcon {...{ style }} className="text-emerald-500" /> : <XCircleIcon {...{ style }} className="text-red-500" />}
    </div>
  );

  const color = ANSuserExists ? 'rgb(16, 185, 129)' : "rgb(239, 68, 68)";
  const colorWhite = 'rgb(255, 255, 255)';
  const colorBlack = 'rgb(0, 0, 0)';

  return (
    <Tooltip
      rounded
      color="invert"
      className={`flex items-center ` + VerificationButtonStyling + "gap-x-1 "}
      style={{
        backgroundColor: dimColorString(color, 0.25),
        color: isTooDark(RGBstringToObject(color), 0.2) ? colorBlack : colorWhite ,
      }}
      content={ANSuserExists ? <UserVerified /> : <UserNotVerified />
    }>
      <Icon {...{ size, ANSuserExists }} />
      {includeText && <p>{ANSuserExists ? t("creator.verification.verified.text"): t("creator.verification.unverified.text")}</p>}
    </Tooltip>
  );
};

export default Verification;