import dynamic from "next/dynamic";
import { FC } from "react";
import Searchbar from "../../searchbar";
import WalletSelectorButton from "../../wallets";

const NavigationDropdown = dynamic(() => import("../../dropdowns/NavigationDropdown"), { ssr: false });

export const NavBar: FC = () => {
  return (
    <div className="mb-10 ">
      <div className="md:hidden">
        <NavBarMobile />
      </div>
      <div className="hidden md:block">
        <div className="flex">
          <div className="w-4/5">
            <Searchbar />
          </div>
          <div className="ml-2 w-80">
            <WalletSelectorButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export const NavBarMobile: FC = () => {
  return (
    <div className="flex items-center gap-x-2 mt-5">
      <Searchbar />
      <NavigationDropdown />
    </div>
  );
};
