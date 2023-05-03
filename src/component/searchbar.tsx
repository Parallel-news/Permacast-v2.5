import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next';
import { FC, useState } from 'react';
import { useRecoilState } from 'recoil';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { searchInputAtom } from '../atoms';

export const SearchIconWrapperStyling = `flex absolute inset-y-0 left-0 items-center pl-3 pr-10 pointer-events-none `;
export const SearchInputStyling = `block pl-10 py-3 w-full placeholder-zinc-600 focus:placeholder-zinc-400/90 rounded-full bg-zinc-900 text-zinc-400/90 outline-none focus:ring-2 focus:ring-zinc-400/90 default-animation placeholder:default-animation `;

const Searchbar: FC = () => {
  const { t } = useTranslation();
  
  const router = useRouter();

  const [searchInput, setSearchInput] = useRecoilState(searchInputAtom);
  
  const [inputFocused, setInputFocused] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const handleInput = (newInput: string) => {
    setSearchInput(newInput);
    if (debounceTimeout) clearTimeout(debounceTimeout);
    const newTimeout = setTimeout(() => {
      // Update the query object with the new search term
      const updatedQuery = { ...router.query, query: newInput };
  
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
    }, 800);

    setDebounceTimeout(newTimeout);
  };

  const handleFocus = () => setInputFocused(true);
  
  const handleBlur = () => setInputFocused(false);

  return (
    <div className="relative w-full">
      <div className={SearchIconWrapperStyling}>
        <MagnifyingGlassIcon className={`h-5 w-5 default-animation ${inputFocused ? 'text-zinc-400/90' : 'text-zinc-600'}`} />
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