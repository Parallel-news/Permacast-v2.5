import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import { loadingPage, searchInputAtom } from '@/atoms/index';
import { Icon } from './icon';

export const SearchIconWrapperStyling = `flexCenter absolute inset-y-0 left-0 pl-3 pr-10 pointer-events-none `;
export const SearchInputStyling = `block pl-10 py-3 w-full placeholder-zinc-600 focus:placeholder-zinc-400/90 rounded-full bg-zinc-900 text-zinc-400/90 outline-none focus:ring-2 focus:ring-zinc-400/90 default-animation placeholder:default-animation `;

const Searchbar = () => {
  const { t } = useTranslation();

  const router = useRouter();

  const [searchInput, setSearchInput] = useRecoilState(searchInputAtom);
  const [_loadingPage, _setLoadingPage] = useRecoilState(loadingPage);

  useEffect(() => {
    _setLoadingPage(false);
  }, [])

  const [inputFocused, setInputFocused] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const isSearchPage = router.pathname === "/search";
  const debounceTimer = isSearchPage ? 75 : 200;

  const handleInput = (newInput: string) => {
    setSearchInput(newInput);
    if (debounceTimeout) clearTimeout(debounceTimeout);

    const newTimeout = setTimeout(() => {
      let updatedQuery = {};

      // Update the query object with the new search term
      // Check if the current pathname is "/search" and if the query object already exists
      if (router.pathname === "/search" && router.query.query) {
        updatedQuery = { ...router.query, query: newInput };
      } else {
        updatedQuery = { query: newInput };
      };

      // Check if the current search query is different from the new search query
      if (router.query.query !== newInput) {

        router.push(
          {
            pathname: "/search",
            query: updatedQuery,
          },
          undefined,
          { shallow: true }
        );
      }
    }, debounceTimer);

    setDebounceTimeout(newTimeout);
  };

  const handleFocus = () => setInputFocused(true);

  const handleBlur = () => setInputFocused(false);

  return (
    <div className="relative w-full">
      <div className={SearchIconWrapperStyling}>
        <Icon
          icon="MAGNIFY"
          className={`h-5 w-5 default-animation ${inputFocused ? 'text-zinc-400/90' : 'text-zinc-600'}`}
        />
      </div>
      <input
        value={searchInput}
        onChange={(e) => handleInput(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={SearchInputStyling}
        placeholder={t("search.placeholder")}
      />
    </div>
  );
};

export default Searchbar;