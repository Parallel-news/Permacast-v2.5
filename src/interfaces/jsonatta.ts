import { contractType } from ".";

// https://docs.jsonata.org/simple
export interface JsonattaQuery {
  key: string;
  query: string;
  contract?: contractType;
};
