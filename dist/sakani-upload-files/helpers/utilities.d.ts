import { Observable } from 'rxjs';
import { FileDataInterface } from '../interfaces/file-data.interface';
export declare const FILE_DATA_STATUS: {
    WAITING: string;
    UPLOADING: string;
    UPLOADED: string;
    ERROR: string;
};
export declare function ReadAsync(file: FileDataInterface): Observable<ArrayBuffer>;
export declare function GenerateChecksum(data: ArrayBuffer): string;
export declare const dataURIToBlob: (dataURI: string) => Blob;
export declare const formatFileSize: (bytes: number) => number;
