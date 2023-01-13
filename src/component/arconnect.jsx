import { useEffect } from 'react'
import { useAns } from 'ans-for-all';
import { useTranslation } from 'react-i18next'

export default function ArConnect() {
  const { t } = useTranslation()
  const {
    walletConnected,
    address,
    ansData,
    shortenAddress,
    arconnectConnect,
    arconnectDisconnect
  } = useAns();

  useEffect(async () => {
    if (!walletConnected) return
    if ((await window.arweaveWallet.getPermissions())?.length < 5) return

    const arconnectPubKey = await window.arweaveWallet.getActivePublicKey();
    if (!arconnectPubKey) throw new Error("ArConnect public key not found");

    const data = new TextEncoder().encode(
      `my Arweave PK for Permacast is ${arconnectPubKey}`
    );

    const signature = await window.arweaveWallet.signature(data, {
      name: "RSA-PSS",
      saltLength: 32,
    });
    const signedBase = Buffer.from(signature).toString("base64");
    localStorage.setItem("userPubKey", arconnectPubKey)
    localStorage.setItem("userSignature", signedBase)
  }, [address, walletConnected])

  return (
    <>
      {(walletConnected && (
        <button 
          className="!w-full btn-base-color flex px-3 justify-center mx-auto text-sm md:text-base normal-case"
          onClick={arconnectDisconnect}
        >
          <span>
            {ansData?.currentLabel ? `${ansData?.currentLabel}.ar` : shortenAddress(address)}
          </span>
          {
            ansData?.avatar ? (
              <div className="rounded-full h-6 w-6 overflow-hidden btn-secondary border-[1px]">
                <img src={`https://arweave.net/${ansData?.avatar}`} alt="Profile" width="100%" height="100%" />
              </div>
            ) : (
              <div className="rounded-full h-6 w-6 ml-2 btn-secondary" style={{ backgroundColor: ansData?.address_color }}></div>
            )}
        </button>
      )) || (
        <button
          onClick={arconnectConnect}
          className="btn-base-color text-center !w-full flex px-3 justify-center mx-auto text-sm md:text-base normal-case"
        >
          🦔 {t("connector.login")}
        </button>
      )}
    </>
  )
}