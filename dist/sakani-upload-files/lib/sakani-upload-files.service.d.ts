import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DirectUploadParams } from '../interfaces/file-data.interface';
import { DirectUpload } from '../models/direct-upload';
import * as i0 from "@angular/core";
export declare class SakaniUploadFilesService {
    private http;
    constructor(http: HttpClient);
    directUpload({ file, apiUrl, uploader, headers, }: DirectUploadParams): Observable<DirectUpload>;
    directUploadByActiveRecord({ file, apiUrl, folder, headers, }: DirectUploadParams): Observable<DirectUpload>;
    s3Upload(presignedURL: string, file: File, headers: any): Observable<Object>;
    static ɵfac: i0.ɵɵFactoryDeclaration<SakaniUploadFilesService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SakaniUploadFilesService>;
}
