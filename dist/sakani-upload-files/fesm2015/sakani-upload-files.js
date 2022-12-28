import * as i1 from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import * as i0 from '@angular/core';
import { Injectable, Component, Input, Pipe, EventEmitter, Output, ViewChild, NgModule } from '@angular/core';
import { map, mergeMap, catchError, finalize } from 'rxjs/operators';
import { Subject, defer, combineLatest, of, forkJoin } from 'rxjs';
import * as SparkMD5 from 'spark-md5';
import * as i1$2 from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as i3 from '@ng-bootstrap/ng-bootstrap';
import { NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import * as i10 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i1$1 from '@angular/platform-browser';

class JsonApi {
    constructor() {
        this.relationships = {};
    }
    static buildFromObject(type, object) {
        const obj = new type();
        Object.keys(obj).forEach((key) => {
            if (object && object[key] != null) {
                obj[key] = object[key];
            }
        });
        return obj;
    }
    static parseJsonApi(type, data, included) {
        const obj = new type();
        if (Object.keys(obj).length === 0) {
            return new type(data === null || data === void 0 ? void 0 : data.attributes);
        }
        obj.data = data || {};
        obj.included = included || [];
        obj.id = obj.data.id;
        obj.type = obj.data.type;
        Object.keys(obj).forEach((key) => {
            if (obj.data.attributes[key.toString()] != null) {
                obj[key] = obj.data.attributes[key];
            }
        });
        if (obj.data.relationships) {
            Object.entries(obj.data.relationships).forEach(([key, val]) => {
                if (val.data) {
                    obj[key] = JsonApi.getRelationship(obj, obj.relationships[key], val);
                }
            });
        }
        return obj;
    }
    static getRelationship(obj, relationship, val) {
        if (!relationship) {
            return;
        }
        if (relationship.rel === 'has_one') {
            const data = obj.included.find((item) => {
                return item.type === val.data.type && item.id === val.data.id;
            });
            return JsonApi.parseJsonApi(relationship.model, data, obj.included);
        }
        if (relationship.rel === 'has_many') {
            const data = [];
            val.data.forEach((element) => {
                const matchItem = obj.included.find((item) => {
                    return element.type === item.type && element.id === item.id;
                });
                data.push(JsonApi.parseJsonApi(relationship.model, matchItem));
            });
            return data;
        }
    }
}

class DirectUpload {
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

class SakaniUploadFilesService {
    constructor(http) {
        this.http = http;
    }
    directUpload({ auth, file, apiUrl, uploader, }) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authentication: auth,
        });
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
            .pipe(map((res) => JsonApi.parseJsonApi(DirectUpload, res.data)));
    }
    directUploadByActiveRecord({ auth, file, apiUrl, folder, }) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authentication: auth,
        });
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
            .pipe(map((res) => JsonApi.parseJsonApi(DirectUpload, res.data)));
    }
    s3Upload(presignedURL, file, headers) {
        return this.http.put(presignedURL, file, { headers });
    }
}
SakaniUploadFilesService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: SakaniUploadFilesService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable });
SakaniUploadFilesService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: SakaniUploadFilesService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: SakaniUploadFilesService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.HttpClient }]; } });

const FILE_DATA_STATUS = {
    WAITING: 'waiting',
    UPLOADING: 'uploading',
    UPLOADED: 'uploaded',
    ERROR: 'error',
};
function ReadAsync(file) {
    const sub = new Subject();
    const reader = new FileReader();
    reader.onerror = (err) => sub.error(err);
    reader.onabort = (err) => sub.error(err);
    reader.onload = () => {
        reader.result && sub.next(reader.result);
        sub.complete();
        reader.abort();
    };
    reader.readAsArrayBuffer(file.data);
    return sub.asObservable();
}
function GenerateChecksum(data) {
    const spark = new SparkMD5.ArrayBuffer();
    spark.append(data);
    return btoa(spark.end(true));
}
const dataURIToBlob = (dataURI) => {
    const splitDataURI = dataURI.split(',');
    const byteString = splitDataURI[0].indexOf('base64') >= 0
        ? atob(splitDataURI[1])
        : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0];
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
};
const formatFileSize = (bytes) => {
    if (bytes == 0)
        return 0;
    var k = 1000, i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseInt((bytes / Math.pow(k, i)).toFixed(2));
};

