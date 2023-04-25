import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

const SearchSet = React.lazy(() =>import('../../component/search/reusables'));

const Search: NextPage<{ query: string }> = ({ query }) => {
  return <SearchSet {...{ query }} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context;
  const query = context.query.query || '';

  return {
    props: {
      query,
      ...(await serverSideTranslations(locale, ['common']))
    },
  };
};

export default Search;