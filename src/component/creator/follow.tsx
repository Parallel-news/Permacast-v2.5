import axios from "axios";
import { useTranslation } from "next-i18next";
import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { defaultSignatureParams, useArconnect } from "react-arconnect";

import ThemedButton, {
  themedButtonIconStyling,
} from "@/component/reusables/themedButton";
import { PASOM_SIG_MESSAGES, SPINNER_COLOR } from "@/constants/index";
import { follow, unfollow } from "@/interfaces/pasom";
import { PermaSpinner } from "@/component/reusables/PermaSpinner";
import { Icon } from "@/component/icon";
import useCrossChainAuth from "@/hooks/useCrossChainAuth";

interface FollowButtonProps {
  user: string;
  walletConnected: boolean;
  isFollowing: boolean;
  setIsFollowing: Dispatch<SetStateAction<boolean>>;
}

export const FollowButton: FC<FollowButtonProps> = ({
  user,
  walletConnected,
  isFollowing,
  setIsFollowing,
}) => {
  const { t } = useTranslation();

  const { packageMEMPayload } = useCrossChainAuth();

  const [loading, setLoading] = useState<boolean>(false);

  const follow = async () => {
    if (loading || !walletConnected) return;
    try {
      setLoading(true);
      // Package EXM Call

      const action = isFollowing ? "unfollow" : "follow";
      console.log("doing " + action + " on " + user);
      const payload: follow | unfollow = await packageMEMPayload({
        function: action,
        address: user,
        sig: "",
        jwk_n: "",
      });

      const response = await axios.post("/api/exm/PASoM/write", payload);
      console.log(response.data);
      setIsFollowing((prev) => !prev);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const FollowText = () => (
    <div className={`flexYCenterGapX`}>
      {loading ? (
        <PermaSpinner spinnerColor={SPINNER_COLOR} size={1} divClass={""} />
      ) : (
        <Icon
          className={themedButtonIconStyling}
          icon="USERPLUS"
          fill="currentColor"
          viewBox="0 0 20 20"
          strokeWidth="0"
        />
      )}
      {t("creator.follow")}
    </div>
  );

  const UnfollowText = () => (
    <div className={`flexYCenterGapX`}>
      {loading ? (
        <PermaSpinner spinnerColor={SPINNER_COLOR} size={1} divClass={""} />
      ) : (
        <Icon
          className={themedButtonIconStyling}
          icon="USERMINUS"
          fill="currentColor"
          viewBox="0 0 20 20"
          strokeWidth="0"
        />
      )}
      {t("creator.unfollow")}
    </div>
  );

  return (
    <ThemedButton onClick={follow}>
      {isFollowing ? <UnfollowText /> : <FollowText />}
    </ThemedButton>
  );
};
