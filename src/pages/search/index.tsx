import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

const SearchSet = React.lazy(()=>import('../../component/search/reusables'))

export default function Search() {
  return(
    <SearchSet />
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
      ]))
    },
  }
}