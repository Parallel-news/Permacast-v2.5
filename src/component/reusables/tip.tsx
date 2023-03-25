import React, { FC, useContext } from 'react';
import { HeartIcon } from '@heroicons/react/24/solid';

import { dimColorString, getButtonRGBs } from '../../utils/ui';
import { useTranslation } from 'next-i18next';
import { useRecoilState } from 'recoil';
import { currentThemeColor } from '../../atoms';

interface TipButtonProps {
  address: string
};

const TipButton: FC<TipButtonProps> = (props) => {
  
  const { address } = props;
  const { t } = useTranslation();
  console.log('tipbutton', t)
  console.log('tipbutton text', t("creator:tip"))
  const [currentThemeColor_, setCurrentThemeColor_] = useRecoilState(currentThemeColor);

  const tipPrompt = () => {
    console.log(address);
  }

  return (
    <div className="tooltip" data-tip="Coming soon!">
      <button
        disabled
        className="btn btn-outline btn-sm normal-case rounded-full border-0 min-w-max"
        style={{backgroundColor: dimColorString(currentThemeColor_, 0.1), color: currentThemeColor_}}
        onClick={() => tipPrompt()}
      >
        <HeartIcon className="mr-2 w-4 h-4" />
        <span className="font-normal">{t("tip")}</span>
      </button>
    </div>
  );
};

export default TipButton;