class IconRemoveCircleComponent {
    constructor() {
        this.color = '#06222B';
    }
}
IconRemoveCircleComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: IconRemoveCircleComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
IconRemoveCircleComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.2.17", type: IconRemoveCircleComponent, selector: "app-icon-remove-circle", inputs: { color: "color" }, ngImport: i0, template: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<rect width=\"24\" height=\"24\" rx=\"12\" fill=\"white\"/>\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M5.60004 12.0001C5.60004 11.7056 5.83882 11.4668 6.13337 11.4668L17.8667 11.4668C18.1612 11.4668 18.4 11.7056 18.4 12.0001C18.4 12.2947 18.1612 12.5335 17.8667 12.5335L6.13337 12.5335C5.83882 12.5335 5.60004 12.2947 5.60004 12.0001Z\" [attr.fill]=\"color\"/>\n</svg>\n", styles: [""] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: IconRemoveCircleComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'app-icon-remove-circle',
                    templateUrl: './icon-remove-circle.component.svg',
                    styleUrls: ['./icon-remove-circle.component.css'],
                }]
        }], propDecorators: { color: [{
                type: Input
            }] } });

class IconErrorComponent {
}
IconErrorComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: IconErrorComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
IconErrorComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.2.17", type: IconErrorComponent, selector: "app-icon-error", ngImport: i0, template: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 25\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n  <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M6.58075 24.1519C6.46502 24.1519 6.35403 24.1059 6.27219 24.024L0.127808 17.8797C0.0459739 17.7978 0 17.6868 0 17.5711V6.7326C0 6.61687 0.0459739 6.50588 0.127808 6.42405L6.27219 0.279663C6.35403 0.197829 6.46502 0.151855 6.58075 0.151855H17.4193C17.535 0.151855 17.646 0.197829 17.7278 0.279663L23.8722 6.42405C23.954 6.50588 24 6.61687 24 6.7326V17.5711C24 17.6868 23.954 17.7978 23.8722 17.8797L17.7278 24.024C17.646 24.1059 17.535 24.1519 17.4193 24.1519H6.58075ZM11.7091 5.75195C11.4913 5.75195 11.2829 5.84078 11.132 5.99792C10.9812 6.15506 10.9009 6.36693 10.9098 6.58458L11.2007 13.7119C11.2182 14.1406 11.5709 14.4792 12 14.4792C12.4292 14.4792 12.7819 14.1406 12.7994 13.7119L13.0903 6.58458C13.0992 6.36693 13.0189 6.15506 12.868 5.99792C12.7172 5.84078 12.5088 5.75195 12.2909 5.75195H11.7091ZM12 18.552C12.6025 18.552 13.0909 18.0635 13.0909 17.461C13.0909 16.8585 12.6025 16.3701 12 16.3701C11.3975 16.3701 10.9091 16.8585 10.9091 17.461C10.9091 18.0635 11.3975 18.552 12 18.552Z\" fill=\"#D05C5C\"/>\n</svg>\n", styles: [""] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: IconErrorComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'app-icon-error',
                    templateUrl: './icon-error.component.svg',
                    styleUrls: ['./icon-error.component.css'],
                }]
        }] });

