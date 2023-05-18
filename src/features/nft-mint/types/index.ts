import { Dispatch, SetStateAction } from "react";
import { AuthenticationActions } from "../../../types";
import { Podcast } from "../../../interfaces";

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

export type CreateCollectionObject = RetrieveNftObject & AuthenticationActions

export type CreateCollectionViewObject = {
    showPic: string;
    showTitle: string;
}

export type GenericNftButtonObject = {
    text: string;
    onClick: () => void;
}

export type NftModalObject = {
    pid: string;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export type compiledShowObject = {
    pid: string;
    podcasts: Podcast[]
}