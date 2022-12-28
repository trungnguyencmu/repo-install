export class DirectUpload {
  relationships: any = {};

  constructor(
    public url?: string,
    public filename?: string,
    public blob_signed_id?: string,
    public presigned_url?: string,
    public public_url?: string,
    public upload_key?: string,
    public headers?: any
  ) {}
}