class IconResetComponent {
}
IconResetComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: IconResetComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
IconResetComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.2.17", type: IconResetComponent, selector: "app-icon-reset", ngImport: i0, template: "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M11.8912 3.9806C11.9044 3.53897 12.273 3.19161 12.7147 3.20475C18.3131 3.37138 22.7999 7.96158 22.7999 13.6C22.7999 19.3438 18.1437 24 12.4 24C6.65622 24 2 19.3438 2 13.6C2 10.7219 3.17021 8.11554 5.05885 6.2334C5.37181 5.92153 5.87834 5.9224 6.19022 6.23536C6.50209 6.54831 6.50122 7.05484 6.18826 7.36672C4.58854 8.96093 3.59999 11.1643 3.59999 13.6C3.59999 18.4601 7.53987 22.4 12.4 22.4C17.2601 22.4 21.1999 18.4601 21.1999 13.6C21.1999 8.82929 17.4033 4.945 12.6671 4.80404C12.2254 4.7909 11.8781 4.42223 11.8912 3.9806Z\" fill=\"#06222B\"/>\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M16.0708 9.25464C15.7089 9.50806 15.2101 9.4201 14.9567 9.05818L11.7446 4.47094C11.4912 4.10902 11.5792 3.61018 11.9411 3.35676L16.5283 0.144747C16.8903 -0.108675 17.3891 -0.0207167 17.6425 0.341206C17.8959 0.703129 17.808 1.20196 17.4461 1.45538L13.5141 4.20854L16.2673 8.14046C16.5207 8.50238 16.4328 9.00121 16.0708 9.25464Z\" fill=\"#06222B\"/>\n</svg>\n", styles: [""] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: IconResetComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'app-icon-reset',
                    templateUrl: './icon-reset.component.svg',
                    styleUrls: ['./icon-reset.component.css'],
                }]
        }] });

class IconLoadingComponent {
}
IconLoadingComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: IconLoadingComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
IconLoadingComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.2.17", type: IconLoadingComponent, selector: "app-icon-loading", ngImport: i0, template: "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" style=\"margin: auto; background: none; display: block; shape-rendering: auto;\" width=\"61px\" height=\"61px\" viewBox=\"0 0 100 100\" preserveAspectRatio=\"xMidYMid\">\n<g transform=\"rotate(0 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"3\" ry=\"4.44\" width=\"6\" height=\"12\" fill=\"#f6eff0\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"-0.9166666666666666s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g><g transform=\"rotate(30 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"3\" ry=\"4.44\" width=\"6\" height=\"12\" fill=\"#f6eff0\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"-0.8333333333333334s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g><g transform=\"rotate(60 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"3\" ry=\"4.44\" width=\"6\" height=\"12\" fill=\"#f6eff0\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"-0.75s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g><g transform=\"rotate(90 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"3\" ry=\"4.44\" width=\"6\" height=\"12\" fill=\"#f6eff0\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"-0.6666666666666666s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g><g transform=\"rotate(120 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"3\" ry=\"4.44\" width=\"6\" height=\"12\" fill=\"#f6eff0\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"-0.5833333333333334s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g><g transform=\"rotate(150 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"3\" ry=\"4.44\" width=\"6\" height=\"12\" fill=\"#f6eff0\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"-0.5s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g><g transform=\"rotate(180 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"3\" ry=\"4.44\" width=\"6\" height=\"12\" fill=\"#f6eff0\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"-0.4166666666666667s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g><g transform=\"rotate(210 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"3\" ry=\"4.44\" width=\"6\" height=\"12\" fill=\"#f6eff0\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"-0.3333333333333333s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g><g transform=\"rotate(240 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"3\" ry=\"4.44\" width=\"6\" height=\"12\" fill=\"#f6eff0\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"-0.25s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g><g transform=\"rotate(270 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"3\" ry=\"4.44\" width=\"6\" height=\"12\" fill=\"#f6eff0\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"-0.16666666666666666s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g><g transform=\"rotate(300 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"3\" ry=\"4.44\" width=\"6\" height=\"12\" fill=\"#f6eff0\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"-0.08333333333333333s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g><g transform=\"rotate(330 50 50)\">\n  <rect x=\"47\" y=\"24\" rx=\"3\" ry=\"4.44\" width=\"6\" height=\"12\" fill=\"#f6eff0\">\n    <animate attributeName=\"opacity\" values=\"1;0\" keyTimes=\"0;1\" dur=\"1s\" begin=\"0s\" repeatCount=\"indefinite\"></animate>\n  </rect>\n</g>\n<!-- [ldio] generated by https://loading.io/ --></svg>\n", styles: [""] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: IconLoadingComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'app-icon-loading',
                    templateUrl: './icon-loading.component.svg',
                    styleUrls: ['./icon-loading.component.css'],
                }]
        }] });

