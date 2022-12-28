import { Observable, Subject } from 'rxjs';
import * as SparkMD5 from 'spark-md5';
import { FileDataInterface } from '../interfaces/file-data.interface';

export const FILE_DATA_STATUS = {
  WAITING: 'waiting',
  UPLOADING: 'uploading',
  UPLOADED: 'uploaded',
  ERROR: 'error',
};

export function ReadAsync(file: FileDataInterface): Observable<ArrayBuffer> {
  const sub = new Subject<ArrayBuffer>();
  const reader = new FileReader();
  reader.onerror = (err) => sub.error(err);
  reader.onabort = (err) => sub.error(err);
  reader.onload = () => {
    reader.result && sub.next(reader.result as ArrayBuffer);
    sub.complete();
    reader.abort();
  };
  reader.readAsArrayBuffer(file.data);
  return sub.asObservable();
}

export function GenerateChecksum(data: ArrayBuffer) {
  const spark = new SparkMD5.ArrayBuffer();
  spark.append(data);
  return btoa(spark.end(true));
}

export const dataURIToBlob = (dataURI: string) => {
  const splitDataURI = dataURI.split(',');
  const byteString =
    splitDataURI[0].indexOf('base64') >= 0
      ? atob(splitDataURI[1])
      : decodeURI(splitDataURI[1]);
  const mimeString = splitDataURI[0].split(':')[1].split(';')[0];

  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
};

export const formatFileSize = (bytes: number): number => {
  if (bytes == 0) return 0;
  var k = 1000,
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseInt((bytes / Math.pow(k, i)).toFixed(2));
};
