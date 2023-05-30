import axios from 'axios';
import { useTranslation } from 'next-i18next';
import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { defaultSignatureParams, useArconnect } from 'react-arconnect';
import ThemedButton, { themedButtonIconStyling } from '../reusables/themedButton';
import { flexCenterGap } from './featuredCreators';
import { PASOM_SIG_MESSAGES, SPINNER_COLOR } from '../../constants';
import { follow, unfollow } from '../../interfaces/pasom';
import { PermaSpinner } from '../reusables/PermaSpinner';
import { Icon } from '../icon';

interface FollowButtonProps {
  user: string;
  walletConnected: boolean;
  isFollowing: boolean;
  setIsFollowing: Dispatch<SetStateAction<boolean>>;
};


export const FollowButton: FC<FollowButtonProps> = ({ user, walletConnected, isFollowing, setIsFollowing }) => {
  const { t } = useTranslation();

  const { createSignature, getPublicKey } = useArconnect();
  const [loading, setLoading] = useState<boolean>(false);

  const follow = async () => {
    if (loading || !walletConnected) return;
    try {
      setLoading(true);
      // Package EXM Call
      const data = new TextEncoder().encode(PASOM_SIG_MESSAGES[0]);
      const sig = String(await createSignature(data, defaultSignatureParams, "base64"));
      const jwk_n = await getPublicKey();

      const action = isFollowing ? "unfollow" : "follow";
      console.log('doing ' + action + ' on ' + user)
      const payloadObj: follow | unfollow = {
        function: action,
        address: user,
        sig,
        jwk_n,
      };

      const response = await axios.post('/api/exm/PASoM/write', payloadObj);
      console.log(response.data);
      setIsFollowing(prev => !prev);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const FollowText: FC = () => (
    <div className={flexCenterGap}>
      {loading ? <PermaSpinner
        spinnerColor={SPINNER_COLOR}
        size={1}
        divClass={""}
      />: <Icon className={themedButtonIconStyling} icon="USERPLUS" fill="currentColor" strokeWidth='0'/>}
      {t('creator.follow')}
    </div>
  );

  const UnfollowText: FC = () => (
    <div className={flexCenterGap}>
      {loading ? <PermaSpinner
        spinnerColor={SPINNER_COLOR}
        size={1}
        divClass={""}
      />: <Icon className={themedButtonIconStyling} icon="USERMINUS" fill="currentColor" />}
      {t('creator.unfollow')}
    </div>
  );

  return (
    <ThemedButton onClick={follow}>
      {isFollowing ? <UnfollowText /> : <FollowText />}
    </ThemedButton>
  )
};