class IconFileComponent {
}
IconFileComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: IconFileComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
IconFileComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.2.17", type: IconFileComponent, selector: "app-icon-file", ngImport: i0, template: "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"24px\" viewBox=\"0 0 24 24\" width=\"24px\" fill=\"#000000\"><path d=\"M0 0h24v24H0z\" fill=\"none\"/><path d=\"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z\"/></svg>\n", styles: [""] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: IconFileComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'app-icon-file',
                    templateUrl: './icon-file.component.svg',
                    styleUrls: ['./icon-file.component.css'],
                }]
        }] });

class IconUploadPlusComponent {
}
IconUploadPlusComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: IconUploadPlusComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
IconUploadPlusComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.2.17", type: IconUploadPlusComponent, selector: "app-icon-upload-plus", ngImport: i0, template: "<svg width=\"25\" height=\"24\" viewBox=\"0 0 25 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<rect x=\"0.5\" width=\"24\" height=\"24\" rx=\"12\" fill=\"#8A979B\"/>\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M6.10004 11.9996C6.10004 11.705 6.33882 11.4663 6.63337 11.4663L18.3667 11.4663C18.6612 11.4663 18.9 11.705 18.9 11.9996C18.9 12.2941 18.6612 12.5329 18.3667 12.5329L6.63337 12.5329C6.33882 12.5329 6.10004 12.2941 6.10004 11.9996Z\" fill=\"white\"/>\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M12.5 18.3996C12.2055 18.3996 11.9667 18.1608 11.9667 17.8663L11.9667 6.13294C11.9667 5.83839 12.2055 5.59961 12.5 5.59961C12.7946 5.59961 13.0334 5.83839 13.0334 6.13294L13.0334 17.8663C13.0334 18.1608 12.7946 18.3996 12.5 18.3996Z\" fill=\"white\"/>\n</svg>\n", styles: [""] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: IconUploadPlusComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'app-icon-upload-plus',
                    templateUrl: './icon-upload-plus.component.svg',
                    styleUrls: ['./icon-upload-plus.component.css'],
                }]
        }] });

class SafePipe {
    constructor(sanitizer) {
        this.sanitizer = sanitizer;
    }
    transform(value, type) {
        switch (type) {
            case 'html':
                return this.sanitizer.bypassSecurityTrustHtml(value);
            case 'style':
                return this.sanitizer.bypassSecurityTrustStyle(value);
            case 'script':
                return this.sanitizer.bypassSecurityTrustScript(value);
            case 'url':
                return this.sanitizer.bypassSecurityTrustUrl(value);
            case 'resourceUrl':
                return this.sanitizer.bypassSecurityTrustResourceUrl(value);
            default:
                throw new Error(`Invalid safe type specified: ${type}`);
        }
    }
}
SafePipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: SafePipe, deps: [{ token: i1$1.DomSanitizer }], target: i0.ɵɵFactoryTarget.Pipe });
SafePipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: SafePipe, name: "safe" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: SafePipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'safe',
                }]
        }], ctorParameters: function () { return [{ type: i1$1.DomSanitizer }]; } });

