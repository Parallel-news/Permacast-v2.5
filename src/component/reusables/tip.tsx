
import { Icon } from '../icon';
import React, { FC } from 'react'
import { useRecoilState } from 'recoil';
import { useTranslation } from 'next-i18next';
import { dimColorString } from '../../utils/ui';
import { currentThemeColorAtom } from '../../atoms';
import { viewANSButtonStyling } from '../creator/featuredCreators';

interface TipButtonProps {
  openModalCallback: () => void;
};

const TipButton: FC<TipButtonProps> = (props) => {
  
  const { openModalCallback } = props;
  const { t } = useTranslation();
  const [currentThemeColor, ] = useRecoilState(currentThemeColorAtom);

  return (
    <button
      className={viewANSButtonStyling + `flex items-center `}
      style={{backgroundColor: dimColorString(currentThemeColor, 0.1), color: currentThemeColor}}
      onClick={() => openModalCallback()}
    >
      <Icon className="mr-2 w-4 h-4" icon="HEART" fill="currentColor"/>
      <span>{t("tip")}</span>
    </button>
  );
};

export default TipButton;