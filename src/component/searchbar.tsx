import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next';
import { FC, useState } from 'react';
import { useRecoilState } from 'recoil';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { searchInputAtom } from '../atoms';

export const SearchIconWrapperStyling = `flex absolute inset-y-0 left-0 items-center pl-3 pr-10 pointer-events-none `;
export const SearchInputStyling = `input input-secondary block pl-10 md:py-2.5 text-xs md:text-base w-full placeholder-zinc-600 focus:placeholder-white rounded-lg md:rounded-full bg-zinc-900 text-zinc-100 outline-none focus:ring-2 focus:ring-white default-animation placeholder:default-animation `;

const Searchbar: FC = () => {
  const { t } = useTranslation();
  
  const router = useRouter();
  const { pathname, asPath, query, locale } = router;
  // router.push({ pathname, query }, asPath, { locale: newLocale })

  const [searchInput, setSearchInput] = useRecoilState(searchInputAtom); 
  
  const [inputFocused, setInputFocused] = useState(false);

  const handleInput = (newInput: string) => {
    setSearchInput(newInput);
    router.push({ pathname: '/search', query: {} }, asPath, { locale: locale, shallow: false })
  };

  const handleFocus = () => setInputFocused(true);
  
  const handleBlur = () => setInputFocused(false);

  return (
    <div className="relative w-full">
      <div className={SearchIconWrapperStyling}>
        <MagnifyingGlassIcon className={`h-5 w-5 default-animation ${inputFocused ? 'text-white' : 'text-zinc-600'}`} />
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