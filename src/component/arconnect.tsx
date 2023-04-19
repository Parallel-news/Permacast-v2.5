import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { Dropdown, DropdownButtonProps } from "@nextui-org/react";
import { FC, useEffect } from 'react'
import { useArconnect, shortenAddress } from 'react-arconnect';
import { useRecoilState } from 'recoil';
import { APP_LOGO, APP_NAME, PERMISSIONS } from '../constants/arconnect';
import { PASoMProfileAtom, arweaveAddress } from '../atoms';
import { ProfileImage } from './creator/reusables';
import { ANS_TEMPLATE } from '../constants/ui';
import { EverPayBalance } from '../utils/everpay/EverPayBalance';
import { ArrowLeftOnRectangleIcon, BanknotesIcon, NewspaperIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { PASoMProfile } from '../interfaces/pasom';
import { ARSEED_URL } from '../constants';


export const ArConnectButtonStyling = `h-12 btn-base-color items-center flex px-3 justify-center text-sm md:text-base normal-case default-no-outline-ringed default-animation hover:text-white focus:text-white disabled:text-zinc-400 disabled:bg-zinc-700 disabled:cursor-auto `;

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

  const connect = () => arconnectConnect(PERMISSIONS, { name: APP_NAME, logo: APP_LOGO });
  const ta = "arconnect.";

  const className = 'text-white w-4 h-4 ';
  const TopupIcon = () => <BanknotesIcon {...{ className }} />;
  const ProfileIcon = () => <UserCircleIcon {...{ className }} />;
  const ArPage = () => <NewspaperIcon {...{ className }} />;
  const DisconnectIcon = () => <ArrowLeftOnRectangleIcon {...{ className }} />;

  const menuItems = [
    { icon: <TopupIcon />, key: "goToEverpay", name: ta + "everpay",  href: "https://app.everpay.io"},
    { icon: <ProfileIcon />, key: "viewProfile", name: ta + "profile",  href: ANS?.currentLabel ? `/creator/${ANS?.currentLabel}` : `/creator/${address}`},
    { icon: <ArPage />, key: "viewArPage", name: ta + "arpage",  href: ANS?.currentLabel ? `https://${ANS?.currentLabel}.ar.page` : "https://ar.page/"},
    { icon: <DisconnectIcon />, key: "disconnect", name: ta + "disconnect",  href: ""},
  ];

  return (
    <Dropdown>
      <>
        {(walletConnected && (
          <Dropdown.Button 
            style={{ 
              backgroundColor: "#FFFFFF00",
            }}
            className='w-full h-12 hover:bg-zinc-700 bg-zinc-900 rounded-full items-center flex px-4 justify-center mx-auto text-sm md:text-base normal-case default-no-outline-ringed default-animation z-0'
          >
            {avatar ? (
              <div className="rounded-full h-6 w-6 overflow-hidden border-[2px]">
                <Image
                  src={ARSEED_URL + avatar}
                  width={24}
                  height={24}
                  alt="Profile"
                  className="rounded-full"
                />
              </div>
            ) : (
              <ProfileImage {...{currentLabel: currentLabel || address, avatar, address_color, size: 20, borderWidth: 3}} unclickable  />
            )}
            <span className="ml-2">
              {ANS?.currentLabel ? `${ANS?.currentLabel}.ar` : shortenAddress(address, 8)}
            </span>
            <EverPayBalance textClassname={"ml-4 rounded-full"} />
          </Dropdown.Button>
        )) || (
          <button 
            className={ArConnectButtonStyling + `w-full mx-auto `}
            onClick={connect}
          >
            🦔 {t("connector.login")}
          </button>
        )}
      </>
      <Dropdown.Menu 
        aria-label="Dynamic Actions" 
        items={menuItems} 
        css={{ backgroundColor: "#18181B", width: '48px' }}
      >
        {(item: DropdownButtonProps) => (
          <Dropdown.Item
            key={item.key}
            color={item.key === "delete" ? "error" : "default"}
            css={{ backgroundColor: "#18181B", color: "white" }}
            className='hover:bg-zinc-700'
          >
            <>
              {item.key === "disconnect" && (
                <button className={`flex items-center w-[100%] ` + 'gap-x-2 '} onClick={() => arconnectDisconnect()}>
                  {item.icon}
                  {t(item.name)}
                </button>
              )}
              {item.key !== "disconnect" && (
                <button className={`flex items-center w-[100%] ` + 'gap-x-2'}> 
                  {item.icon}
                  <Link href={item.href} className="w-full flex justify-start">
                    {t(item.name)}
                  </Link>
                </button>
              )}
            </>
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ArConnect;