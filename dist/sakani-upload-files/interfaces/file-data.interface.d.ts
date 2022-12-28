export declare type FileDataStatusT = 'waiting' | 'uploading' | 'uploaded' | 'error';
export interface FileDataInterface {
    id: string;
    data: File;
    status: FileDataStatusT;
    filename?: string;
    file_url?: string;
    checksum?: string;
    signed_blob_id?: string;
    public_url?: string;
    isRecord: boolean;
    content_type?: string;
    _destroy?: boolean;
}
export interface FileDataAPI {
    id: string;
    content_type: string;
    file_url: string;
    filename?: string;
}
export interface DirectUploadParams {
    auth: string;
    file: FileDataInterface;
    apiUrl: string;
    uploader?: string | null;
    folder?: string | null;
    isActiveStorage?: boolean;
}
