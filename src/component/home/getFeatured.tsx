import { Dispatch, FC, SetStateAction } from "react";
import { useTranslation } from "next-i18next";

interface GetFeaturedProps {
  onClick: () => void;
}

export const GetFeaturedButtonStyling = `btn btn-secondary bg-zinc-800 hover:bg-zinc-600 transition duration-300 ease-in-out hover:text-white rounded-xl px-8 `;

const GetFeatured: FC<GetFeaturedProps> = ({ onClick }) => {
  const { t } = useTranslation();
  
  return (
    <button className={GetFeaturedButtonStyling + "mt-2"} onClick={onClick}>
      {t("home.get-featured")}
    </button>
  );
};

export default GetFeatured;