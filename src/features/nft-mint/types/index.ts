import { AuthenticationActions } from "../../../types";

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