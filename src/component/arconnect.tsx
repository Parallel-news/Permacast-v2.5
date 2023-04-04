import { useEffect } from 'react'
import { useArconnect } from 'react-arconnect';
import { useTranslation } from 'next-i18next';
import { APP_LOGO, APP_NAME, PERMISSIONS } from '../constants/arconnect';
import { useRecoilState } from 'recoil';
import { arweaveAddress } from '../atoms';
import { Dropdown } from "@nextui-org/react";
import Link from 'next/link';
import { shortenAddress } from 'react-arconnect';
import { ProfileImage } from './creator';
import { ANS_TEMPLATE } from '../constants/ui';


export default function ArConnect() {
  const { t } = useTranslation();

  const [, setArweaveAddress_] = useRecoilState(arweaveAddress)

  const {
    walletConnected,
    address,
    ANS,
    getPublicKey,
    arconnectConnect,
    arconnectDisconnect
  } = useArconnect();

  const { currentLabel, avatar, address_color } = ANS || ANS_TEMPLATE;

  useEffect(() => {
    async function fetchData () {
      if (!walletConnected) return;
      // TODO: Remove this line after arconnect v1.0.0
      const arconnectPubKey = await getPublicKey();
      if (!arconnectPubKey) throw new Error("ArConnect public key not found");
  
      localStorage.setItem("userPubKey", arconnectPubKey);
    }
    fetchData();
    if (address && address.length > 0) setArweaveAddress_(address)
  }, [address, walletConnected]);

  const connect = () => arconnectConnect(PERMISSIONS, { name: APP_NAME, logo: APP_LOGO });

  const menuItems = [
    { key: "viewProfile", name: "View Profile",  href: ANS?.currentLabel ? `/creator/${ANS?.currentLabel}` : `/creator/${address}`},
    { key: "viewArPage", name: "View Ar Page",  href: ANS?.currentLabel ? `https://${ANS?.currentLabel}.ar.page` : "https://ar.page/"},
    { key: "disconnect", name: "Disconnect",  href: ""},
  ];

  console.log("ANS: ", ANS)
  return (
    <Dropdown>
      <>
        {(walletConnected && (
          <Dropdown.Button 
            style={{ 
              backgroundColor: "#FFFFFF00",
            }}
            className='w-full h-12 hover:bg-zinc-700 bg-zinc-900 rounded-full items-center flex px-3 justify-center mx-auto text-sm md:text-base normal-case focus:outline-white default-animation'
          >
            <span className="mr-2">
              {ANS?.currentLabel ? `${ANS?.currentLabel}.ar` : shortenAddress(address, 12)}
            </span>
            {
              ANS?.avatar ? (
                <div className="rounded-full h-6 w-6 overflow-hidden btn-secondary border-[1px]">
                  <img src={`https://arweave.net/${ANS?.avatar}`} alt="Profile" width="100%" height="100%" />
                </div>
              ) : (
                <ProfileImage {...{currentLabel: currentLabel || address, avatar, address_color, size: 20, borderWidth: 3}} linkToArPage={false}  />
              )
            }
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
        {(item) => (
            <Dropdown.Item
            //@ts-ignore
              key={item.key}
              //@ts-ignore
              color={item.key === "delete" ? "error" : "default"}
              //@ts-ignore
              css={{ backgroundColor: "#18181B", color: "white" }}
              className='hover:bg-zinc-700'
            >
              {/*ts-ignore*/}
              <Link href={
                  //@ts-ignore
                  item.href
                } 
                onClick={
                  //@ts-ignore
                  item.key === "disconnect" && (() => arconnectDisconnect())
                }
              >
              {//@ts-ignore
                item.name
              }
              </Link>
            </Dropdown.Item>
          
        )}
      </Dropdown.Menu>
    </Dropdown>
  )
}

//style={{ backgroundColor: '#18181B' }}