import { Component, EventEmitter, Input, Output, ViewChild, } from '@angular/core';
import { combineLatest, defer, forkJoin, of, } from 'rxjs';
import { catchError, finalize, map, mergeMap } from 'rxjs/operators';
import { dataURIToBlob, FILE_DATA_STATUS, GenerateChecksum, ReadAsync, } from '../helpers/utilities';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "./sakani-upload-files.service";
import * as i3 from "@ng-bootstrap/ng-bootstrap";
import * as i4 from "../components/svgs/icon-remove-circle/icon-remove-circle.component";
import * as i5 from "../components/svgs/icon-error/icon-error.component";
import * as i6 from "../components/svgs/icon-reset/icon-reset.component";
import * as i7 from "../components/svgs/icon-loading/icon-loading.component";
import * as i8 from "../components/svgs/icon-file/icon-file.component";
import * as i9 from "../components/svgs/icon-upload-plus/icon-upload-plus.component";
import * as i10 from "@angular/common";
import * as i11 from "../pipes/safe.pipe";
export class SakaniUploadFilesComponent {
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
SakaniUploadFilesComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: SakaniUploadFilesComponent, deps: [{ token: i1.NgControl }, { token: i1.FormBuilder }, { token: i2.SakaniUploadFilesService }, { token: i3.NgbModal }], target: i0.ɵɵFactoryTarget.Component });
SakaniUploadFilesComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.2.17", type: SakaniUploadFilesComponent, selector: "lib-sakani-upload-files", inputs: { translateService: "translateService", isActiveStorage: "isActiveStorage", auth: "auth", endpointAPI: "endpointAPI", required: "required", placeholder: "placeholder", uploading: "uploading", allowMultiple: "allowMultiple", label: "label", itemWrapperClass: "itemWrapperClass", allowedExtension: "allowedExtension", readonly: "readonly", uploader: "uploader", folder: "folder", maxFileSize: "maxFileSize" }, outputs: { processUploadEvent: "processUploadEvent", deleteFileEvent: "deleteFileEvent", fileOnClickEvent: "fileOnClickEvent" }, viewQueries: [{ propertyName: "previewTpl", first: true, predicate: ["preview"], descendants: true }], ngImport: i0, template: "<div class=\"form-group row\">\n  <ng-container *ngIf=\"getFormValues.length > 0\">\n    <ng-container *ngFor=\"let file of getFormValues; index as i\">\n      <div [className]=\"itemWrapperClass\">\n        <ng-container *ngIf=\"label\">\n          <label class=\"form-label\"\n            >{{ label }}<span *ngIf=\"allowMultiple\">{{ i + 1 }}</span\n            ><span *ngIf=\"required\" class=\"required-field\"> *</span></label\n          >\n        </ng-container>\n        <div\n          *ngIf=\"isFileUrlImage(file.content_type); else fileBlock\"\n          class=\"form-control image-container p-2 d-flex flex-column border-info round bg-white cursor-pointer mb-3\"\n          [ngClass]=\"{\n            invalid: isInvalid(file),\n            valid: !isInvalid(file)\n          }\"\n          (click)=\"previewItem(file)\"\n          [ngStyle]=\"{ 'background-image': 'url(' + file.file_url + ')' }\"\n        >\n          <div\n            class=\"cursor-pointer d-flex justify-content-end align-items-end\"\n            *ngIf=\"!readonly\"\n            appLayoutDirection\n          >\n            <app-icon-remove-circle\n              (click)=\"remove($event, file)\"\n            ></app-icon-remove-circle>\n          </div>\n          <div\n            *ngIf=\"file.status === fileDataStatus.ERROR\"\n            class=\"d-flex flex-row wrap-error cursor-pointer justify-content-center align-items-center gap-3\"\n            (click)=\"reUpload($event, file)\"\n          >\n            <div class=\"cursor-pointer\">\n              <app-icon-error appLayoutDirection></app-icon-error>\n            </div>\n            <div class=\"cursor-pointer\">\n              <app-icon-reset appLayoutDirection></app-icon-reset>\n            </div>\n          </div>\n          <div\n            *ngIf=\"file.status === fileDataStatus.UPLOADING\"\n            class=\"d-flex flex-row wrap-error cursor-pointer justify-content-center align-items-center\"\n          >\n            <app-icon-loading></app-icon-loading>\n          </div>\n        </div>\n        <ng-template #fileBlock>\n          <div\n            class=\"form-control image-container p-2 d-flex flex-column border-info round bg-file cursor-pointer mb-3\"\n          >\n            <div\n              class=\"cursor-pointer d-flex justify-content-end align-items-end\"\n              *ngIf=\"!readonly\"\n              appLayoutDirection\n            >\n              <app-icon-remove-circle\n                (click)=\"remove($event, file)\"\n              ></app-icon-remove-circle>\n            </div>\n            <div\n              class=\"d-flex flex-column h-100 wrap-error cursor-pointer justify-content-center align-items-center\"\n              (click)=\"downloadFile(file)\"\n            >\n              <app-icon-file></app-icon-file>\n              <div\n                *ngIf=\"file.status === fileDataStatus.ERROR\"\n                class=\"d-flex flex-row file-type-error cursor-pointer justify-content-center align-items-center gap-3\"\n                (click)=\"reUpload($event, file)\"\n              >\n                <div class=\"cursor-pointer\">\n                  <app-icon-error appLayoutDirection></app-icon-error>\n                </div>\n                <div class=\"cursor-pointer\">\n                  <app-icon-reset appLayoutDirection></app-icon-reset>\n                </div>\n              </div>\n              <div\n                *ngIf=\"file.status === fileDataStatus.UPLOADING\"\n                class=\"d-flex flex-row file-type-error cursor-pointer justify-content-center align-items-center\"\n              >\n                <app-icon-loading></app-icon-loading>\n              </div>\n              <span class=\"extension-name\"> {{ file.fileName }} </span>\n            </div>\n          </div>\n        </ng-template>\n      </div>\n    </ng-container>\n  </ng-container>\n  <input\n    #files\n    type=\"file\"\n    [multiple]=\"allowMultiple\"\n    [accept]=\"allowedExtension\"\n    class=\"d-none\"\n    onclick=\"this.value=null\"\n    (change)=\"addFiles($event)\"\n  />\n  <div\n    [className]=\"itemWrapperClass\"\n    *ngIf=\"!readonly && (allowMultiple || getFormValues.length === 0)\"\n  >\n    <div\n      class=\"form-control image-container justify-content-center align-items-center p-2 d-flex flex-column border-info round bg-white cursor-pointer d-inline-flex mb-3\"\n      (click)=\"files.click()\"\n    >\n      <ng-container>\n        <app-icon-upload-plus appLayoutDirection></app-icon-upload-plus>\n        <span class=\"text-mid-gray mt-2\">{{ placeholder }}</span>\n      </ng-container>\n    </div>\n  </div>\n  <div class=\"text-danger\" *ngIf=\"errors\">{{ errors }}</div>\n</div>\n<ng-template #preview let-modal>\n  <div class=\"modal-body text-center\">\n    <img\n      class=\"img-fluid\"\n      [src]=\"currentPreviewItem.file_url! | safe : 'url'\"\n    />\n  </div>\n</ng-template>\n", styles: [".h-100{height:100%}.bg-file{background-color:#e6dddd}.text-mid-gray{color:#8a979b}.mt-2{margin-top:.5rem}.multiple-upload i{color:#00aca9;cursor:pointer}.item-name{border-bottom:1px solid;word-break:break-word}.spinner-border{width:1rem;height:1rem;min-width:1rem;min-height:1rem}.image-container{box-sizing:border-box;height:188px;background-size:cover!important}.image-container .wrap-error{height:130px;grid-gap:1rem;gap:1rem}\n"], components: [{ type: i4.IconRemoveCircleComponent, selector: "app-icon-remove-circle", inputs: ["color"] }, { type: i5.IconErrorComponent, selector: "app-icon-error" }, { type: i6.IconResetComponent, selector: "app-icon-reset" }, { type: i7.IconLoadingComponent, selector: "app-icon-loading" }, { type: i8.IconFileComponent, selector: "app-icon-file" }, { type: i9.IconUploadPlusComponent, selector: "app-icon-upload-plus" }], directives: [{ type: i10.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i10.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i10.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i10.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], pipes: { "safe": i11.SafePipe } });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: SakaniUploadFilesComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'lib-sakani-upload-files',
                    templateUrl: './sakani-upload-files.component.html',
                    styleUrls: ['./sakani-upload-files.component.scss'],
                }]
        }], ctorParameters: function () { return [{ type: i1.NgControl }, { type: i1.FormBuilder }, { type: i2.SakaniUploadFilesService }, { type: i3.NgbModal }]; }, propDecorators: { translateService: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FrYW5pLXVwbG9hZC1maWxlcy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9zYWthbmktdXBsb2FkLWZpbGVzL3NyYy9saWIvc2FrYW5pLXVwbG9hZC1maWxlcy5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9zYWthbmktdXBsb2FkLWZpbGVzL3NyYy9saWIvc2FrYW5pLXVwbG9hZC1maWxlcy5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUVULFlBQVksRUFFWixLQUFLLEVBR0wsTUFBTSxFQUNOLFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQVN2QixPQUFPLEVBQ0wsYUFBYSxFQUNiLEtBQUssRUFDTCxRQUFRLEVBRVIsRUFBRSxHQUVILE1BQU0sTUFBTSxDQUFDO0FBQ2QsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3JFLE9BQU8sRUFDTCxhQUFhLEVBQ2IsZ0JBQWdCLEVBQ2hCLGdCQUFnQixFQUNoQixTQUFTLEdBQ1YsTUFBTSxzQkFBc0IsQ0FBQzs7Ozs7Ozs7Ozs7OztBQWE5QixNQUFNLE9BQU8sMEJBQTBCO0lBOEJyQyxZQUNVLE9BQWtCLEVBQ2xCLFdBQXdCLEVBQ3hCLHdCQUFrRCxFQUNsRCxZQUFzQjtRQUh0QixZQUFPLEdBQVAsT0FBTyxDQUFXO1FBQ2xCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLDZCQUF3QixHQUF4Qix3QkFBd0IsQ0FBMEI7UUFDbEQsaUJBQVksR0FBWixZQUFZLENBQVU7UUEzQmhDLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUc3QixvQkFBZSxHQUFHLEtBQUssQ0FBQztRQUN4QixTQUFJLEdBQVcsRUFBRSxDQUFDO1FBQ2xCLGdCQUFXLEdBQVcsRUFBRSxDQUFDO1FB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UUFBUSxFQUFFLHlCQUF5QjtvQkFDbkMsV0FBVyxFQUFFLHNDQUFzQztvQkFDbkQsU0FBUyxFQUFFLENBQUMsc0NBQXNDLENBQUM7aUJBQ3BEO3dMQVVVLGdCQUFnQjtzQkFBeEIsS0FBSztnQkFDRyxlQUFlO3NCQUF2QixLQUFLO2dCQUNHLElBQUk7c0JBQVosS0FBSztnQkFDRyxXQUFXO3NCQUFuQixLQUFLO2dCQUNHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBQ0csV0FBVztzQkFBbkIsS0FBSztnQkFDRyxTQUFTO3NCQUFqQixLQUFLO2dCQUNHLGFBQWE7c0JBQXJCLEtBQUs7Z0JBQ0csS0FBSztzQkFBYixLQUFLO2dCQUNHLGdCQUFnQjtzQkFBeEIsS0FBSztnQkFDRyxnQkFBZ0I7c0JBQXhCLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxRQUFRO3NCQUFoQixLQUFLO2dCQUNHLE1BQU07c0JBQWQsS0FBSztnQkFDRyxXQUFXO3NCQUFuQixLQUFLO2dCQUNJLGtCQUFrQjtzQkFBM0IsTUFBTTtnQkFDRyxlQUFlO3NCQUF4QixNQUFNO2dCQUNHLGdCQUFnQjtzQkFBekIsTUFBTTtnQkFDZSxVQUFVO3NCQUEvQixTQUFTO3VCQUFDLFNBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgVmlld0NoaWxkLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICBGb3JtQnVpbGRlcixcbiAgRm9ybUNvbnRyb2wsXG4gIEZvcm1Hcm91cCxcbiAgTmdDb250cm9sLFxufSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBOZ2JNb2RhbCB9IGZyb20gJ0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwJztcbmltcG9ydCB7XG4gIGNvbWJpbmVMYXRlc3QsXG4gIGRlZmVyLFxuICBmb3JrSm9pbixcbiAgT2JzZXJ2YWJsZSxcbiAgb2YsXG4gIFN1YnNjcmlwdGlvbixcbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBjYXRjaEVycm9yLCBmaW5hbGl6ZSwgbWFwLCBtZXJnZU1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7XG4gIGRhdGFVUklUb0Jsb2IsXG4gIEZJTEVfREFUQV9TVEFUVVMsXG4gIEdlbmVyYXRlQ2hlY2tzdW0sXG4gIFJlYWRBc3luYyxcbn0gZnJvbSAnLi4vaGVscGVycy91dGlsaXRpZXMnO1xuaW1wb3J0IHtcbiAgRmlsZURhdGFJbnRlcmZhY2UsXG4gIEZpbGVEYXRhU3RhdHVzVCxcbn0gZnJvbSAnLi4vaW50ZXJmYWNlcy9maWxlLWRhdGEuaW50ZXJmYWNlJztcbmltcG9ydCB7IERpcmVjdFVwbG9hZCB9IGZyb20gJy4uL21vZGVscy9kaXJlY3QtdXBsb2FkJztcbmltcG9ydCB7IFNha2FuaVVwbG9hZEZpbGVzU2VydmljZSB9IGZyb20gJy4vc2FrYW5pLXVwbG9hZC1maWxlcy5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbGliLXNha2FuaS11cGxvYWQtZmlsZXMnLFxuICB0ZW1wbGF0ZVVybDogJy4vc2FrYW5pLXVwbG9hZC1maWxlcy5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3Nha2FuaS11cGxvYWQtZmlsZXMuY29tcG9uZW50LnNjc3MnXSxcbn0pXG5leHBvcnQgY2xhc3MgU2FrYW5pVXBsb2FkRmlsZXNDb21wb25lbnRcbiAgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciwgT25Jbml0LCBPbkRlc3Ryb3lcbntcbiAgZmlsZXNDb250cm9sITogRm9ybUNvbnRyb2w7XG4gIGN1cnJlbnRQcmV2aWV3SXRlbSE6IEZpbGVEYXRhSW50ZXJmYWNlO1xuICBmaWxlc0Zvcm0hOiBGb3JtR3JvdXA7XG4gIGZvcm1TdWJzY3JpcHRpb24hOiBTdWJzY3JpcHRpb247XG4gIGZvcm1DaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgQElucHV0KCkgdHJhbnNsYXRlU2VydmljZTogYW55O1xuICBASW5wdXQoKSBpc0FjdGl2ZVN0b3JhZ2UgPSBmYWxzZTtcbiAgQElucHV0KCkgYXV0aDogc3RyaW5nID0gJyc7XG4gIEBJbnB1dCgpIGVuZHBvaW50QVBJOiBzdHJpbmcgPSAnJztcbiAgQElucHV0KCkgcmVxdWlyZWQgPSBmYWxzZTtcbiAgQElucHV0KCkgcGxhY2Vob2xkZXI6IHN0cmluZyA9ICdVcGxvYWQgW3Bob3RvIHR5cGVdJztcbiAgQElucHV0KCkgdXBsb2FkaW5nID0gZmFsc2U7XG4gIEBJbnB1dCgpIGFsbG93TXVsdGlwbGUgPSBmYWxzZTtcbiAgQElucHV0KCkgbGFiZWw6IHN0cmluZyA9ICcnO1xuICBASW5wdXQoKSBpdGVtV3JhcHBlckNsYXNzOiBzdHJpbmcgPSAnY29sLTEyIGNvbC1sZy0zIGNvbC14eGwtMic7XG4gIEBJbnB1dCgpIGFsbG93ZWRFeHRlbnNpb24gPSAnKic7IC8vICdpbWFnZS9wbmcsIGltYWdlL2pwZWcnXG4gIEBJbnB1dCgpIHJlYWRvbmx5ID0gZmFsc2U7XG4gIEBJbnB1dCgpIHVwbG9hZGVyITogc3RyaW5nIHwgbnVsbDtcbiAgQElucHV0KCkgZm9sZGVyITogc3RyaW5nIHwgbnVsbDtcbiAgQElucHV0KCkgbWF4RmlsZVNpemUhOiBudW1iZXI7IC8vIG1heCBmaWxlIHNpemUgaW4gTUJcbiAgQE91dHB1dCgpIHByb2Nlc3NVcGxvYWRFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nW10+KCk7XG4gIEBPdXRwdXQoKSBkZWxldGVGaWxlRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyPEZpbGVEYXRhSW50ZXJmYWNlPigpO1xuICBAT3V0cHV0KCkgZmlsZU9uQ2xpY2tFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXI8RmlsZURhdGFJbnRlcmZhY2U+KCk7XG4gIEBWaWV3Q2hpbGQoJ3ByZXZpZXcnKSBwcmV2aWV3VHBsITogRWxlbWVudFJlZjxhbnk+O1xuICBmaWxlRGF0YVN0YXR1cyA9IEZJTEVfREFUQV9TVEFUVVM7XG4gIGVycm9ycyA9ICcnO1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGNvbnRyb2w6IE5nQ29udHJvbCxcbiAgICBwcml2YXRlIGZvcm1CdWlsZGVyOiBGb3JtQnVpbGRlcixcbiAgICBwcml2YXRlIFNha2FuaVVwbG9hZEZpbGVzU2VydmljZTogU2FrYW5pVXBsb2FkRmlsZXNTZXJ2aWNlLFxuICAgIHByaXZhdGUgbW9kYWxTZXJ2aWNlOiBOZ2JNb2RhbFxuICApIHtcbiAgICBpZiAodGhpcy5jb250cm9sKSB7XG4gICAgICB0aGlzLmNvbnRyb2wudmFsdWVBY2Nlc3NvciA9IHRoaXM7XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7fVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuZm9ybVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5mb3JtQ2hhbmdlZC5zdWJzY3JpYmUoZm4pO1xuICB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQge31cblxuICBzdWJzY3JpcHRpb25GaWxlc0Zvcm0oKSB7XG4gICAgaWYgKHRoaXMuZm9ybVN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5mb3JtU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5mb3JtU3Vic2NyaXB0aW9uID0gdGhpcy5maWxlc0Zvcm0udmFsdWVDaGFuZ2VzLnN1YnNjcmliZSgodmFsKSA9PiB7XG4gICAgICB0aGlzLmZvcm1DaGFuZ2VkLmVtaXQodmFsKTtcbiAgICB9KTtcbiAgfVxuXG4gIHdyaXRlVmFsdWUoY29udHJvbHM6IGFueSk6IHZvaWQge1xuICAgIGlmIChjb250cm9scykge1xuICAgICAgdGhpcy5maWxlc0Zvcm0gPSB0aGlzLmZvcm1CdWlsZGVyLmdyb3VwKGNvbnRyb2xzKTtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9uRmlsZXNGb3JtKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZmlsZXNGb3JtID0gdGhpcy5mb3JtQnVpbGRlci5ncm91cCh7fSk7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbkZpbGVzRm9ybSgpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZVVwbG9hZEl0ZW0oaXRlbTogRmlsZURhdGFJbnRlcmZhY2UpOiBPYnNlcnZhYmxlPHN0cmluZyB8IHVuZGVmaW5lZD4ge1xuICAgIHJldHVybiBkZWZlcigoKSA9PiB7XG4gICAgICBpdGVtLnN0YXR1cyA9IHRoaXMuZmlsZURhdGFTdGF0dXMuVVBMT0FESU5HIGFzIEZpbGVEYXRhU3RhdHVzVDtcbiAgICAgIHRoaXMuZmlsZXNGb3JtLnBhdGNoVmFsdWUoeyBbaXRlbS5pZF06IHsgLi4uaXRlbSB9IH0pO1xuICAgICAgbGV0IGJsb2I6IGFueTtcbiAgICAgIC8vIHJlYWQgZmlsZSBhbmQgZ2VuZXJhdGUgY2hlY2tzdW1cbiAgICAgIHJldHVybiBSZWFkQXN5bmMoaXRlbSkucGlwZShcbiAgICAgICAgbWVyZ2VNYXAoKGZpbGU6IEFycmF5QnVmZmVyKSA9PiB7XG4gICAgICAgICAgY29uc3QgY2hlY2tzdW0gPSBHZW5lcmF0ZUNoZWNrc3VtKGZpbGUpO1xuICAgICAgICAgIGl0ZW0uY2hlY2tzdW0gPSBjaGVja3N1bSBhcyBzdHJpbmc7XG4gICAgICAgICAgYmxvYiA9IGZpbGU7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuaXNBY3RpdmVTdG9yYWdlXG4gICAgICAgICAgICA/IHRoaXMuU2FrYW5pVXBsb2FkRmlsZXNTZXJ2aWNlLmRpcmVjdFVwbG9hZEJ5QWN0aXZlUmVjb3JkKHtcbiAgICAgICAgICAgICAgICBhdXRoOiB0aGlzLmF1dGgsXG4gICAgICAgICAgICAgICAgZmlsZTogaXRlbSxcbiAgICAgICAgICAgICAgICBhcGlVcmw6IHRoaXMuZW5kcG9pbnRBUEksXG4gICAgICAgICAgICAgICAgZm9sZGVyOiB0aGlzLmZvbGRlcixcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIDogdGhpcy5TYWthbmlVcGxvYWRGaWxlc1NlcnZpY2UuZGlyZWN0VXBsb2FkKHtcbiAgICAgICAgICAgICAgICBhdXRoOiB0aGlzLmF1dGgsXG4gICAgICAgICAgICAgICAgZmlsZTogaXRlbSxcbiAgICAgICAgICAgICAgICBhcGlVcmw6IHRoaXMuZW5kcG9pbnRBUEksXG4gICAgICAgICAgICAgICAgdXBsb2FkZXI6IHRoaXMudXBsb2FkZXIsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KSxcbiAgICAgICAgbWVyZ2VNYXAoKHJlcykgPT4ge1xuICAgICAgICAgIGl0ZW0ucHVibGljX3VybCA9IHJlcz8ucHVibGljX3VybDtcbiAgICAgICAgICBpdGVtLnNpZ25lZF9ibG9iX2lkID0gcmVzPy5ibG9iX3NpZ25lZF9pZDtcbiAgICAgICAgICByZXR1cm4gY29tYmluZUxhdGVzdChbXG4gICAgICAgICAgICBvZihyZXMpLFxuICAgICAgICAgICAgdGhpcy5TYWthbmlVcGxvYWRGaWxlc1NlcnZpY2UuczNVcGxvYWQoXG4gICAgICAgICAgICAgIHJlcz8ucHJlc2lnbmVkX3VybCB8fCByZXM/LnVybCB8fCAnJyxcbiAgICAgICAgICAgICAgYmxvYixcbiAgICAgICAgICAgICAgcmVzPy5oZWFkZXJzXG4gICAgICAgICAgICApLFxuICAgICAgICAgIF0pO1xuICAgICAgICB9KSxcbiAgICAgICAgY2F0Y2hFcnJvcigoZXJyKSA9PiB7XG4gICAgICAgICAgaXRlbS5zdGF0dXMgPSB0aGlzLmZpbGVEYXRhU3RhdHVzLkVSUk9SIGFzIEZpbGVEYXRhU3RhdHVzVDtcbiAgICAgICAgICByZXR1cm4gb2YodW5kZWZpbmVkKTtcbiAgICAgICAgfSksXG4gICAgICAgIG1hcCgocmVzKSA9PiB7XG4gICAgICAgICAgaWYgKHJlcykgcmV0dXJuIChyZXNbMF0gYXMgRGlyZWN0VXBsb2FkKS5wdWJsaWNfdXJsO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSksXG4gICAgICAgIGZpbmFsaXplKCgpID0+IHtcbiAgICAgICAgICBpZiAoaXRlbS5zdGF0dXMgIT09IHRoaXMuZmlsZURhdGFTdGF0dXMuRVJST1IpIHtcbiAgICAgICAgICAgIGl0ZW0uc3RhdHVzID0gdGhpcy5maWxlRGF0YVN0YXR1cy5VUExPQURFRCBhcyBGaWxlRGF0YVN0YXR1c1Q7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IGl0ZW1Gb3JtVmFsdWUgPSB0aGlzLmZpbGVzRm9ybS52YWx1ZVtpdGVtLmlkXTtcbiAgICAgICAgICB0aGlzLmZpbGVzRm9ybS5wYXRjaFZhbHVlKHtcbiAgICAgICAgICAgIFtpdGVtLmlkXTogeyAuLi5pdGVtRm9ybVZhbHVlLCAuLi5pdGVtIH0sXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pLFxuICAgICAgICBjYXRjaEVycm9yKChlcnIpID0+IHtcbiAgICAgICAgICByZXR1cm4gb2YodW5kZWZpbmVkKTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfSk7XG4gIH1cblxuICBpc0ZpbGVVcmxJbWFnZSh0eXBlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBpZiAoIXR5cGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHR5cGU/LmluY2x1ZGVzKCdpbWFnZScpO1xuICB9XG5cbiAgaGFuZGxlVXBsb2FkSXRlbXMoaXRlbXM6IEZpbGVEYXRhSW50ZXJmYWNlW10pIHtcbiAgICBjb25zdCB1cGxvYWRPYnMgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgaXRlbXMpIHtcbiAgICAgIGNvbnN0IG9icyA9IHRoaXMuaGFuZGxlVXBsb2FkSXRlbShpdGVtKTtcbiAgICAgIGlmIChvYnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB1cGxvYWRPYnMucHVzaChvYnMpO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3JrSm9pbih1cGxvYWRPYnMpLnN1YnNjcmliZSgocmVzOiAoc3RyaW5nIHwgdW5kZWZpbmVkKVtdKSA9PiB7XG4gICAgICBjb25zdCB0bXBSZXMgPSByZXMuZmlsdGVyKCh4KSA9PiB4KSBhcyBzdHJpbmdbXTtcbiAgICAgIHRoaXMucHJvY2Vzc1VwbG9hZEV2ZW50LmVtaXQodG1wUmVzKTtcbiAgICB9KTtcbiAgfVxuXG4gIGFkZEZpbGVzKGV2ZW50OiBFdmVudCkge1xuICAgIGNvbnN0IGZpbGVzOiBGaWxlTGlzdCA9IChldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudClcbiAgICAgIC5maWxlcyBhcyBGaWxlTGlzdDtcbiAgICBjb25zdCBmaWxlRGF0YSA9IFtdO1xuICAgIHRoaXMuZXJyb3JzID0gJyc7XG4gICAgZm9yIChjb25zdCBmaWxlIG9mIEFycmF5LmZyb20oZmlsZXMpKSB7XG4gICAgICBpZiAodGhpcy5tYXhGaWxlU2l6ZSAmJiBmaWxlLnNpemUgPiB0aGlzLm1heEZpbGVTaXplKSB7XG4gICAgICAgIGNvbnN0IG1heFNpemUgPSBNYXRoLmZsb29yKHRoaXMubWF4RmlsZVNpemUgLyAxMDAwMDAwKTtcbiAgICAgICAgdGhpcy5lcnJvcnMgPSB0aGlzLnRyYW5zbGF0ZVNlcnZpY2UuaW5zdGFudChcbiAgICAgICAgICAnRVJST1JTLkZJTEVfU0laRV9UT09fQklHJyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtYXhTaXplLFxuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB0bXBGaWxlRGF0YSA9IHtcbiAgICAgICAgICBpZDogJ18nICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDIsIDkpLFxuICAgICAgICAgIGRhdGE6IGZpbGUsXG4gICAgICAgICAgc3RhdHVzOiB0aGlzLmZpbGVEYXRhU3RhdHVzLldBSVRJTkcsXG4gICAgICAgICAgaXNSZWNvcmQ6IGZhbHNlLFxuICAgICAgICB9IGFzIEZpbGVEYXRhSW50ZXJmYWNlO1xuICAgICAgICBmaWxlRGF0YS5wdXNoKHRtcEZpbGVEYXRhKTtcbiAgICAgICAgdGhpcy5yZWFkRmlsZShmaWxlLCB0bXBGaWxlRGF0YSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5oYW5kbGVVcGxvYWRJdGVtcyhmaWxlRGF0YSk7XG4gIH1cblxuICByZWFkRmlsZShmaWxlOiBGaWxlLCBmaWxlRGF0YTogRmlsZURhdGFJbnRlcmZhY2UpIHtcbiAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xuXG4gICAgcmVhZGVyLm9ubG9hZGVuZCA9ICgpID0+IHtcbiAgICAgIGNvbnN0IGZpbGVDb250ZW50OiBzdHJpbmcgPSByZWFkZXIucmVzdWx0IGFzIHN0cmluZztcbiAgICAgIGNvbnN0IGJsb2IgPSBkYXRhVVJJVG9CbG9iKGZpbGVDb250ZW50KTtcbiAgICAgIHRoaXMuYWRkQ29udHJvbEZvcm0oe1xuICAgICAgICAuLi5maWxlRGF0YSxcbiAgICAgICAgY29udGVudF90eXBlOiBibG9iLnR5cGUsXG4gICAgICAgIGZpbGVuYW1lOiBmaWxlLm5hbWUsXG4gICAgICAgIGZpbGVfdXJsOiBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpLFxuICAgICAgfSk7XG4gICAgfTtcbiAgfVxuXG4gIGRvd25sb2FkRmlsZShmaWxlOiBGaWxlRGF0YUludGVyZmFjZSkge1xuICAgIGlmIChmaWxlICYmIGZpbGUuZmlsZV91cmwpIHtcbiAgICAgIHdpbmRvdy5vcGVuKGZpbGUuZmlsZV91cmwpO1xuICAgIH1cbiAgfVxuXG4gIGFkZENvbnRyb2xGb3JtKGZpbGVEYXRhOiBGaWxlRGF0YUludGVyZmFjZSkge1xuICAgIHRoaXMuZmlsZXNGb3JtLmFkZENvbnRyb2woZmlsZURhdGEuaWQsIHRoaXMuZm9ybUJ1aWxkZXIuY29udHJvbChmaWxlRGF0YSkpO1xuICB9XG5cbiAgcmVVcGxvYWQoJGV2ZW50OiBFdmVudCwgaXRlbTogRmlsZURhdGFJbnRlcmZhY2UpIHtcbiAgICAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgY29uc3QgdXBsb2FkT2JzID0gW107XG4gICAgY29uc3Qgb2JzID0gdGhpcy5oYW5kbGVVcGxvYWRJdGVtKGl0ZW0pO1xuICAgIHVwbG9hZE9icy5wdXNoKG9icyk7XG4gICAgZm9ya0pvaW4odXBsb2FkT2JzKS5zdWJzY3JpYmUoKHJlczogKHN0cmluZyB8IHVuZGVmaW5lZClbXSkgPT4ge1xuICAgICAgY29uc3QgdG1wUmVzID0gcmVzLmZpbHRlcigoeCkgPT4geCkgYXMgc3RyaW5nW107XG4gICAgICB0aGlzLnByb2Nlc3NVcGxvYWRFdmVudC5lbWl0KHRtcFJlcyk7XG4gICAgfSk7XG4gIH1cblxuICBmaWxlT25DbGljayhpdGVtOiBGaWxlRGF0YUludGVyZmFjZSkge1xuICAgIHRoaXMuZmlsZU9uQ2xpY2tFdmVudC5lbWl0KGl0ZW0pO1xuICB9XG5cbiAgcHJldmlld0l0ZW0oaXRlbTogRmlsZURhdGFJbnRlcmZhY2UpIHtcbiAgICB0aGlzLmN1cnJlbnRQcmV2aWV3SXRlbSA9IGl0ZW07XG4gICAgdGhpcy5nZXRQcmV2aWV3SW1hZ2UoKTtcbiAgICB0aGlzLm1vZGFsU2VydmljZS5vcGVuKHRoaXMucHJldmlld1RwbCwge1xuICAgICAgY2VudGVyZWQ6IHRydWUsXG4gICAgICBzaXplOiAneGwnLFxuICAgIH0pO1xuICB9XG5cbiAgZ2V0UHJldmlld0ltYWdlKCk6IHN0cmluZyB8IHZvaWQge1xuICAgIGlmICghdGhpcy5jdXJyZW50UHJldmlld0l0ZW0uZmlsZV91cmwpIHtcbiAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICByZWFkZXIub25sb2FkID0gKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgICAgdGhpcy5jdXJyZW50UHJldmlld0l0ZW0uZmlsZV91cmwgPSBldmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgfTtcbiAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKHRoaXMuY3VycmVudFByZXZpZXdJdGVtLmRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5jdXJyZW50UHJldmlld0l0ZW0uZmlsZV91cmw7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGdldEZvcm1WYWx1ZXMoKTogYW55W10ge1xuICAgIHJldHVybiAoT2JqZWN0LnZhbHVlcyh0aGlzLmZpbGVzRm9ybS52YWx1ZSkgYXMgRmlsZURhdGFJbnRlcmZhY2VbXSkuZmlsdGVyKFxuICAgICAgKHBob3RvOiBGaWxlRGF0YUludGVyZmFjZSkgPT4gIXBob3RvPy5fZGVzdHJveVxuICAgICk7XG4gIH1cblxuICBjbG9zZVByZXZpZXcoKSB7XG4gICAgdGhpcy5tb2RhbFNlcnZpY2UuZGlzbWlzc0FsbCgpO1xuICB9XG5cbiAgaXNJbnZhbGlkKGl0ZW06IEZpbGVEYXRhSW50ZXJmYWNlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGl0ZW0uc3RhdHVzID09PSAnZXJyb3InO1xuICB9XG5cbiAgcmVtb3ZlKCRldmVudDogRXZlbnQsIGZpbGU6IEZpbGVEYXRhSW50ZXJmYWNlKSB7XG4gICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGlmIChmaWxlLmlzUmVjb3JkKSB7XG4gICAgICB0aGlzLmZpbGVzRm9ybS5wYXRjaFZhbHVlKHtcbiAgICAgICAgW2ZpbGUuaWRdOiB7IC4uLmZpbGUsIGlzUmVjb3JkOiBmYWxzZSwgX2Rlc3Ryb3k6IHRydWUgfSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmZpbGVzRm9ybS5yZW1vdmVDb250cm9sKGZpbGUuaWQpO1xuICAgIH1cbiAgfVxufVxuIiwiPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXAgcm93XCI+XG4gIDxuZy1jb250YWluZXIgKm5nSWY9XCJnZXRGb3JtVmFsdWVzLmxlbmd0aCA+IDBcIj5cbiAgICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBmaWxlIG9mIGdldEZvcm1WYWx1ZXM7IGluZGV4IGFzIGlcIj5cbiAgICAgIDxkaXYgW2NsYXNzTmFtZV09XCJpdGVtV3JhcHBlckNsYXNzXCI+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJsYWJlbFwiPlxuICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImZvcm0tbGFiZWxcIlxuICAgICAgICAgICAgPnt7IGxhYmVsIH19PHNwYW4gKm5nSWY9XCJhbGxvd011bHRpcGxlXCI+e3sgaSArIDEgfX08L3NwYW5cbiAgICAgICAgICAgID48c3BhbiAqbmdJZj1cInJlcXVpcmVkXCIgY2xhc3M9XCJyZXF1aXJlZC1maWVsZFwiPiAqPC9zcGFuPjwvbGFiZWxcbiAgICAgICAgICA+XG4gICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgKm5nSWY9XCJpc0ZpbGVVcmxJbWFnZShmaWxlLmNvbnRlbnRfdHlwZSk7IGVsc2UgZmlsZUJsb2NrXCJcbiAgICAgICAgICBjbGFzcz1cImZvcm0tY29udHJvbCBpbWFnZS1jb250YWluZXIgcC0yIGQtZmxleCBmbGV4LWNvbHVtbiBib3JkZXItaW5mbyByb3VuZCBiZy13aGl0ZSBjdXJzb3ItcG9pbnRlciBtYi0zXCJcbiAgICAgICAgICBbbmdDbGFzc109XCJ7XG4gICAgICAgICAgICBpbnZhbGlkOiBpc0ludmFsaWQoZmlsZSksXG4gICAgICAgICAgICB2YWxpZDogIWlzSW52YWxpZChmaWxlKVxuICAgICAgICAgIH1cIlxuICAgICAgICAgIChjbGljayk9XCJwcmV2aWV3SXRlbShmaWxlKVwiXG4gICAgICAgICAgW25nU3R5bGVdPVwieyAnYmFja2dyb3VuZC1pbWFnZSc6ICd1cmwoJyArIGZpbGUuZmlsZV91cmwgKyAnKScgfVwiXG4gICAgICAgID5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzcz1cImN1cnNvci1wb2ludGVyIGQtZmxleCBqdXN0aWZ5LWNvbnRlbnQtZW5kIGFsaWduLWl0ZW1zLWVuZFwiXG4gICAgICAgICAgICAqbmdJZj1cIiFyZWFkb25seVwiXG4gICAgICAgICAgICBhcHBMYXlvdXREaXJlY3Rpb25cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8YXBwLWljb24tcmVtb3ZlLWNpcmNsZVxuICAgICAgICAgICAgICAoY2xpY2spPVwicmVtb3ZlKCRldmVudCwgZmlsZSlcIlxuICAgICAgICAgICAgPjwvYXBwLWljb24tcmVtb3ZlLWNpcmNsZT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAqbmdJZj1cImZpbGUuc3RhdHVzID09PSBmaWxlRGF0YVN0YXR1cy5FUlJPUlwiXG4gICAgICAgICAgICBjbGFzcz1cImQtZmxleCBmbGV4LXJvdyB3cmFwLWVycm9yIGN1cnNvci1wb2ludGVyIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyIGdhcC0zXCJcbiAgICAgICAgICAgIChjbGljayk9XCJyZVVwbG9hZCgkZXZlbnQsIGZpbGUpXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY3Vyc29yLXBvaW50ZXJcIj5cbiAgICAgICAgICAgICAgPGFwcC1pY29uLWVycm9yIGFwcExheW91dERpcmVjdGlvbj48L2FwcC1pY29uLWVycm9yPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY3Vyc29yLXBvaW50ZXJcIj5cbiAgICAgICAgICAgICAgPGFwcC1pY29uLXJlc2V0IGFwcExheW91dERpcmVjdGlvbj48L2FwcC1pY29uLXJlc2V0PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgKm5nSWY9XCJmaWxlLnN0YXR1cyA9PT0gZmlsZURhdGFTdGF0dXMuVVBMT0FESU5HXCJcbiAgICAgICAgICAgIGNsYXNzPVwiZC1mbGV4IGZsZXgtcm93IHdyYXAtZXJyb3IgY3Vyc29yLXBvaW50ZXIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxhcHAtaWNvbi1sb2FkaW5nPjwvYXBwLWljb24tbG9hZGluZz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxuZy10ZW1wbGF0ZSAjZmlsZUJsb2NrPlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzPVwiZm9ybS1jb250cm9sIGltYWdlLWNvbnRhaW5lciBwLTIgZC1mbGV4IGZsZXgtY29sdW1uIGJvcmRlci1pbmZvIHJvdW5kIGJnLWZpbGUgY3Vyc29yLXBvaW50ZXIgbWItM1wiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICBjbGFzcz1cImN1cnNvci1wb2ludGVyIGQtZmxleCBqdXN0aWZ5LWNvbnRlbnQtZW5kIGFsaWduLWl0ZW1zLWVuZFwiXG4gICAgICAgICAgICAgICpuZ0lmPVwiIXJlYWRvbmx5XCJcbiAgICAgICAgICAgICAgYXBwTGF5b3V0RGlyZWN0aW9uXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxhcHAtaWNvbi1yZW1vdmUtY2lyY2xlXG4gICAgICAgICAgICAgICAgKGNsaWNrKT1cInJlbW92ZSgkZXZlbnQsIGZpbGUpXCJcbiAgICAgICAgICAgICAgPjwvYXBwLWljb24tcmVtb3ZlLWNpcmNsZT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICBjbGFzcz1cImQtZmxleCBmbGV4LWNvbHVtbiBoLTEwMCB3cmFwLWVycm9yIGN1cnNvci1wb2ludGVyIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCJcbiAgICAgICAgICAgICAgKGNsaWNrKT1cImRvd25sb2FkRmlsZShmaWxlKVwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxhcHAtaWNvbi1maWxlPjwvYXBwLWljb24tZmlsZT5cbiAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICpuZ0lmPVwiZmlsZS5zdGF0dXMgPT09IGZpbGVEYXRhU3RhdHVzLkVSUk9SXCJcbiAgICAgICAgICAgICAgICBjbGFzcz1cImQtZmxleCBmbGV4LXJvdyBmaWxlLXR5cGUtZXJyb3IgY3Vyc29yLXBvaW50ZXIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXIgZ2FwLTNcIlxuICAgICAgICAgICAgICAgIChjbGljayk9XCJyZVVwbG9hZCgkZXZlbnQsIGZpbGUpXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjdXJzb3ItcG9pbnRlclwiPlxuICAgICAgICAgICAgICAgICAgPGFwcC1pY29uLWVycm9yIGFwcExheW91dERpcmVjdGlvbj48L2FwcC1pY29uLWVycm9yPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjdXJzb3ItcG9pbnRlclwiPlxuICAgICAgICAgICAgICAgICAgPGFwcC1pY29uLXJlc2V0IGFwcExheW91dERpcmVjdGlvbj48L2FwcC1pY29uLXJlc2V0PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICpuZ0lmPVwiZmlsZS5zdGF0dXMgPT09IGZpbGVEYXRhU3RhdHVzLlVQTE9BRElOR1wiXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJkLWZsZXggZmxleC1yb3cgZmlsZS10eXBlLWVycm9yIGN1cnNvci1wb2ludGVyIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxhcHAtaWNvbi1sb2FkaW5nPjwvYXBwLWljb24tbG9hZGluZz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZXh0ZW5zaW9uLW5hbWVcIj4ge3sgZmlsZS5maWxlTmFtZSB9fSA8L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgIDwvZGl2PlxuICAgIDwvbmctY29udGFpbmVyPlxuICA8L25nLWNvbnRhaW5lcj5cbiAgPGlucHV0XG4gICAgI2ZpbGVzXG4gICAgdHlwZT1cImZpbGVcIlxuICAgIFttdWx0aXBsZV09XCJhbGxvd011bHRpcGxlXCJcbiAgICBbYWNjZXB0XT1cImFsbG93ZWRFeHRlbnNpb25cIlxuICAgIGNsYXNzPVwiZC1ub25lXCJcbiAgICBvbmNsaWNrPVwidGhpcy52YWx1ZT1udWxsXCJcbiAgICAoY2hhbmdlKT1cImFkZEZpbGVzKCRldmVudClcIlxuICAvPlxuICA8ZGl2XG4gICAgW2NsYXNzTmFtZV09XCJpdGVtV3JhcHBlckNsYXNzXCJcbiAgICAqbmdJZj1cIiFyZWFkb25seSAmJiAoYWxsb3dNdWx0aXBsZSB8fCBnZXRGb3JtVmFsdWVzLmxlbmd0aCA9PT0gMClcIlxuICA+XG4gICAgPGRpdlxuICAgICAgY2xhc3M9XCJmb3JtLWNvbnRyb2wgaW1hZ2UtY29udGFpbmVyIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyIHAtMiBkLWZsZXggZmxleC1jb2x1bW4gYm9yZGVyLWluZm8gcm91bmQgYmctd2hpdGUgY3Vyc29yLXBvaW50ZXIgZC1pbmxpbmUtZmxleCBtYi0zXCJcbiAgICAgIChjbGljayk9XCJmaWxlcy5jbGljaygpXCJcbiAgICA+XG4gICAgICA8bmctY29udGFpbmVyPlxuICAgICAgICA8YXBwLWljb24tdXBsb2FkLXBsdXMgYXBwTGF5b3V0RGlyZWN0aW9uPjwvYXBwLWljb24tdXBsb2FkLXBsdXM+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwidGV4dC1taWQtZ3JheSBtdC0yXCI+e3sgcGxhY2Vob2xkZXIgfX08L3NwYW4+XG4gICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJ0ZXh0LWRhbmdlclwiICpuZ0lmPVwiZXJyb3JzXCI+e3sgZXJyb3JzIH19PC9kaXY+XG48L2Rpdj5cbjxuZy10ZW1wbGF0ZSAjcHJldmlldyBsZXQtbW9kYWw+XG4gIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5IHRleHQtY2VudGVyXCI+XG4gICAgPGltZ1xuICAgICAgY2xhc3M9XCJpbWctZmx1aWRcIlxuICAgICAgW3NyY109XCJjdXJyZW50UHJldmlld0l0ZW0uZmlsZV91cmwhIHwgc2FmZSA6ICd1cmwnXCJcbiAgICAvPlxuICA8L2Rpdj5cbjwvbmctdGVtcGxhdGU+XG4iXX0=