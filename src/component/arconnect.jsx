import { useEffect, useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import Swal from 'sweetalert2'
import { shortenAddress } from '../utils/ui'
import { appContext } from '../utils/initStateGen'

const requiredPermissions = ['ACCESS_ADDRESS', 'ACCESS_ALL_ADDRESSES', 'SIGNATURE', 'SIGN_TRANSACTION', 'ACCESS_PUBLIC_KEY']


export default function ArConnect() {
  const appState = useContext(appContext)
  const {address, setAddress, ANSData, setANSData, walletConnected, setWalletConnected } = appState.user;
  const { t } = useTranslation()
  
  useEffect(() => {
    // add ArConnect event listeners
    console.log("arconnect.jsx useEffect");
    window.addEventListener('arweaveWalletLoaded', walletLoadedEvent)
    window.addEventListener('walletSwitch', walletSwitchEvent)
    return () => {
      // remove ArConnect event listeners
      window.removeEventListener('arweaveWalletLoaded', walletLoadedEvent)
      window.removeEventListener('walletSwitch', walletSwitchEvent)
    }
  })

  // wallet address change event
  // when the user switches wallets
  const walletSwitchEvent = async (e) => {
    setAddress(e.detail.address)
    // setAddress("ljvCPN31XCLPkBo9FUeB7vAK0VC6-eY52-CS-6Iho8U")
    // setANSData(await getANSLabel(e.detail.address))
  }

  // ArConnect script injected event
  const walletLoadedEvent = async () => {
    try {
      // connected, set address
      // (the user can still be connected, but
      // for this actions the "ACCESS_ADDRESS"
      // permission is required. if the user doesn't
      // have that, we still need to ask them to connect)
      const addr = await getAddr()
      setAddress(addr)
      // setAddress("ljvCPN31XCLPkBo9FUeB7vAK0VC6-eY52-CS-6Iho8U")
      // setANSData(await getANSLabel(addr))
      setWalletConnected(true)
    } catch {
      // not connected
      setAddress(undefined)
      setWalletConnected(false)
    }
  }

  const installArConnectAlert = () => {
    Swal.fire({
      icon: "warning",
      title: t("connector.swal.title"),
      text: t("connector.swal.text"),
      footer: `<a href="https://arconnect.io" rel="noopener noreferrer" target="_blank">${t("connector.swal.footer")}</a>`,
      customClass: "font-mono",
    })
  }

  const getAddr = () => window.arweaveWallet.getActiveAddress()

  // const getANSLabel = async (addr) => {

  //   return ans?.currentLabel
  // }

  useEffect(() => {
    console.log("arconnect.jsx fetch useEffect");
    const fetchData = async () => {
      if (address) {
        try {
          const response = await fetch(`https://ans-testnet.herokuapp.com/profile/${address}`)
          const ans = await response.json()
          const {address_color, currentLabel, avatar = ""} = ans;
          setANSData({address_color, currentLabel, avatar})
        } catch (error) {
          console.error(error)
        }  
      }
    };

    fetchData();
  }, [address]);

  const arconnectConnect = async () => {
    if (window.arweaveWallet) {
      try {
        await window.arweaveWallet.connect(requiredPermissions)
        setAddress(await getAddr())
        setWalletConnected(true)

      } catch { }
    } else {
      installArConnectAlert()
    }
  }

  const arconnectDisconnect = async () => {
    await window.arweaveWallet.disconnect()
    setWalletConnected(false)
    setAddress(undefined)
  }

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
                {ANSData?.currentLabel ? `${ANSData?.currentLabel}.ar` : shortenAddress(address)}
              </span>
              {
                ANSData?.avatar ? (
                  <div className="rounded-full h-6 w-6 overflow-hidden btn-secondary border-[1px]">
                    <img src={`https://arweave.net/${ANSData?.avatar}`} alt="Profile" width="100%" height="100%" />
                  </div>
                ) : (
                  <div className="rounded-full h-6 w-6 ml-2 btn-secondary" style={{ backgroundColor: ANSData?.address_color }}></div>
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