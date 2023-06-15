import dynamic from "next/dynamic";

import Searchbar from "@/component/searchbar";
import WalletSelectorButton from "@/component/wallets";

const NavigationDropdown = dynamic(() => import("@/component/dropdowns/NavigationDropdown"), { ssr: false });

export const NavBar = () => {
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

export const NavBarMobile = () => {
  return (
    <div className="flexYCenter gap-x-2 mt-5">
      <Searchbar />
      <NavigationDropdown />
    </div>
  );
};
