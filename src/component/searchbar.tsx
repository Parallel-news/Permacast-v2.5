import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useRecoilState } from 'recoil';
import { searchInputAtom } from '../atoms';

export function Searchbar() {
  const { t } = useTranslation();
  const router = useRouter();
  const { pathname, asPath, query, locale } = router;
  // router.push({ pathname, query }, asPath, { locale: newLocale })

  const [searchInput, setSearchInput] = useRecoilState(searchInputAtom); 

  return (
    <div>
      <form className="relative">
        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pr-10 pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-zinc-600" />
        </div>
        <input
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            router.push({ pathname: '/search', query: {} }, asPath, { locale: locale, shallow: true })
            console.log(asPath)
          }}
          className="input input-secondary block pl-10 py-2.5 md:py-[14px] text-xs md:text-base w-full placeholder-zinc-600 focus:placeholder-white rounded-lg md:rounded-full bg-zinc-900 text-zinc-100 outline-none focus:ring-2 focus:ring-white"
          placeholder={t("search.placeholder")}
        />
      </form>
    </div>
  )
}
