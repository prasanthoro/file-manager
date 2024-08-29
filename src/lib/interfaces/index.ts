export interface FileData {
  original_name: string;
  type: string;
  size: number;
  name: string;
  path: string;
}
export interface PresignedUrlsResponse {
  success: boolean;
  data: string[];
}

export interface FileError {
  file: File;
  reason: string;
}
export interface UploadFileResponse {
  success: boolean;
  data: {
    upload_id: string;
    file_key: string;
    original_name: string;
    name: string;
    path: string;
  };
}

export interface PresignedUrlsResponse {
  success: boolean;
  data: string[];
}

export interface ChunkResponse {
  ETag: string;
  PartNumber: number;
}

export type FileProgress = Record<number, number>;

export interface FileError {
  file: File;
  reason: string;
}

export interface FilePreview {
  fileIndex: string;
  previewUrl: string;
}

export interface FileFormData {
  chunkSize: string;
  unit: "MB" | "GB";
  totalChunksParts: string;
  chunkSizeInBytes: number;
}

export interface uploadImagesComponentProps {
  handleFileChange: (files: File[]) => void;
  multipleFiles: File[];
  previewImages: { fileIndex: string; previewUrl: string }[];
  fileProgress: FileProgress;
  fileErrors: any;
  setMultipleFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setFileProgress: React.Dispatch<React.SetStateAction<FileProgress>>;
  setFileFormData: React.Dispatch<React.SetStateAction<FileFormData>>;
  fileFormData: any;
}
