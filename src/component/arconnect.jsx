import { useEffect, useState, useContext } from 'react'
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