import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Dropdown, DropdownButtonProps } from "@nextui-org/react";
import { useEffect } from 'react'
import { useArconnect, shortenAddress } from 'react-arconnect';
import { useRecoilState } from 'recoil';
import { APP_LOGO, APP_NAME, PERMISSIONS } from '../constants/arconnect';
import { arweaveAddress } from '../atoms';
import { ProfileImage } from './creator';
import { ANS_TEMPLATE } from '../constants/ui';
import { EverPayBalance } from '../utils/everpay/EverPayBalance';



export default function ArConnect() {
  const { t } = useTranslation();

  const [arweaveAddress_, setArweaveAddress_] = useRecoilState(arweaveAddress)

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
            className='w-full h-12 hover:bg-zinc-700 bg-zinc-900 rounded-full items-center flex px-4 justify-center mx-auto text-sm md:text-base normal-case focus:outline-white default-animation'
          >
            {
              ANS?.avatar ? (
                <div className="rounded-full h-6 w-6 overflow-hidden btn-secondary border-[1px]">
                  <img src={`https://arweave.net/${ANS?.avatar}`} alt="Profile" width="100%" height="100%" />
                </div>
              ) : (
                <ProfileImage {...{currentLabel: currentLabel || address, avatar, address_color, size: 20, borderWidth: 3}} linkToArPage={false}  />
              )
            }
            <span className="ml-1">
              {ANS?.currentLabel ? `${ANS?.currentLabel}.ar` : shortenAddress(address, 8)}
            </span>
            {arweaveAddress_ && arweaveAddress_.length > 0 && (
              <EverPayBalance textClassname={"ml-3 rounded-full"} />
            )}
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
  )
}

//style={{ backgroundColor: '#18181B' }}