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