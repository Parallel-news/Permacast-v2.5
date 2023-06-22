import { Dispatch, SetStateAction } from "react";
import { AuthenticationActions } from "../../../types";
import { Episode, Podcast } from "../../../interfaces";
import { Toast } from "react-hot-toast";

export type Record = {
    record_id: string;
    cid: string;
    eid: string;
    target: string;
    factory: string;
    status: string;
    mint_hash: string;
}

export interface Factories {
    [key: string]: string;
}

export interface NftObject {
    permacast_contract: string;
    admin: string;
    signature_message: string;
    ar_molecule_endpoint: string;
    claimable_factories: string[];
    factories: Factories;
    records: Record[];
    signatures: string[];
}

export type RetrieveNftObject = {
    pid: string;
    nftPayload: NftObject;
}

export type GetNftInfo = {
    enabled: boolean;
    pid: string;
}

export type AuthenticationObject = {
    jwk_n: string;
    sig: string;
}

export type CreateCollectionObject = { pid: string } & AuthenticationActions

export type CreateEpisodeNftObject = {
    eid: string;
    target: string;
    jwk_n: void;
    sig: string | Uint8Array;
}

export type CreateCollectionViewObject = {
    showPic: string;
    showTitle: string;
}

export type GenericNftButtonObject = {
    text: string;
    onClick: () => void;
    disabled?: boolean;
}

export type NftModalObject = {
    pid: string;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export type compiledShowObject = {
    pid: string;
    podcasts: Podcast[];
    nftPayload: NftObject;
}

export type GetPid = {
    pid: string;
}

export type ErrorModalObject = {
    helpSrc: string;
    primaryMsg: string;
    secondaryMsg: string;
}

export type MintEpisodeViewObject = {
    episodes: Episode[];
    showName: string;
    cover: string;
    setCheckedEid: Dispatch<SetStateAction<string[]>>;
    checkedEid: string[];
    collectionAddr: string;
}

export type EpisodeTitleObject = {
    episodeName: string;
    thumbnail: string;
}

export type MintNotifObject = {
    thumbnail: string;
    primaryMsg: string;
    secondaryMsg: string;
}
  