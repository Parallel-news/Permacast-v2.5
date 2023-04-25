import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { FC, useEffect, useState } from 'react';
import { useArconnect, shortenAddress } from 'react-arconnect';
import { useRecoilState } from 'recoil';
import { ArrowLeftOnRectangleIcon, BanknotesIcon, NewspaperIcon, UserCircleIcon } from '@heroicons/react/24/outline';

import { PASoMProfileAtom, arweaveAddress } from '../../atoms';
import { APP_LOGO, APP_NAME, PERMISSIONS } from '../../constants/arconnect';
import { ProfileImage } from '../creator/reusables';
import { ANS_TEMPLATE } from '../../constants/ui';
import { EverPayBalance } from '../../utils/everpay/EverPayBalance';
import { PASoMProfile } from '../../interfaces/pasom';
import { ARSEED_URL } from '../../constants';
import {
  Dropdown,
  ExtendedDropdownButtonProps,
  openMenuButtonClass as prevButtonClass,
  dropdownMenuClass as prevMenuClass,
  menuItemClass
} from '../reusables';



export const ArConnectButtonStyling = `h-12 btn-base-color items-center flex px-3 justify-center text-sm md:text-base normal-case default-no-outline-ringed default-animation hover:text-white focus:text-white disabled:text-zinc-400 disabled:bg-zinc-700 disabled:cursor-auto `;

export const ConnectArconnect: FC<{ className: string }> = ({ className }) => {
  const { t } = useTranslation();

  const { arconnectConnect } = useArconnect();

  const connect = () => arconnectConnect(PERMISSIONS, { name: APP_NAME, logo: APP_LOGO });

  return (
    <button 
      className={className}
      onClick={connect}
    >
      {t("wallet.arconnect.login")}
    </button>
  )
};


const connectButtonStyling = `w-full h-12 hover:bg-zinc-700 bg-zinc-900 rounded-full items-center flex px-1 justify-center mx-auto default-no-outline-ringed default-animation z-0 `;
const avatarStyling = `rounded-full h-6 w-6 overflow-hidden border-[2px] min-w-min `;
const iconSize = `w-6 h-6 `;

const ArConnect: FC = () => {
  const { t } = useTranslation();

  const [PASoMProfile, setPASoMProfile] = useRecoilState(PASoMProfileAtom);
  const [_, setArweaveAddress_] = useRecoilState(arweaveAddress);

  const {
    walletConnected,
    address,
    ANS,
    arconnectConnect,
    arconnectDisconnect
  } = useArconnect();

  const { currentLabel, avatar: ANSAvatar, address_color } = ANS || ANS_TEMPLATE;
  const avatar = PASoMProfile?.avatar || ANSAvatar;

  const fetchPASoM = async () => {
    const state = (await axios.get('/api/exm/PASoM/read')).data;
    const profiles: PASoMProfile[] = state.profiles;
    const profile = profiles.find((profile: PASoMProfile) => profile.address === address);
    setPASoMProfile(profile);
  };

  useEffect(() => {
    if (address && address.length > 0) {
      fetchPASoM();
      setArweaveAddress_(address);
    };
  }, [address, walletConnected]);


  const target = "_blank";
  const rel = "noreferrer noopener";

  const Everpay: FC = () => (
    <a {...{ target, rel }} href={"https://app.everpay.io"} className={`flexFullCenterGap `}>
      <BanknotesIcon className={iconSize} />
      {t("wallet.arconnect.everpay")}
    </a>
  );

  const Profile: FC = () => (
    <Link href={`/creator/` + ANS?.currentLabel || address} className={`flexFullCenterGap `}>
      <UserCircleIcon className={iconSize} />
      {t("wallet.arconnect.profile")}
    </Link>
  );

  const Arpage: FC = () => (
    <a {...{ target, rel }} href={`https://${ANS?.currentLabel}.ar.page`} className={`flexFullCenterGap `}>
      <NewspaperIcon className={iconSize} />
      {t("wallet.arconnect.arpage")}
    </a>
  );

  const DisconnectArconnect: FC = () => (
    <button className={`flexFullCenterGap `} onClick={() => arconnectDisconnect()}>
      <ArrowLeftOnRectangleIcon className={iconSize} />
      {t("wallet.arconnect.disconnect")}
    </button>
  );

  const items: ExtendedDropdownButtonProps[] = [
    { key: 'everpay', jsx: <Everpay /> },
    { key: 'profile', jsx: <Profile /> },
    { key: 'arpage', jsx: <Arpage /> },
    { key: 'disconnect', jsx: <DisconnectArconnect /> }
  ];

  const OpenDropdownButton: FC = () => (
    <div className={connectButtonStyling}>
      {avatar && <img className={avatarStyling} src={ARSEED_URL + avatar} alt="Profile" />}
      {!avatar && <ProfileImage {...{ currentLabel: currentLabel || address, avatar, address_color, size: 20, borderWidth: 3 }} unclickable />}
      <span className="ml-2">
        {ANS?.currentLabel ? `${ANS?.currentLabel}.ar` : shortenAddress(address, 8)}
      </span>
      <EverPayBalance textClassname={`ml-4 rounded-full `} />
    </div>
  );

  const UserDropdown: FC = () => {
    const openMenuButton = <OpenDropdownButton />;
    const openMenuButtonClass = prevButtonClass + `rounded-full w-full z-0 `;
    const dropdownMenuClass = prevMenuClass + ` w-72`;
    return <Dropdown {...{ openMenuButton, items, openMenuButtonClass, dropdownMenuClass, menuItemClass }} />;
  };

  return (
    <>
      {walletConnected && <UserDropdown />}
      {!walletConnected && <ConnectArconnect className={ArConnectButtonStyling + `w-full mx-auto `} />}
    </>
  );
};

export default ArConnect;