import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { Dropdown, DropdownButtonProps } from "@nextui-org/react";
import { FC, useEffect } from 'react'
import { useArconnect, shortenAddress } from 'react-arconnect';
import { useRecoilState } from 'recoil';
import { APP_LOGO, APP_NAME, PERMISSIONS } from '../constants/arconnect';
import { arweaveAddress } from '../atoms';
import { ProfileImage } from './creator';
import { ANS_TEMPLATE } from '../constants/ui';
import { EverPayBalance } from '../utils/everpay/EverPayBalance';


const ArConnect: FC = () => {
  const { t } = useTranslation();

  const [_, setArweaveAddress_] = useRecoilState(arweaveAddress)

  const {
    walletConnected,
    address,
    ANS,
    arconnectConnect,
    arconnectDisconnect
  } = useArconnect();

  const { currentLabel, avatar, address_color } = ANS || ANS_TEMPLATE;

  useEffect(() => {
    if (address && address.length > 0) setArweaveAddress_(address)
  }, [address, walletConnected]);

  const connect = () => arconnectConnect(PERMISSIONS, { name: APP_NAME, logo: APP_LOGO });
  const ta = "arconnect.";

  const menuItems = [
    { key: "viewProfile", name: ta + "profile",  href: ANS?.currentLabel ? `/creator/${ANS?.currentLabel}` : `/creator/${address}`},
    { key: "viewArPage", name: ta + "arpage",  href: ANS?.currentLabel ? `https://${ANS?.currentLabel}.ar.page` : "https://ar.page/"},
    { key: "goToEverpay", name: ta + "everpay",  href: "https://app.everpay.io"},
    { key: "disconnect", name: ta + "disconnect",  href: ""},
  ];

  return (
    <Dropdown>
      <>
        {(walletConnected && (
          <Dropdown.Button 
            style={{ 
              backgroundColor: "#FFFFFF00",
            }}
            className='w-full h-12 hover:bg-zinc-700 bg-zinc-900 rounded-full items-center flex px-4 justify-center mx-auto text-sm md:text-base normal-case focus:outline-white focus:outline-2 default-animation'
          >
            {
              ANS?.avatar ? (
                <div className="rounded-full h-6 w-6 overflow-hidden border-[1px]">
                  <Image
                    src={`https://arweave.net/${ANS.avatar}`}
                    width={24}
                    height={24}
                    alt="Profile"
                    className="rounded-full"
                  />
                </div>
              ) : (
                <ProfileImage {...{currentLabel: currentLabel || address, avatar, address_color, size: 20, borderWidth: 3}} unclickable  />
              )
            }
            <span className="ml-2">
              {ANS?.currentLabel ? `${ANS?.currentLabel}.ar` : shortenAddress(address, 8)}
            </span>
            <EverPayBalance textClassname={"ml-4 rounded-full"} />
          </Dropdown.Button>
        )) || (
          <button 
            className="w-full h-12 btn-base-color items-center flex px-3 justify-center mx-auto text-sm md:text-base normal-case focus:outline-white default-animation"
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
              {item.key === "disconnect" && <button onClick={() => arconnectDisconnect()}>{t(item.name)}</button>}
              {item.key !== "disconnect" && (
                <Link href={item.href}>
                  {t(item.name)}
                </Link>
              )}
            </>
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ArConnect;