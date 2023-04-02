import { useEffect } from 'react'
import { useArconnect } from 'react-arconnect';
import { useTranslation } from 'next-i18next';
import { APP_LOGO, APP_NAME, PERMISSIONS } from '../constants/arconnect';
import { useRecoilState } from 'recoil';
import { arweaveAddress } from '../atoms';
import { Dropdown } from "@nextui-org/react";
import Link from 'next/link';


export default function ArConnect() {
  const { t } = useTranslation();

  const [, setArweaveAddress_] = useRecoilState(arweaveAddress)

  const {
    walletConnected,
    address,
    ANS,
    getPublicKey,
    shortenAddress,
    arconnectConnect,
    arconnectDisconnect
  } = useArconnect();

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
      <button 
        className="w-full h-12 btn-base-color items-center flex px-3 justify-center mx-auto text-sm md:text-base normal-case focus:outline-white default-animation"
        onClick={connect}
      >
        {(walletConnected && (
          <Dropdown.Button 
            style={{ backgroundColor: "#FFFFFF00" }} 
          >
            <span>
              {ANS?.currentLabel ? `${ANS?.currentLabel}.ar` : shortenAddress(address)}
            </span>
            {
              ANS?.avatar ? (
                <div className="rounded-full h-6 w-6 overflow-hidden btn-secondary border-[1px]">
                  <img src={`https://arweave.net/${ANS?.avatar}`} alt="Profile" width="100%" height="100%" />
                </div>
              ) : (
                <div className="rounded-full h-6 w-6 ml-2 btn-secondary" style={{ backgroundColor: ANS?.address_color }}></div>
              )
            }
          </Dropdown.Button>
        )) || (
          <>
            🦔 {t("connector.login")}
          </>
        )}
      </button>
      <Dropdown.Menu 
        aria-label="Dynamic Actions" 
        items={menuItems} 
        css={{ backgroundColor: "#18181B" }}
        
      >
        {(item) => (
            <Dropdown.Item
            //@ts-ignore
              key={item.key}
              //@ts-ignore
              color={item.key === "delete" ? "error" : "default"}
              //@ts-ignore
              css={{ backgroundColor: "#18181B", color: "white" }}
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