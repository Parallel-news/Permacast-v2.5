import axios from 'axios';
import { NextPage } from 'next';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { Suspense } from 'react';
import { shortenAddress } from 'react-arconnect';

import { ANS_TEMPLATE } from '@/constants/ui';
import { ARWEAVE_READ_LINK, EXM_READ_LINK } from '@/constants/index';

import { Ans } from '@/interfaces/index';
import { PASoMProfile } from '@/interfaces/pasom';

import { getContractVariables } from '@/utils/contract';

const Loading = React.lazy(() => import('@/component/reusables/loading'));
const Creator404 = React.lazy(() => import('@/component/creator').then((module) => ({ default: module.Creator404 })));
const CreatorPageComponentLazy = React.lazy(() => import('@/component/creator').then(module => ({ default: module.CreatorPageComponent })));

//! REWRITE TO USE https://permacast-bloodstone-helper.herokuapp.com/protocol/users/{ADDRESS}
// note: only returns production info
// todo: fix reloading page on initial load
// todo: build a lean mock of userpage

export async function getServerSideProps(context) {
  const { locale, params } = context;
  const { address } = params;
  let userInfo: Ans = ANS_TEMPLATE;
  userInfo.address_color = "#000000";
  userInfo.user = address.length > 0 ? address : '';
  const isAddress = address.length === 43;
  const { PASOMContract } = getContractVariables();

  try {
    const lookupAddress = !isAddress && address.includes('.ar') ? address.split('.')[0] : address
    const info = (await axios.get(`https://ans-resolver.herokuapp.com/resolve-as-arpage/${lookupAddress}`)).data;
    if (info?.user) {
      userInfo = info;
      userInfo.ANSuserExists = true;
      try {
        const PASOMState = (await axios.get(EXM_READ_LINK + PASOMContract)).data;
        const profiles: PASoMProfile[] = PASOMState.profiles;
        const profile = profiles.find((profile: PASoMProfile) => profile.address === info.user);
        userInfo.PASOM = profile || null;
      } catch (e) {
        console.log('profile error ', e);
        userInfo.PASOM = null;
      }
    } else {
      userInfo.nickname = address;
      userInfo.currentLabel = address;
      userInfo.userIsAddress = isAddress ? true : false;
      userInfo.ANSuserExists = false;
      userInfo.PASOM = null;
    }
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
      ])),
      userInfo,
    },
  };
};

const Creator: NextPage<{ userInfo: Ans }> = ({ userInfo }) => {

  const { user, nickname, currentLabel, address_color, PASOM } = userInfo;
  const avatar = PASOM?.avatar || userInfo.avatar || '';
  const bio = PASOM?.bio || userInfo.bio || '';
  const creatorName = (PASOM?.nickname || nickname) || currentLabel || shortenAddress(user);

  if (!userInfo?.ANSuserExists && !userInfo?.userIsAddress) {
    return (
      <>
        <Head>
          <title>{`Creator Not Found`}</title>
          <meta name="description" content={`Creator Not Found`} />
          <meta name="twitter:card" content="summary"></meta>
          <meta name="twitter:image" content={(avatar !== "") ? ARWEAVE_READ_LINK + avatar : "https://permacast.app/favicon.png"} />
          <meta name="twitter:title" content={`Permacast Creator`} />
          <meta name="twitter:url" content={`https://permacast.app/`} />
          <meta name="twitter:description" content={`None`} />

          <meta property="og:card" content="summary" />
          <meta property="og:image" content={(avatar !== "") ? ARWEAVE_READ_LINK + avatar : "https://permacast.app/favicon.png"} />
          <meta property="og:title" content={`Permacast Creator`} />
          <meta property="og:url" content={`https://permacast.app/`} />
          <meta property="og:description" content={`Creator Not Found`} />
        </Head>
        <Creator404 address={userInfo?.user} />
      </>
    )
  } else {
    return (
      <>
        <Head>
          <title>{`${creatorName} | Creator`}</title>
          <meta name="description" content={`${bio}`} />
          <meta name="twitter:card" content="summary"></meta>
          <meta name="twitter:image" content={(avatar !== "") ? ARWEAVE_READ_LINK + avatar : "https://permacast.app/favicon.png"} />
          <meta name="twitter:title" content={`${creatorName} | Permacast Creator`} />
          <meta name="twitter:url" content={`https://permacast.app/`} />
          <meta name="twitter:description" content={`${bio}`} />

          <meta property="og:card" content="summary" />
          <meta property="og:image" content={(avatar !== "" || PASOM?.avatar) ? ARWEAVE_READ_LINK + avatar : "https://permacast.app/favicon.png"} />
          <meta property="og:title" content={`${creatorName} | Permacast Creator`} />
          <meta property="og:url" content={`https://permacast.app/`} />
          <meta property="og:description" content={`${PASOM?.bio || bio}`} />
        </Head>
        <Suspense fallback={<Loading />}>
          <CreatorPageComponentLazy {...{ creator: userInfo }} />
        </Suspense>
      </>
    )
  }
};

export default Creator;