import { useRouter } from "next/router";
import { FC } from "react";
import { LanguageOptionInterface } from "../../utils/languages";


export interface LanguageButtonProps {
  l: LanguageOptionInterface;
  className?: string;
};

export const LanguageButton: FC<LanguageButtonProps> = ({ className, l }) => {
  
  const router = useRouter();
  const { pathname, asPath, query } = router;

  const changeLanguage = (language: string) => {
    router.push({ pathname, query }, asPath, { locale: language })
  };

  return (
    <button {...{ className }} onClick={() => changeLanguage(l.code)}>
      {l.name}
    </button>
  );
};