class SakaniUploadFilesComponent {
    constructor(control, formBuilder, SakaniUploadFilesService, modalService) {
        this.control = control;
        this.formBuilder = formBuilder;
        this.SakaniUploadFilesService = SakaniUploadFilesService;
        this.modalService = modalService;
        this.formChanged = new EventEmitter();
        this.isActiveStorage = false;
        this.auth = '';
        this.endpointAPI = '';
        this.required = false;
        this.placeholder = 'Upload [photo type]';
        this.uploading = false;
        this.allowMultiple = false;
        this.label = '';
        this.itemWrapperClass = 'col-12 col-lg-3 col-xxl-2';
        this.allowedExtension = '*'; // 'image/png, image/jpeg'
        this.readonly = false;
        this.processUploadEvent = new EventEmitter();
        this.deleteFileEvent = new EventEmitter();
        this.fileOnClickEvent = new EventEmitter();
        this.fileDataStatus = FILE_DATA_STATUS;
        this.errors = '';
        if (this.control) {
            this.control.valueAccessor = this;
        }
    }
    ngOnInit() { }
    ngOnDestroy() {
        this.formSubscription.unsubscribe();
    }
    registerOnChange(fn) {
        this.formChanged.subscribe(fn);
    }
    registerOnTouched(fn) { }
    subscriptionFilesForm() {
        if (this.formSubscription) {
            this.formSubscription.unsubscribe();
        }
        this.formSubscription = this.filesForm.valueChanges.subscribe((val) => {
            this.formChanged.emit(val);
        });
    }
    writeValue(controls) {
        if (controls) {
            this.filesForm = this.formBuilder.group(controls);
            this.subscriptionFilesForm();
        }
        else {
            this.filesForm = this.formBuilder.group({});
            this.subscriptionFilesForm();
        }
    }
    handleUploadItem(item) {
        return defer(() => {
            item.status = this.fileDataStatus.UPLOADING;
            this.filesForm.patchValue({ [item.id]: Object.assign({}, item) });
            let blob;
            // read file and generate checksum
            return ReadAsync(item).pipe(mergeMap((file) => {
                const checksum = GenerateChecksum(file);
                item.checksum = checksum;
                blob = file;
                return this.isActiveStorage
                    ? this.SakaniUploadFilesService.directUploadByActiveRecord({
                        auth: this.auth,
                        file: item,
                        apiUrl: this.endpointAPI,
                        folder: this.folder,
                    })
                    : this.SakaniUploadFilesService.directUpload({
                        auth: this.auth,
                        file: item,
                        apiUrl: this.endpointAPI,
                        uploader: this.uploader,
                    });
            }), mergeMap((res) => {
                item.public_url = res === null || res === void 0 ? void 0 : res.public_url;
                item.signed_blob_id = res === null || res === void 0 ? void 0 : res.blob_signed_id;
                return combineLatest([
                    of(res),
                    this.SakaniUploadFilesService.s3Upload((res === null || res === void 0 ? void 0 : res.presigned_url) || (res === null || res === void 0 ? void 0 : res.url) || '', blob, res === null || res === void 0 ? void 0 : res.headers),
                ]);
            }), catchError((err) => {
                item.status = this.fileDataStatus.ERROR;
                return of(undefined);
            }), map((res) => {
                if (res)
                    return res[0].public_url;
                return;
            }), finalize(() => {
                if (item.status !== this.fileDataStatus.ERROR) {
                    item.status = this.fileDataStatus.UPLOADED;
                }
                const itemFormValue = this.filesForm.value[item.id];
                this.filesForm.patchValue({
                    [item.id]: Object.assign(Object.assign({}, itemFormValue), item),
                });
            }), catchError((err) => {
                return of(undefined);
            }));
        });
    }
    isFileUrlImage(type) {
        if (!type) {
            return false;
        }
        return type === null || type === void 0 ? void 0 : type.includes('image');
    }
    handleUploadItems(items) {
        const uploadObs = [];
        for (const item of items) {
            const obs = this.handleUploadItem(item);
            if (obs !== undefined) {
                uploadObs.push(obs);
            }
        }
        forkJoin(uploadObs).subscribe((res) => {
            const tmpRes = res.filter((x) => x);
            this.processUploadEvent.emit(tmpRes);
        });
    }
    addFiles(event) {
        const files = event.target
            .files;
        const fileData = [];
        this.errors = '';
        for (const file of Array.from(files)) {
            if (this.maxFileSize && file.size > this.maxFileSize) {
                const maxSize = Math.floor(this.maxFileSize / 1000000);
                this.errors = this.translateService.instant('ERRORS.FILE_SIZE_TOO_BIG', {
                    maxSize,
                });
                continue;
            }
            else {
                const tmpFileData = {
                    id: '_' + Math.random().toString(36).substring(2, 9),
                    data: file,
                    status: this.fileDataStatus.WAITING,
                    isRecord: false,
                };
                fileData.push(tmpFileData);
                this.readFile(file, tmpFileData);
            }
        }
        this.handleUploadItems(fileData);
    }
    readFile(file, fileData) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            const fileContent = reader.result;
            const blob = dataURIToBlob(fileContent);
            this.addControlForm(Object.assign(Object.assign({}, fileData), { content_type: blob.type, filename: file.name, file_url: URL.createObjectURL(blob) }));
        };
    }
    downloadFile(file) {
        if (file && file.file_url) {
            window.open(file.file_url);
        }
    }
    addControlForm(fileData) {
        this.filesForm.addControl(fileData.id, this.formBuilder.control(fileData));
    }
    reUpload($event, item) {
        $event.stopPropagation();
        const uploadObs = [];
        const obs = this.handleUploadItem(item);
        uploadObs.push(obs);
        forkJoin(uploadObs).subscribe((res) => {
            const tmpRes = res.filter((x) => x);
            this.processUploadEvent.emit(tmpRes);
        });
    }
    fileOnClick(item) {
        this.fileOnClickEvent.emit(item);
    }
    previewItem(item) {
        this.currentPreviewItem = item;
        this.getPreviewImage();
        this.modalService.open(this.previewTpl, {
            centered: true,
            size: 'xl',
        });
    }
    getPreviewImage() {
        if (!this.currentPreviewItem.file_url) {
            const reader = new FileReader();
            reader.onload = (event) => {
                this.currentPreviewItem.file_url = event.target.result;
            };
            reader.readAsDataURL(this.currentPreviewItem.data);
        }
        else {
            return this.currentPreviewItem.file_url;
        }
    }
    get getFormValues() {
        return Object.values(this.filesForm.value).filter((photo) => !(photo === null || photo === void 0 ? void 0 : photo._destroy));
    }
    closePreview() {
        this.modalService.dismissAll();
    }
    isInvalid(item) {
        return item.status === 'error';
    }
    remove($event, file) {
        $event.stopPropagation();
        if (file.isRecord) {
            this.filesForm.patchValue({
                [file.id]: Object.assign(Object.assign({}, file), { isRecord: false, _destroy: true }),
            });
        }
        else {
            this.filesForm.removeControl(file.id);
        }
    }
}
SakaniUploadFilesComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: SakaniUploadFilesComponent, deps: [{ token: i1$2.NgControl }, { token: i1$2.FormBuilder }, { token: SakaniUploadFilesService }, { token: i3.NgbModal }], target: i0.ɵɵFactoryTarget.Component });
SakaniUploadFilesComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.2.17", type: SakaniUploadFilesComponent, selector: "lib-sakani-upload-files", inputs: { translateService: "translateService", isActiveStorage: "isActiveStorage", auth: "auth", endpointAPI: "endpointAPI", required: "required", placeholder: "placeholder", uploading: "uploading", allowMultiple: "allowMultiple", label: "label", itemWrapperClass: "itemWrapperClass", allowedExtension: "allowedExtension", readonly: "readonly", uploader: "uploader", folder: "folder", maxFileSize: "maxFileSize" }, outputs: { processUploadEvent: "processUploadEvent", deleteFileEvent: "deleteFileEvent", fileOnClickEvent: "fileOnClickEvent" }, viewQueries: [{ propertyName: "previewTpl", first: true, predicate: ["preview"], descendants: true }], ngImport: i0, template: "<div class=\"form-group row\">\n  <ng-container *ngIf=\"getFormValues.length > 0\">\n    <ng-container *ngFor=\"let file of getFormValues; index as i\">\n      <div [className]=\"itemWrapperClass\">\n        <ng-container *ngIf=\"label\">\n          <label class=\"form-label\"\n            >{{ label }}<span *ngIf=\"allowMultiple\">{{ i + 1 }}</span\n            ><span *ngIf=\"required\" class=\"required-field\"> *</span></label\n          >\n        </ng-container>\n        <div\n          *ngIf=\"isFileUrlImage(file.content_type); else fileBlock\"\n          class=\"form-control image-container p-2 d-flex flex-column border-info round bg-white cursor-pointer mb-3\"\n          [ngClass]=\"{\n            invalid: isInvalid(file),\n            valid: !isInvalid(file)\n          }\"\n          (click)=\"previewItem(file)\"\n          [ngStyle]=\"{ 'background-image': 'url(' + file.file_url + ')' }\"\n        >\n          <div\n            class=\"cursor-pointer d-flex justify-content-end align-items-end\"\n            *ngIf=\"!readonly\"\n            appLayoutDirection\n          >\n            <app-icon-remove-circle\n              (click)=\"remove($event, file)\"\n            ></app-icon-remove-circle>\n          </div>\n          <div\n            *ngIf=\"file.status === fileDataStatus.ERROR\"\n            class=\"d-flex flex-row wrap-error cursor-pointer justify-content-center align-items-center gap-3\"\n            (click)=\"reUpload($event, file)\"\n          >\n            <div class=\"cursor-pointer\">\n              <app-icon-error appLayoutDirection></app-icon-error>\n            </div>\n            <div class=\"cursor-pointer\">\n              <app-icon-reset appLayoutDirection></app-icon-reset>\n            </div>\n          </div>\n          <div\n            *ngIf=\"file.status === fileDataStatus.UPLOADING\"\n            class=\"d-flex flex-row wrap-error cursor-pointer justify-content-center align-items-center\"\n          >\n            <app-icon-loading></app-icon-loading>\n          </div>\n        </div>\n        <ng-template #fileBlock>\n          <div\n            class=\"form-control image-container p-2 d-flex flex-column border-info round bg-file cursor-pointer mb-3\"\n          >\n            <div\n              class=\"cursor-pointer d-flex justify-content-end align-items-end\"\n              *ngIf=\"!readonly\"\n              appLayoutDirection\n            >\n              <app-icon-remove-circle\n                (click)=\"remove($event, file)\"\n              ></app-icon-remove-circle>\n            </div>\n            <div\n              class=\"d-flex flex-column h-100 wrap-error cursor-pointer justify-content-center align-items-center\"\n              (click)=\"downloadFile(file)\"\n            >\n              <app-icon-file></app-icon-file>\n              <div\n                *ngIf=\"file.status === fileDataStatus.ERROR\"\n                class=\"d-flex flex-row file-type-error cursor-pointer justify-content-center align-items-center gap-3\"\n                (click)=\"reUpload($event, file)\"\n              >\n                <div class=\"cursor-pointer\">\n                  <app-icon-error appLayoutDirection></app-icon-error>\n                </div>\n                <div class=\"cursor-pointer\">\n                  <app-icon-reset appLayoutDirection></app-icon-reset>\n                </div>\n              </div>\n              <div\n                *ngIf=\"file.status === fileDataStatus.UPLOADING\"\n                class=\"d-flex flex-row file-type-error cursor-pointer justify-content-center align-items-center\"\n              >\n                <app-icon-loading></app-icon-loading>\n              </div>\n              <span class=\"extension-name\"> {{ file.fileName }} </span>\n            </div>\n          </div>\n        </ng-template>\n      </div>\n    </ng-container>\n  </ng-container>\n  <input\n    #files\n    type=\"file\"\n    [multiple]=\"allowMultiple\"\n    [accept]=\"allowedExtension\"\n    class=\"d-none\"\n    onclick=\"this.value=null\"\n    (change)=\"addFiles($event)\"\n  />\n  <div\n    [className]=\"itemWrapperClass\"\n    *ngIf=\"!readonly && (allowMultiple || getFormValues.length === 0)\"\n  >\n    <div\n      class=\"form-control image-container justify-content-center align-items-center p-2 d-flex flex-column border-info round bg-white cursor-pointer d-inline-flex mb-3\"\n      (click)=\"files.click()\"\n    >\n      <ng-container>\n        <app-icon-upload-plus appLayoutDirection></app-icon-upload-plus>\n        <span class=\"text-mid-gray mt-2\">{{ placeholder }}</span>\n      </ng-container>\n    </div>\n  </div>\n  <div class=\"text-danger\" *ngIf=\"errors\">{{ errors }}</div>\n</div>\n<ng-template #preview let-modal>\n  <div class=\"modal-body text-center\">\n    <img\n      class=\"img-fluid\"\n      [src]=\"currentPreviewItem.file_url! | safe : 'url'\"\n    />\n  </div>\n</ng-template>\n", styles: [".h-100{height:100%}.bg-file{background-color:#e6dddd}.text-mid-gray{color:#8a979b}.mt-2{margin-top:.5rem}.multiple-upload i{color:#00aca9;cursor:pointer}.item-name{border-bottom:1px solid;word-break:break-word}.spinner-border{width:1rem;height:1rem;min-width:1rem;min-height:1rem}.image-container{box-sizing:border-box;height:188px;background-size:cover!important}.image-container .wrap-error{height:130px;grid-gap:1rem;gap:1rem}\n"], components: [{ type: IconRemoveCircleComponent, selector: "app-icon-remove-circle", inputs: ["color"] }, { type: IconErrorComponent, selector: "app-icon-error" }, { type: IconResetComponent, selector: "app-icon-reset" }, { type: IconLoadingComponent, selector: "app-icon-loading" }, { type: IconFileComponent, selector: "app-icon-file" }, { type: IconUploadPlusComponent, selector: "app-icon-upload-plus" }], directives: [{ type: i10.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i10.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i10.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i10.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], pipes: { "safe": SafePipe } });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: SakaniUploadFilesComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'lib-sakani-upload-files',
                    templateUrl: './sakani-upload-files.component.html',
                    styleUrls: ['./sakani-upload-files.component.scss'],
                }]
        }], ctorParameters: function () { return [{ type: i1$2.NgControl }, { type: i1$2.FormBuilder }, { type: SakaniUploadFilesService }, { type: i3.NgbModal }]; }, propDecorators: { translateService: [{
                type: Input
            }], isActiveStorage: [{
                type: Input
            }], auth: [{
                type: Input
            }], endpointAPI: [{
                type: Input
            }], required: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], uploading: [{
                type: Input
            }], allowMultiple: [{
                type: Input
            }], label: [{
                type: Input
            }], itemWrapperClass: [{
                type: Input
            }], allowedExtension: [{
                type: Input
            }], readonly: [{
                type: Input
            }], uploader: [{
                type: Input
            }], folder: [{
                type: Input
            }], maxFileSize: [{
                type: Input
            }], processUploadEvent: [{
                type: Output
            }], deleteFileEvent: [{
                type: Output
            }], fileOnClickEvent: [{
                type: Output
            }], previewTpl: [{
                type: ViewChild,
                args: ['preview']
            }] } });

