import axios from 'axios';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useEffect } from 'react';
import { useArconnect, shortenAddress } from 'react-arconnect';
import { useRecoilState } from 'recoil';

import { PASoMProfileAtom, loadingPage, walletNotDetectedModalVisibilityAtom } from '@/atoms/index';
import { ARSEED_URL } from '@/constants/index';
import { APP_LOGO, APP_NAME, PERMISSIONS } from '@/constants/arconnect';
import { ANS_TEMPLATE } from '@/constants/ui';

import { EverPayBalance } from '@/utils/everpay/EverPayBalance';
import { PASoMProfile } from '@/interfaces/pasom';

import { ProfileImage } from '@/component/creator/reusables';
import { Dropdown, ExtendedDropdownButtonProps } from '@/component/reusables';
import { Icon } from '@/component/icon';

interface connectArconnectProps {
  className: string;
};

export const ConnectArconnect = ({ className }: connectArconnectProps) => {
  const { t } = useTranslation();

  const [walletNotDetectedModalVisibility, setWalletNotDetectedModalVisibility] = useRecoilState<boolean>(walletNotDetectedModalVisibilityAtom);
  const { arconnectConnect } = useArconnect();

  const connect = () => {
    if (window?.arweaveWallet) arconnectConnect(PERMISSIONS, { name: APP_NAME, logo: APP_LOGO });
    else setWalletNotDetectedModalVisibility(true);
  };

  return (
    <button
      className={className}
      onClick={connect}
    >
      {t("wallet.arconnect.login")}
    </button>
  )
};


const connectButtonStyling = `w-full h-12 hover:bg-zinc-700 bg-zinc-900 rounded-full items-center flex px-1 md:px-5 justify-center mx-auto default-no-outline-ringed default-animation z-0`;
const avatarStyling = `rounded-full h-6 w-6 overflow-hidden border-[2px] min-w-min `;
const iconSize = `w-6 h-6 `;

const ArConnect = () => {
  const { t } = useTranslation();

  const [PASoMProfile, setPASoMProfile] = useRecoilState(PASoMProfileAtom);

  const {
    walletConnected,
    address,
    ANS,
    arconnectDisconnect
  } = useArconnect();

  const { currentLabel, avatar: ANSAvatar, address_color } = ANS || ANS_TEMPLATE;
  const avatar = PASoMProfile?.avatar || ANSAvatar;

  const fetchPASoM = async () => {
    const state = (await axios.get('/api/exm/PASoM/read')).data;
    const profiles: PASoMProfile[] = state?.profiles;
    if (!profiles) return;
    const profile = profiles.find((profile: PASoMProfile) => profile.address === address);
    setPASoMProfile(profile);
  };

  useEffect(() => {
    if (address && address.length > 0) {
      fetchPASoM();
    };
  }, [address, walletConnected]);


  const target = "_blank";
  const rel = "noreferrer noopener";

  const Everpay = () => (
    <a {...{ target, rel }} href={"https://app.everpay.io"} className={`flexFullCenterGap `}>
      <Icon className={iconSize} icon="BANKNOTES" strokeWidth='1.5'/>
      {t("wallet.arconnect.everpay")}
    </a>
  );

  const Profile = () => {
    const [, _setLoadingPage] = useRecoilState(loadingPage)
    return (
      <Link 
        href={`/creator/` + ANS?.currentLabel || address} 
        className={`flexFullCenterGap `}
        onClick={() => _setLoadingPage(true)}
      >
        <Icon className={iconSize} icon="USERCIRCLE" strokeWidth='1.5'/>
        {t("wallet.arconnect.profile")}
      </Link>
  )};

  const Arpage = () => (
    <a {...{ target, rel }} href={`https://${ANS?.currentLabel}.ar.page`} className={`flexFullCenterGap `}>
      <Icon className={iconSize} icon="NEWSPAPER" strokeWidth='1.5'/>
      {t("wallet.arconnect.arpage")}
    </a>
  );

  const DisconnectArconnect = () => (
    <button className={`flexFullCenterGap `} onClick={() => arconnectDisconnect()}>
      <Icon className={iconSize} icon="ARROWLEFTRECT" strokeWidth='1.5'/>
      {t("wallet.arconnect.disconnect")}
    </button>
  );

  const items: ExtendedDropdownButtonProps[] = [
    { key: 'everpay', jsx: <Everpay /> },
    { key: 'profile', jsx: <Profile /> },
    { key: 'arpage', jsx: <Arpage /> },
    { key: 'disconnect', jsx: <DisconnectArconnect /> }
  ];

  const OpenDropdownButton = () => (
    <div className={connectButtonStyling}>
      {avatar && <img className={avatarStyling} src={ARSEED_URL + avatar} alt="Profile" />}
      {!avatar && <ProfileImage {...{ currentLabel: currentLabel || address, avatar, address_color, size: 20, borderWidth: 3 }} unclickable />}
      <span className="ml-2">
        {ANS?.currentLabel ? `${ANS?.currentLabel}.ar` : shortenAddress(address, 8)}
      </span>
      <EverPayBalance textClassname={`ml-4 rounded-full `} />
    </div>
  );

  const UserDropdown = () => {
    const openMenuButton = <OpenDropdownButton />;
    const openMenuButtonClass = `flexFullCenter bg-zinc-900 h-12 w-12 rounded-3xl default-animation rounded-full w-full z-0 `;
    const dropdownMenuClass = `absolute z-50 right-[3%] lg:right-[8%] mt-2 w-64 origin-top-right rounded-md bg-zinc-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border-[2px] border-zinc-400 default-animation`
    const menuItemClass = `border-0 p-[10px] hover:bg-zinc-800 hover:text-white default-animation `
    
    return <Dropdown {...{ openMenuButton, items, openMenuButtonClass, dropdownMenuClass, menuItemClass }} />;
  };

  return (
    <>
      {walletConnected && <UserDropdown />}
      {!walletConnected && <ConnectArconnect className={`ArConnectButtonStyling w-full mx-auto `} />}
    </>
  );
};

export default ArConnect;