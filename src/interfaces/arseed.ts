export interface BufferFile {
  file: Buffer,
  dataType: string
};

export interface FileWrapper {
  URLObject?: string;
  file: File;
}
