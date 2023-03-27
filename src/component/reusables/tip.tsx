import React, { FC, useContext } from 'react';
import { HeartIcon } from '@heroicons/react/24/solid';

import { dimColorString, getButtonRGBs } from '../../utils/ui';
import { useTranslation } from 'next-i18next';
import { useRecoilState } from 'recoil';
import { currentThemeColorAtom } from '../../atoms';

interface TipButtonProps {
  address: string
};

const TipButton: FC<TipButtonProps> = (props) => {
  
  const { address } = props;
  const { t } = useTranslation();
  const [currentThemeColor, setCurrentThemeColor] = useRecoilState(currentThemeColorAtom);

  const tipPrompt = () => {
    console.log(address);
  }
  // add modal to exercise caution tipping to unverified creators

  return (
    <div className="tooltip" data-tip="Coming soon!">
      <button
        disabled
        className="btn btn-outline btn-sm normal-case rounded-full border-0 min-w-max"
        style={{backgroundColor: dimColorString(currentThemeColor, 0.1), color: currentThemeColor}}
        onClick={() => tipPrompt()}
      >
        <HeartIcon className="mr-2 w-4 h-4" />
        <span className="font-normal">{t("tip")}</span>
      </button>
    </div>
  );
};

export default TipButton;