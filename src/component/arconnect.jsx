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
    <button 
      className="text-zinc-300 hover:text-white cursor-pointer btn btn-secondary rounded-full bg-zinc-900 hover:bg-zinc-600 w-full "
      onClick={arconnectConnect}
    >
      <>
        {(walletConnected && (
          <>
            <div
              className="flex px-3 justify-center mx-auto text-sm md:text-base normal-case"
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
            </div>
          </>
        )) || (
            <div
              className="text-center w-full"
            >
              🦔 {t("connector.login")}
            </div>
          )}
      </>
    </button>
  )
}