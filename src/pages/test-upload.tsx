import axios from "axios";
import { NextPage } from "next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useEffect } from "react";
import { defaultSignatureParams, useArconnect } from "react-arconnect";
import { useRecoilState } from "recoil";

import { loadingPage } from "../atoms";
import { EPISODE_UPLOAD_FEE, EVERPAY_EOA, EVERPAY_EOA_UPLOADS, USER_SIG_MESSAGES } from "../constants";
import { transferFunds } from "../utils/everpay";
import { getBundleArFee } from "../utils/arseeding";
import { determineMediaType } from "../utils/reusables";

const FeedPage: NextPage<{ }> = ({ }) => {
  const [_loadingPage, _setLoadingPage] = useRecoilState(loadingPage);

  const { address, getPublicKey, createSignature } = useArconnect();

  useEffect(() => {
    _setLoadingPage(false)
  }, []);

  const createEpPayload = {
    // "function": "addEpisode", // it already has this on the backend
    "jwk_n": "",
    "pid": "fc01c89c24f31c2512f624ad1b002cdc31c0aac20529e25ee0c91baada608a141bdcd6df69024e7b68d5fd5520f71b1afc2b415df0fd27f045693f9c541d290f",
    "name": "episode name",
    "desc": "NtJe95k0OiHoKcfgLzFPqYzZbi2nc5R395o0kkU83UE",
    "sig": "",
    "txid": "",
    "isVisible": true,
    "thumbnail": "",
    "content": "",
    "mimeType": "",
  };

  return (
    <div>
      <button onClick={async () => {
        // When finished, please nuke this page. Only use this for testing
        if (!address) return;
        const exampleXML = `<enclosure length="135453770" type="audio/mpeg" url="https://chrt.fm/track/E6F416/traffic.libsyn.com/secure/bankless/AUDIO_-_WRU_1st_Week_of_May_2023.mp3?dest-id=1859771" />`;
        const url = "https://chrt.fm/track/E6F416/traffic.libsyn.com/secure/bankless/AUDIO_-_WRU_1st_Week_of_May_2023.mp3?dest-id=1859771";
        const contentType = "video/mpeg";
        const contentLength = "135453770";
        const CONTENT_COST = Number(await getBundleArFee(contentLength)) / 1000000000000;
        const FINAL_CONTENT_COST = CONTENT_COST + 0.1; // to avoid rounding errors and a slippage change
        const uploadPaymentTX = await transferFunds("UPLOAD_CONTENT", FINAL_CONTENT_COST, EVERPAY_EOA_UPLOADS, address);

        const jwk_n = await getPublicKey();
        const data = new TextEncoder().encode(USER_SIG_MESSAGES[0] + jwk_n);
        const sig = String(await createSignature(data, defaultSignatureParams, "base64"));
        const tx = await transferFunds("UPLOAD_EPISODE_FEE", EPISODE_UPLOAD_FEE, EVERPAY_EOA, address);

        // @ts-ignore
        createEpPayload["txid"] = tx[1].everHash;
        createEpPayload["mimeType"] = determineMediaType(contentType);
        createEpPayload["sig"] = sig;
        createEpPayload["jwk_n"] = jwk_n;
        console.log(createEpPayload);
        const finalPayload = {
          url,
          uploadPaymentTX,
          episodeMetadata: createEpPayload,
        };

        axios.post('/api/arseed/upload-url', finalPayload).then(console.log)
      }}>Test Episode upload</button>
    </div>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
      ])),
    },
  };
};

export default FeedPage;