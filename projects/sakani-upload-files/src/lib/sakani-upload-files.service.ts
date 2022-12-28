import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DirectUploadParams } from '../interfaces/file-data.interface';
import { JsonApi } from '../models/json-api';

import { DirectUpload } from '../models/direct-upload';

@Injectable({ providedIn: 'root' })
export class SakaniUploadFilesService {
  constructor(private http: HttpClient) {}

  directUpload({
    file,
    apiUrl,
    uploader,
    headers,
  }: DirectUploadParams): Observable<DirectUpload> {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   Authentication: auth,
    // });
    const options = { headers: headers };

    const payload = {
      _jsonapi: {
        data: {
          type: 'direct_uploads',
          attributes: {
            filename: file.data.name,
            extension: file.data.type,
            uploader,
            content_length: file.data.size,
          },
        },
      },
    };
    return this.http
      .post(`${apiUrl}`, payload, options)
      .pipe(map((res: any) => JsonApi.parseJsonApi(DirectUpload, res.data)));
  }

  directUploadByActiveRecord({
    file,
    apiUrl,
    folder,
    headers,
  }: DirectUploadParams): Observable<DirectUpload> {
    const options = { headers: headers };

    const payload = {
      data: {
        type: 'direct_uploads',
        attributes: {
          filename: file.data.name,
          content_type: file.data.type,
          byte_size: file.data.size,
          checksum: file.checksum,
          folder,
        },
      },
    };

    return this.http
      .post(`${apiUrl}`, payload, options)
      .pipe(map((res: any) => JsonApi.parseJsonApi(DirectUpload, res.data)));
  }

  s3Upload(presignedURL: string, file: File, headers: any) {
    return this.http.put(presignedURL, file, { headers });
  }
}
