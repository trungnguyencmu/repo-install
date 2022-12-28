export class DirectUpload {
    constructor(url, filename, blob_signed_id, presigned_url, public_url, upload_key, headers) {
        this.url = url;
        this.filename = filename;
        this.blob_signed_id = blob_signed_id;
        this.presigned_url = presigned_url;
        this.public_url = public_url;
        this.upload_key = upload_key;
        this.headers = headers;
        this.relationships = {};
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0LXVwbG9hZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3Nha2FuaS11cGxvYWQtZmlsZXMvc3JjL21vZGVscy9kaXJlY3QtdXBsb2FkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sT0FBTyxZQUFZO0lBR3ZCLFlBQ1MsR0FBWSxFQUNaLFFBQWlCLEVBQ2pCLGNBQXVCLEVBQ3ZCLGFBQXNCLEVBQ3RCLFVBQW1CLEVBQ25CLFVBQW1CLEVBQ25CLE9BQWE7UUFOYixRQUFHLEdBQUgsR0FBRyxDQUFTO1FBQ1osYUFBUSxHQUFSLFFBQVEsQ0FBUztRQUNqQixtQkFBYyxHQUFkLGNBQWMsQ0FBUztRQUN2QixrQkFBYSxHQUFiLGFBQWEsQ0FBUztRQUN0QixlQUFVLEdBQVYsVUFBVSxDQUFTO1FBQ25CLGVBQVUsR0FBVixVQUFVLENBQVM7UUFDbkIsWUFBTyxHQUFQLE9BQU8sQ0FBTTtRQVR0QixrQkFBYSxHQUFRLEVBQUUsQ0FBQztJQVVyQixDQUFDO0NBQ0wiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgRGlyZWN0VXBsb2FkIHtcbiAgcmVsYXRpb25zaGlwczogYW55ID0ge307XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHVybD86IHN0cmluZyxcbiAgICBwdWJsaWMgZmlsZW5hbWU/OiBzdHJpbmcsXG4gICAgcHVibGljIGJsb2Jfc2lnbmVkX2lkPzogc3RyaW5nLFxuICAgIHB1YmxpYyBwcmVzaWduZWRfdXJsPzogc3RyaW5nLFxuICAgIHB1YmxpYyBwdWJsaWNfdXJsPzogc3RyaW5nLFxuICAgIHB1YmxpYyB1cGxvYWRfa2V5Pzogc3RyaW5nLFxuICAgIHB1YmxpYyBoZWFkZXJzPzogYW55XG4gICkge31cbn1cbiJdfQ==