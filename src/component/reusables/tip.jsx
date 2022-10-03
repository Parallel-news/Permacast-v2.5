import React, { useContext } from 'react';
import Swal from 'sweetalert2';
import { HeartIcon } from '@heroicons/react/24/solid';
import { appContext } from '../../utils/initStateGen.js';
import { getButtonRGBs } from '../../utils/ui';
import { useTranslation } from 'react-i18next';

export default function TipButton({tipColor=false}) {
  const appState = useContext(appContext);
  const { t } = useTranslation();
  const { currentPodcastColor } = appState.theme;
  let color = tipColor || currentPodcastColor;

  return (
    <div className="tooltip" data-tip="Coming soon!">
      <button disabled className="btn btn-outline btn-sm normal-case rounded-full border-0 min-w-max" style={getButtonRGBs(color)} onClick={() => tipPrompt(appContext.t)}>
        <HeartIcon className="mr-2 w-4 h-4" /><span className="font-normal">{t("tip")}</span>
      </button>
    </div>
  )
}

export function tipPrompt (t) {
  Swal.fire({
    title: t("podcasthtml.swal.title"),
    text: t("podcasthtml.swal.text"),
    customClass: "font-mono",
  })
  return false

  // const addr = await window.arweaveWallet.getActiveAddress();

  // const podcastId = id;
  // const name = name;
  // const recipient = props.owner;
  // const { value: tipAmount } = await Swal.fire({
  //     title: `Tip ${name} 🙏`,
  //     input: 'text',
  //     inputPlaceholder: 'Amount to tip ($NEWS)',
  //     confirmButtonText: 'Tip'
  // });

  // if (tipAmount && checkNewsBalance(addr, tipAmount)) {

  //     let n = parseInt(tipAmount);
  //     if (Number.isInteger(n) && n > 0) {

  //         if (transferNews(recipient, tipAmount)) {

  //             Swal.fire({
  //                 title: 'You just supported a great podcast 😻',
  //                 text: `${name} just got ${tipAmount} $NEWS.`
  //             })

  //         } else {
  //             Swal.fire({
  //                 title: 'Enter a whole number of $NEWS to tip.'
  //             })
  //         }
  //     }
  // }
}
