import { useEffect } from 'react'
import { useArconnect } from 'react-arconnect';
import { useTranslation } from 'next-i18next';
import { APP_LOGO, APP_NAME, PERMISSIONS } from '../constants/arconnect';
import { useRecoilState } from 'recoil';
import { arweaveAddress } from '../atoms';


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
      const arconnectPubKey = await getPublicKey();
      if (!arconnectPubKey) throw new Error("ArConnect public key not found");
  
      localStorage.setItem("userPubKey", arconnectPubKey);
    }
    fetchData();
    if (address && address.length > 0) setArweaveAddress_(address)
  }, [address, walletConnected]);

  const connect = () => arconnectConnect(PERMISSIONS, { name: APP_NAME, logo: APP_LOGO });

  return (
    <button 
      className="w-full h-12 flex items-center btn-base-color px-3 justify-center mx-auto text-sm md:text-base normal-case focus:outline-white default-animation"
      onClick={walletConnected ? arconnectDisconnect: connect}
    >
      {(walletConnected && (
        <>
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
        </>
      )) || (
        <>
          🦔 {t("connector:login")}
        </>
      )}
    </button>
  )
}