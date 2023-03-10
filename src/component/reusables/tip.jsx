import React, { useContext } from 'react';
import { HeartIcon } from '@heroicons/react/24/solid';

import { getButtonRGBs } from '../../utils/ui';
import { useTranslation } from 'next-i18next';

export default function TipButton({tipColor=false}) {
  const { t } = useTranslation();
  let color = tipColor || "rgb(255, 0, 255)";

  return (
    <div className="tooltip" data-tip="Coming soon!">
      <button disabled className="btn btn-outline btn-sm normal-case rounded-full border-0 min-w-max" style={getButtonRGBs(color)} onClick={() => tipPrompt(appContext.t)}>
        <HeartIcon className="mr-2 w-4 h-4" /><span className="font-normal">{t("tip")}</span>
      </button>
    </div>
  )
}

export function tipPrompt (t) {

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