const components = [
    IconRemoveCircleComponent,
    IconErrorComponent,
    IconResetComponent,
    IconUploadPlusComponent,
    IconLoadingComponent,
    IconFileComponent,
];
class SakaniMultipleUploadModule {
}
SakaniMultipleUploadModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: SakaniMultipleUploadModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
SakaniMultipleUploadModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: SakaniMultipleUploadModule, declarations: [SakaniUploadFilesComponent, SafePipe, IconRemoveCircleComponent,
        IconErrorComponent,
        IconResetComponent,
        IconUploadPlusComponent,
        IconLoadingComponent,
        IconFileComponent], imports: [CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbPaginationModule,
        NgbAlertModule], exports: [SakaniUploadFilesComponent, IconRemoveCircleComponent,
        IconErrorComponent,
        IconResetComponent,
        IconUploadPlusComponent,
        IconLoadingComponent,
        IconFileComponent] });
SakaniMultipleUploadModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: SakaniMultipleUploadModule, imports: [[
            CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NgbPaginationModule,
            NgbAlertModule,
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: SakaniMultipleUploadModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [SakaniUploadFilesComponent, SafePipe, ...components],
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        NgbPaginationModule,
                        NgbAlertModule,
                    ],
                    exports: [SakaniUploadFilesComponent, ...components],
                }]
        }] });

/*
 * Public API Surface of sakani-upload-files
 */

/**
 * Generated bundle index. Do not edit.
 */

export { IconErrorComponent, IconFileComponent, IconLoadingComponent, IconRemoveCircleComponent, IconResetComponent, IconUploadPlusComponent, SakaniMultipleUploadModule, SakaniUploadFilesComponent, SakaniUploadFilesService };
//# sourceMappingURL=sakani-upload-files.js.map
