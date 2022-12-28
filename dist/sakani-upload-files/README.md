# SakaniUploadFiles

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.0.

## Build

Run `ng build sakani-upload-files` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build sakani-upload-files`, go to the dist folder `cd dist/sakani-upload-files` and run `npm publish`.
## Installation
<mark>Run `npm install sakani-upload-files` to install the library</mark>

## Initialization
Add the `SakaniMultipleUploadModule` to your app.
```
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { SakaniMultipleUploadModule } from 'sakani-upload-files';

import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    SakaniMultipleUploadModule // <-- Add the Sakani Uploader module here.
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```
## Component

```
  <lib-sakani-upload-files 
    allowedExtension="image/png, image/jpeg, image/jpg, application/pdf"
    [readonly]="!this.canEditAllInformation"
    [uploader]="uploader"
    formControlName="interior_photo_form"
    [endpointAPI]="directUploadURL"
    [allowMultiple]="true"
    [auth]="auth"
    [isActiveStorage]="true"
    [translateService]="translate"
    [maxFileSize]="200000"
  >
  </lib-sakani-upload-files>
```

## Props

| parameter        | type                                              | default | description                                     |
|------------------|---------------------------------------------------|---------|-------------------------------------------------|
| allowedExtension | image/png, image/jpeg, image/jpg, application/pdf | '*'     |                                                 |
| maxFileSize      | number (byte)                                     | null    |                                                 |
| readonly         | boolean                                           | false   |                                                 |
| uploader         | string                                            | null    |                                                 |
| formControlName  | string                                            | null    |                                                 |
| endpointAPI      | string                                            | null    | Url api upload to Sakani server                 |
| allowMultiple    | boolean                                           | false   |                                                 |
| auth             | string                                            | null    | this is user token in Sakani's platform         |
| isActiveStorage  | boolean                                           | false   | this prop will support for active storage rails |
| translateService | ngx-translate                                     | null    |                                                 |
