import React, { FC } from 'react';
import { HeartIcon } from '@heroicons/react/24/solid';

import { dimColorString } from '../../utils/ui';
import { useTranslation } from 'next-i18next';
import { useRecoilState } from 'recoil';
import { currentThemeColorAtom } from '../../atoms';
import { flexCenter, viewANSButtonStyling } from '../creator/featuredCreators';

interface TipButtonProps {
  openModalCallback: () => void;
};

const TipButton: FC<TipButtonProps> = (props) => {
  
  const { openModalCallback } = props;
  const { t } = useTranslation();
  const [currentThemeColor, setCurrentThemeColor] = useRecoilState(currentThemeColorAtom);

  return (
    <button
      className={viewANSButtonStyling + flexCenter}
      style={{backgroundColor: dimColorString(currentThemeColor, 0.1), color: currentThemeColor}}
      onClick={() => openModalCallback()}
    >
      <span>{t("tip")}</span>
      <HeartIcon className="ml-2 w-4 h-4" />
    </button>
  );
};

export default TipButton;