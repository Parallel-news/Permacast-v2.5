import { DataItemCreateOptions } from 'arseeding-arbundles'; // dw arseed uses it as a dependency

export interface BufferFile {
  file: Buffer,
  dataType: string
};


export type SendAndPayInterface = (
  arseedingUrl: string,
  data: Buffer,
  tokenSymbol: string,
  opts: DataItemCreateOptions,
  debug?: boolean,
) => Promise<any>;

export interface FileWrapper {
  URLObject?: string;
  file: File;
}
