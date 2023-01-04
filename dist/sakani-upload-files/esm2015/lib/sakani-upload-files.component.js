/** @format */
import { Component, EventEmitter, Input, Output, ViewChild, } from "@angular/core";
import { combineLatest, defer, forkJoin, of } from "rxjs";
import { catchError, finalize, map, mergeMap } from "rxjs/operators";
import { dataURIToBlob, FILE_DATA_STATUS, GenerateChecksum, ReadAsync, } from "../helpers/utilities";
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "./sakani-upload-files.service";
import * as i3 from "../services/modal.service";
import * as i4 from "../components/svgs/icon-remove-circle/icon-remove-circle.component";
import * as i5 from "../components/svgs/icon-error/icon-error.component";
import * as i6 from "../components/svgs/icon-reset/icon-reset.component";
import * as i7 from "../components/svgs/icon-loading/icon-loading.component";
import * as i8 from "../components/svgs/icon-file/icon-file.component";
import * as i9 from "../components/svgs/icon-upload-plus/icon-upload-plus.component";
import * as i10 from "../components/modal/modal.component";
import * as i11 from "@angular/common";
import * as i12 from "../pipes/safe.pipe";
export class SakaniUploadFilesComponent {
    constructor(control, formBuilder, SakaniUploadFilesService, modalService) {
        this.control = control;
        this.formBuilder = formBuilder;
        this.SakaniUploadFilesService = SakaniUploadFilesService;
        this.modalService = modalService;
        this.formChanged = new EventEmitter();
        this.isActiveStorage = false;
        this.headers = "";
        this.endpointAPI = "";
        this.required = false;
        this.placeholder = "Upload [photo type]";
        this.uploading = false;
        this.allowMultiple = false;
        this.label = "";
        this.itemWrapperClass = "col-12 col-lg-3 col-xxl-2";
        this.allowContentType = "*"; // 'image/png, image/jpeg'
        this.readonly = false;
        this.processUploadEvent = new EventEmitter();
        this.deleteFileEvent = new EventEmitter();
        this.fileOnClickEvent = new EventEmitter();
        this.fileDataStatus = FILE_DATA_STATUS;
        this.errors = "";
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
                        headers: this.headers,
                        file: item,
                        apiUrl: this.endpointAPI,
                        folder: this.folder,
                    })
                    : this.SakaniUploadFilesService.directUpload({
                        headers: this.headers,
                        file: item,
                        apiUrl: this.endpointAPI,
                        uploader: this.uploader,
                    });
            }), mergeMap((res) => {
                item.public_url = res === null || res === void 0 ? void 0 : res.public_url;
                item.signed_blob_id = res === null || res === void 0 ? void 0 : res.blob_signed_id;
                return combineLatest([
                    of(res),
                    this.SakaniUploadFilesService.s3Upload((res === null || res === void 0 ? void 0 : res.presigned_url) || (res === null || res === void 0 ? void 0 : res.url) || "", blob, res === null || res === void 0 ? void 0 : res.headers),
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
        return type === null || type === void 0 ? void 0 : type.includes("image");
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
        const files = event.target.files;
        const fileData = [];
        this.errors = "";
        for (const file of Array.from(files)) {
            if (this.maxFileSize && file.size > this.maxFileSize) {
                const maxSize = Math.floor(this.maxFileSize / 1000000);
                this.errors = this.translateService.instant("ERRORS.FILE_SIZE_TOO_BIG", {
                    maxSize,
                });
                continue;
            }
            else {
                const tmpFileData = {
                    id: "_" + Math.random().toString(36).substring(2, 9),
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
        this.modalService.open();
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
        this.modalService.close();
    }
    isInvalid(item) {
        return item.status === "error";
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
SakaniUploadFilesComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: SakaniUploadFilesComponent, deps: [{ token: i1.NgControl }, { token: i1.FormBuilder }, { token: i2.SakaniUploadFilesService }, { token: i3.ModalService }], target: i0.ɵɵFactoryTarget.Component });
SakaniUploadFilesComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.2.17", type: SakaniUploadFilesComponent, selector: "lib-sakani-upload-files", inputs: { translateService: "translateService", isActiveStorage: "isActiveStorage", headers: "headers", endpointAPI: "endpointAPI", required: "required", placeholder: "placeholder", uploading: "uploading", allowMultiple: "allowMultiple", label: "label", itemWrapperClass: "itemWrapperClass", allowContentType: "allowContentType", readonly: "readonly", uploader: "uploader", folder: "folder", maxFileSize: "maxFileSize" }, outputs: { processUploadEvent: "processUploadEvent", deleteFileEvent: "deleteFileEvent", fileOnClickEvent: "fileOnClickEvent" }, viewQueries: [{ propertyName: "previewTpl", first: true, predicate: ["preview"], descendants: true }], ngImport: i0, template: "<!-- @format -->\n\n<div class=\"form-group row\">\n  <ng-container *ngIf=\"getFormValues.length > 0\">\n    <ng-container *ngFor=\"let file of getFormValues; index as i\">\n      <div [className]=\"itemWrapperClass\">\n        <ng-container *ngIf=\"label\">\n          <label class=\"form-label\"\n            >{{ label }}<span *ngIf=\"allowMultiple\">{{ i + 1 }}</span\n            ><span *ngIf=\"required\" class=\"required-field\"> *</span></label\n          >\n        </ng-container>\n        <div\n          *ngIf=\"isFileUrlImage(file.content_type); else fileBlock\"\n          class=\"form-control image-container p-2 d-flex flex-column border-info round bg-white cursor-pointer mb-3\"\n          [ngClass]=\"{\n            invalid: isInvalid(file),\n            valid: !isInvalid(file)\n          }\"\n          (click)=\"previewItem(file)\"\n          [ngStyle]=\"{ 'background-image': 'url(' + file.file_url + ')' }\"\n        >\n          <div\n            class=\"cursor-pointer d-flex justify-content-end align-items-end\"\n            *ngIf=\"!readonly\"\n            appLayoutDirection\n          >\n            <app-icon-remove-circle\n              (click)=\"remove($event, file)\"\n            ></app-icon-remove-circle>\n          </div>\n          <div\n            *ngIf=\"file.status === fileDataStatus.ERROR\"\n            class=\"d-flex flex-row wrap-error cursor-pointer justify-content-center align-items-center gap-3\"\n          >\n            <div class=\"cursor-pointer\">\n              <app-icon-error appLayoutDirection></app-icon-error>\n            </div>\n            <div class=\"cursor-pointer\" (click)=\"reUpload($event, file)\">\n              <app-icon-reset appLayoutDirection></app-icon-reset>\n            </div>\n          </div>\n          <div\n            *ngIf=\"file.status === fileDataStatus.UPLOADING\"\n            class=\"d-flex flex-row wrap-error cursor-pointer justify-content-center align-items-center\"\n          >\n            <app-icon-loading></app-icon-loading>\n          </div>\n        </div>\n        <ng-template #fileBlock>\n          <div\n            class=\"form-control image-container p-2 d-flex flex-column border-info round bg-file cursor-pointer mb-3\"\n          >\n            <div\n              class=\"cursor-pointer d-flex justify-content-end align-items-end\"\n              *ngIf=\"!readonly\"\n              appLayoutDirection\n            >\n              <app-icon-remove-circle\n                (click)=\"remove($event, file)\"\n              ></app-icon-remove-circle>\n            </div>\n            <div\n              class=\"d-flex flex-column h-100 wrap-error cursor-pointer justify-content-center align-items-center\"\n              (click)=\"downloadFile(file)\"\n            >\n              <app-icon-file></app-icon-file>\n              <div\n                *ngIf=\"file.status === fileDataStatus.ERROR\"\n                class=\"d-flex flex-row file-type-error cursor-pointer justify-content-center align-items-center gap-3\"\n              >\n                <div class=\"cursor-pointer\">\n                  <app-icon-error appLayoutDirection></app-icon-error>\n                </div>\n                <div class=\"cursor-pointer\" (click)=\"reUpload($event, file)\">\n                  <app-icon-reset appLayoutDirection></app-icon-reset>\n                </div>\n              </div>\n              <div\n                *ngIf=\"file.status === fileDataStatus.UPLOADING\"\n                class=\"d-flex flex-row file-type-error cursor-pointer justify-content-center align-items-center\"\n              >\n                <app-icon-loading></app-icon-loading>\n              </div>\n              <span class=\"extension-name\"> {{ file.fileName }} </span>\n            </div>\n          </div>\n        </ng-template>\n      </div>\n    </ng-container>\n  </ng-container>\n  <input\n    #files\n    type=\"file\"\n    [multiple]=\"allowMultiple\"\n    [accept]=\"allowContentType\"\n    class=\"d-none\"\n    onclick=\"this.value=null\"\n    (change)=\"addFiles($event)\"\n  />\n  <div\n    [className]=\"itemWrapperClass\"\n    *ngIf=\"!readonly && (allowMultiple || getFormValues.length === 0)\"\n  >\n    <div\n      class=\"form-control image-container justify-content-center align-items-center p-2 d-flex flex-column border-info round bg-white cursor-pointer d-inline-flex mb-3\"\n      (click)=\"files.click()\"\n    >\n      <ng-container>\n        <app-icon-upload-plus appLayoutDirection></app-icon-upload-plus>\n        <span class=\"text-mid-gray mt-2\">{{ placeholder }}</span>\n      </ng-container>\n    </div>\n  </div>\n  <div class=\"text-danger\" *ngIf=\"errors\">{{ errors }}</div>\n</div>\n\n<app-modal [imgUrl]=\"currentPreviewItem?.file_url! | safe : 'url'\"></app-modal>\n", styles: [".h-100{height:100%}.bg-file{background-color:#e6dddd}.text-mid-gray{color:#8a979b}.mt-2{margin-top:.5rem}.multiple-upload i{color:#00aca9;cursor:pointer}.item-name{border-bottom:1px solid;word-break:break-word}.spinner-border{width:1rem;height:1rem;min-width:1rem;min-height:1rem}.image-container{box-sizing:border-box;height:188px;background-size:cover!important}.image-container .wrap-error{height:130px;grid-gap:1rem;gap:1rem}\n"], components: [{ type: i4.IconRemoveCircleComponent, selector: "app-icon-remove-circle", inputs: ["color"] }, { type: i5.IconErrorComponent, selector: "app-icon-error" }, { type: i6.IconResetComponent, selector: "app-icon-reset" }, { type: i7.IconLoadingComponent, selector: "app-icon-loading" }, { type: i8.IconFileComponent, selector: "app-icon-file" }, { type: i9.IconUploadPlusComponent, selector: "app-icon-upload-plus" }, { type: i10.ModalComponent, selector: "app-modal", inputs: ["imgUrl"] }], directives: [{ type: i11.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i11.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i11.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i11.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], pipes: { "safe": i12.SafePipe } });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: SakaniUploadFilesComponent, decorators: [{
            type: Component,
            args: [{
                    selector: "lib-sakani-upload-files",
                    templateUrl: "./sakani-upload-files.component.html",
                    styleUrls: ["./sakani-upload-files.component.scss"],
                }]
        }], ctorParameters: function () { return [{ type: i1.NgControl }, { type: i1.FormBuilder }, { type: i2.SakaniUploadFilesService }, { type: i3.ModalService }]; }, propDecorators: { translateService: [{
                type: Input
            }], isActiveStorage: [{
                type: Input
            }], headers: [{
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
            }], allowContentType: [{
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
                args: ["preview"]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FrYW5pLXVwbG9hZC1maWxlcy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9zYWthbmktdXBsb2FkLWZpbGVzL3NyYy9saWIvc2FrYW5pLXVwbG9hZC1maWxlcy5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9zYWthbmktdXBsb2FkLWZpbGVzL3NyYy9saWIvc2FrYW5pLXVwbG9hZC1maWxlcy5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxjQUFjO0FBRWQsT0FBTyxFQUNMLFNBQVMsRUFFVCxZQUFZLEVBRVosS0FBSyxFQUdMLE1BQU0sRUFDTixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFTdkIsT0FBTyxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFjLEVBQUUsRUFBZ0IsTUFBTSxNQUFNLENBQUM7QUFDcEYsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3JFLE9BQU8sRUFDTCxhQUFhLEVBQ2IsZ0JBQWdCLEVBQ2hCLGdCQUFnQixFQUNoQixTQUFTLEdBQ1YsTUFBTSxzQkFBc0IsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUFXOUIsTUFBTSxPQUFPLDBCQUEwQjtJQStCckMsWUFDVSxPQUFrQixFQUNsQixXQUF3QixFQUN4Qix3QkFBa0QsRUFDbEQsWUFBMEI7UUFIMUIsWUFBTyxHQUFQLE9BQU8sQ0FBVztRQUNsQixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4Qiw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQTBCO1FBQ2xELGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBM0JwQyxnQkFBVyxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFHN0Isb0JBQWUsR0FBRyxLQUFLLENBQUM7UUFDeEIsWUFBTyxHQUFRLEVBQUUsQ0FBQztRQUNsQixnQkFBVyxHQUFX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LENBQUMsc0NBQXNDLENBQUM7aUJBQ3BEOzRMQVdVLGdCQUFnQjtzQkFBeEIsS0FBSztnQkFDRyxlQUFlO3NCQUF2QixLQUFLO2dCQUNHLE9BQU87c0JBQWYsS0FBSztnQkFDRyxXQUFXO3NCQUFuQixLQUFLO2dCQUNHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBQ0csV0FBVztzQkFBbkIsS0FBSztnQkFDRyxTQUFTO3NCQUFqQixLQUFLO2dCQUNHLGFBQWE7c0JBQXJCLEtBQUs7Z0JBQ0csS0FBSztzQkFBYixLQUFLO2dCQUNHLGdCQUFnQjtzQkFBeEIsS0FBSztnQkFDRyxnQkFBZ0I7c0JBQXhCLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxRQUFRO3NCQUFoQixLQUFLO2dCQUNHLE1BQU07c0JBQWQsS0FBSztnQkFDRyxXQUFXO3NCQUFuQixLQUFLO2dCQUNJLGtCQUFrQjtzQkFBM0IsTUFBTTtnQkFDRyxlQUFlO3NCQUF4QixNQUFNO2dCQUNHLGdCQUFnQjtzQkFBekIsTUFBTTtnQkFDZSxVQUFVO3NCQUEvQixTQUFTO3VCQUFDLFNBQVMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGZvcm1hdCAqL1xuXG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgVmlld0NoaWxkLFxufSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiOyBcbmltcG9ydCB7XG4gIENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICBGb3JtQnVpbGRlcixcbiAgRm9ybUNvbnRyb2wsXG4gIEZvcm1Hcm91cCxcbiAgTmdDb250cm9sLFxufSBmcm9tIFwiQGFuZ3VsYXIvZm9ybXNcIjtcbmltcG9ydCB7IFNhZmVIdG1sIH0gZnJvbSBcIkBhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXJcIjtcbmltcG9ydCB7IGNvbWJpbmVMYXRlc3QsIGRlZmVyLCBmb3JrSm9pbiwgT2JzZXJ2YWJsZSwgb2YsIFN1YnNjcmlwdGlvbiB9IGZyb20gXCJyeGpzXCI7XG5pbXBvcnQgeyBjYXRjaEVycm9yLCBmaW5hbGl6ZSwgbWFwLCBtZXJnZU1hcCB9IGZyb20gXCJyeGpzL29wZXJhdG9yc1wiO1xuaW1wb3J0IHtcbiAgZGF0YVVSSVRvQmxvYixcbiAgRklMRV9EQVRBX1NUQVRVUyxcbiAgR2VuZXJhdGVDaGVja3N1bSxcbiAgUmVhZEFzeW5jLFxufSBmcm9tIFwiLi4vaGVscGVycy91dGlsaXRpZXNcIjtcbmltcG9ydCB7IEZpbGVEYXRhSW50ZXJmYWNlLCBGaWxlRGF0YVN0YXR1c1QgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9maWxlLWRhdGEuaW50ZXJmYWNlXCI7XG5pbXBvcnQgeyBEaXJlY3RVcGxvYWQgfSBmcm9tIFwiLi4vbW9kZWxzL2RpcmVjdC11cGxvYWRcIjtcbmltcG9ydCB7IE1vZGFsU2VydmljZSB9IGZyb20gXCIuLi9zZXJ2aWNlcy9tb2RhbC5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBTYWthbmlVcGxvYWRGaWxlc1NlcnZpY2UgfSBmcm9tIFwiLi9zYWthbmktdXBsb2FkLWZpbGVzLnNlcnZpY2VcIjtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiBcImxpYi1zYWthbmktdXBsb2FkLWZpbGVzXCIsXG4gIHRlbXBsYXRlVXJsOiBcIi4vc2FrYW5pLXVwbG9hZC1maWxlcy5jb21wb25lbnQuaHRtbFwiLFxuICBzdHlsZVVybHM6IFtcIi4vc2FrYW5pLXVwbG9hZC1maWxlcy5jb21wb25lbnQuc2Nzc1wiXSxcbn0pXG5leHBvcnQgY2xhc3MgU2FrYW5pVXBsb2FkRmlsZXNDb21wb25lbnRcbiAgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciwgT25Jbml0LCBPbkRlc3Ryb3lcbntcbiAgaW1nVXJsITogU2FmZUh0bWw7XG4gIGZpbGVzQ29udHJvbCE6IEZvcm1Db250cm9sO1xuICBjdXJyZW50UHJldmlld0l0ZW0hOiBGaWxlRGF0YUludGVyZmFjZTtcbiAgZmlsZXNGb3JtITogRm9ybUdyb3VwO1xuICBmb3JtU3Vic2NyaXB0aW9uITogU3Vic2NyaXB0aW9uO1xuICBmb3JtQ2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBJbnB1dCgpIHRyYW5zbGF0ZVNlcnZpY2U6IGFueTtcbiAgQElucHV0KCkgaXNBY3RpdmVTdG9yYWdlID0gZmFsc2U7XG4gIEBJbnB1dCgpIGhlYWRlcnM6IGFueSA9IFwiXCI7XG4gIEBJbnB1dCgpIGVuZHBvaW50QVBJOiBzdHJpbmcgPSBcIlwiO1xuICBASW5wdXQoKSByZXF1aXJlZCA9IGZhbHNlO1xuICBASW5wdXQoKSBwbGFjZWhvbGRlcjogc3RyaW5nID0gXCJVcGxvYWQgW3Bob3RvIHR5cGVdXCI7XG4gIEBJbnB1dCgpIHVwbG9hZGluZyA9IGZhbHNlO1xuICBASW5wdXQoKSBhbGxvd011bHRpcGxlID0gZmFsc2U7XG4gIEBJbnB1dCgpIGxhYmVsOiBzdHJpbmcgPSBcIlwiO1xuICBASW5wdXQoKSBpdGVtV3JhcHBlckNsYXNzOiBzdHJpbmcgPSBcImNvbC0xMiBjb2wtbGctMyBjb2wteHhsLTJcIjtcbiAgQElucHV0KCkgYWxsb3dDb250ZW50VHlwZSA9IFwiKlwiOyAvLyAnaW1hZ2UvcG5nLCBpbWFnZS9qcGVnJ1xuICBASW5wdXQoKSByZWFkb25seSA9IGZhbHNlO1xuICBASW5wdXQoKSB1cGxvYWRlciE6IHN0cmluZyB8IG51bGw7XG4gIEBJbnB1dCgpIGZvbGRlciE6IHN0cmluZyB8IG51bGw7XG4gIEBJbnB1dCgpIG1heEZpbGVTaXplITogbnVtYmVyOyAvLyBtYXggZmlsZSBzaXplIGluIE1CXG4gIEBPdXRwdXQoKSBwcm9jZXNzVXBsb2FkRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZ1tdPigpO1xuICBAT3V0cHV0KCkgZGVsZXRlRmlsZUV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcjxGaWxlRGF0YUludGVyZmFjZT4oKTtcbiAgQE91dHB1dCgpIGZpbGVPbkNsaWNrRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyPEZpbGVEYXRhSW50ZXJmYWNlPigpO1xuICBAVmlld0NoaWxkKFwicHJldmlld1wiKSBwcmV2aWV3VHBsITogRWxlbWVudFJlZjxhbnk+O1xuICBmaWxlRGF0YVN0YXR1cyA9IEZJTEVfREFUQV9TVEFUVVM7XG4gIGVycm9ycyA9IFwiXCI7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgY29udHJvbDogTmdDb250cm9sLFxuICAgIHByaXZhdGUgZm9ybUJ1aWxkZXI6IEZvcm1CdWlsZGVyLFxuICAgIHByaXZhdGUgU2FrYW5pVXBsb2FkRmlsZXNTZXJ2aWNlOiBTYWthbmlVcGxvYWRGaWxlc1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBtb2RhbFNlcnZpY2U6IE1vZGFsU2VydmljZVxuICApIHtcbiAgICBpZiAodGhpcy5jb250cm9sKSB7XG4gICAgICB0aGlzLmNvbnRyb2wudmFsdWVBY2Nlc3NvciA9IHRoaXM7XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7fVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuZm9ybVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5mb3JtQ2hhbmdlZC5zdWJzY3JpYmUoZm4pO1xuICB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQge31cblxuICBzdWJzY3JpcHRpb25GaWxlc0Zvcm0oKSB7XG4gICAgaWYgKHRoaXMuZm9ybVN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5mb3JtU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5mb3JtU3Vic2NyaXB0aW9uID0gdGhpcy5maWxlc0Zvcm0udmFsdWVDaGFuZ2VzLnN1YnNjcmliZSgodmFsKSA9PiB7XG4gICAgICB0aGlzLmZvcm1DaGFuZ2VkLmVtaXQodmFsKTtcbiAgICB9KTtcbiAgfVxuXG4gIHdyaXRlVmFsdWUoY29udHJvbHM6IGFueSk6IHZvaWQge1xuICAgIGlmIChjb250cm9scykge1xuICAgICAgdGhpcy5maWxlc0Zvcm0gPSB0aGlzLmZvcm1CdWlsZGVyLmdyb3VwKGNvbnRyb2xzKTtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9uRmlsZXNGb3JtKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZmlsZXNGb3JtID0gdGhpcy5mb3JtQnVpbGRlci5ncm91cCh7fSk7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbkZpbGVzRm9ybSgpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZVVwbG9hZEl0ZW0oaXRlbTogRmlsZURhdGFJbnRlcmZhY2UpOiBPYnNlcnZhYmxlPHN0cmluZyB8IHVuZGVmaW5lZD4ge1xuICAgIHJldHVybiBkZWZlcigoKSA9PiB7XG4gICAgICBpdGVtLnN0YXR1cyA9IHRoaXMuZmlsZURhdGFTdGF0dXMuVVBMT0FESU5HIGFzIEZpbGVEYXRhU3RhdHVzVDtcbiAgICAgIHRoaXMuZmlsZXNGb3JtLnBhdGNoVmFsdWUoeyBbaXRlbS5pZF06IHsgLi4uaXRlbSB9IH0pO1xuICAgICAgbGV0IGJsb2I6IGFueTtcbiAgICAgIC8vIHJlYWQgZmlsZSBhbmQgZ2VuZXJhdGUgY2hlY2tzdW1cbiAgICAgIHJldHVybiBSZWFkQXN5bmMoaXRlbSkucGlwZShcbiAgICAgICAgbWVyZ2VNYXAoKGZpbGU6IEFycmF5QnVmZmVyKSA9PiB7XG4gICAgICAgICAgY29uc3QgY2hlY2tzdW0gPSBHZW5lcmF0ZUNoZWNrc3VtKGZpbGUpO1xuICAgICAgICAgIGl0ZW0uY2hlY2tzdW0gPSBjaGVja3N1bSBhcyBzdHJpbmc7XG4gICAgICAgICAgYmxvYiA9IGZpbGU7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuaXNBY3RpdmVTdG9yYWdlXG4gICAgICAgICAgICA/IHRoaXMuU2FrYW5pVXBsb2FkRmlsZXNTZXJ2aWNlLmRpcmVjdFVwbG9hZEJ5QWN0aXZlUmVjb3JkKHtcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmhlYWRlcnMsXG4gICAgICAgICAgICAgICAgZmlsZTogaXRlbSxcbiAgICAgICAgICAgICAgICBhcGlVcmw6IHRoaXMuZW5kcG9pbnRBUEksXG4gICAgICAgICAgICAgICAgZm9sZGVyOiB0aGlzLmZvbGRlcixcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIDogdGhpcy5TYWthbmlVcGxvYWRGaWxlc1NlcnZpY2UuZGlyZWN0VXBsb2FkKHtcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmhlYWRlcnMsXG4gICAgICAgICAgICAgICAgZmlsZTogaXRlbSxcbiAgICAgICAgICAgICAgICBhcGlVcmw6IHRoaXMuZW5kcG9pbnRBUEksXG4gICAgICAgICAgICAgICAgdXBsb2FkZXI6IHRoaXMudXBsb2FkZXIsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KSxcbiAgICAgICAgbWVyZ2VNYXAoKHJlcykgPT4ge1xuICAgICAgICAgIGl0ZW0ucHVibGljX3VybCA9IHJlcz8ucHVibGljX3VybDtcbiAgICAgICAgICBpdGVtLnNpZ25lZF9ibG9iX2lkID0gcmVzPy5ibG9iX3NpZ25lZF9pZDtcbiAgICAgICAgICByZXR1cm4gY29tYmluZUxhdGVzdChbXG4gICAgICAgICAgICBvZihyZXMpLFxuICAgICAgICAgICAgdGhpcy5TYWthbmlVcGxvYWRGaWxlc1NlcnZpY2UuczNVcGxvYWQoXG4gICAgICAgICAgICAgIHJlcz8ucHJlc2lnbmVkX3VybCB8fCByZXM/LnVybCB8fCBcIlwiLFxuICAgICAgICAgICAgICBibG9iLFxuICAgICAgICAgICAgICByZXM/LmhlYWRlcnNcbiAgICAgICAgICAgICksXG4gICAgICAgICAgXSk7XG4gICAgICAgIH0pLFxuICAgICAgICBjYXRjaEVycm9yKChlcnIpID0+IHtcbiAgICAgICAgICBpdGVtLnN0YXR1cyA9IHRoaXMuZmlsZURhdGFTdGF0dXMuRVJST1IgYXMgRmlsZURhdGFTdGF0dXNUO1xuICAgICAgICAgIHJldHVybiBvZih1bmRlZmluZWQpO1xuICAgICAgICB9KSxcbiAgICAgICAgbWFwKChyZXMpID0+IHtcbiAgICAgICAgICBpZiAocmVzKSByZXR1cm4gKHJlc1swXSBhcyBEaXJlY3RVcGxvYWQpLnB1YmxpY191cmw7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9KSxcbiAgICAgICAgZmluYWxpemUoKCkgPT4ge1xuICAgICAgICAgIGlmIChpdGVtLnN0YXR1cyAhPT0gdGhpcy5maWxlRGF0YVN0YXR1cy5FUlJPUikge1xuICAgICAgICAgICAgaXRlbS5zdGF0dXMgPSB0aGlzLmZpbGVEYXRhU3RhdHVzLlVQTE9BREVEIGFzIEZpbGVEYXRhU3RhdHVzVDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgaXRlbUZvcm1WYWx1ZSA9IHRoaXMuZmlsZXNGb3JtLnZhbHVlW2l0ZW0uaWRdO1xuICAgICAgICAgIHRoaXMuZmlsZXNGb3JtLnBhdGNoVmFsdWUoe1xuICAgICAgICAgICAgW2l0ZW0uaWRdOiB7IC4uLml0ZW1Gb3JtVmFsdWUsIC4uLml0ZW0gfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSksXG4gICAgICAgIGNhdGNoRXJyb3IoKGVycikgPT4ge1xuICAgICAgICAgIHJldHVybiBvZih1bmRlZmluZWQpO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIGlzRmlsZVVybEltYWdlKHR5cGU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGlmICghdHlwZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHlwZT8uaW5jbHVkZXMoXCJpbWFnZVwiKTtcbiAgfVxuXG4gIGhhbmRsZVVwbG9hZEl0ZW1zKGl0ZW1zOiBGaWxlRGF0YUludGVyZmFjZVtdKSB7XG4gICAgY29uc3QgdXBsb2FkT2JzID0gW107XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgICBjb25zdCBvYnMgPSB0aGlzLmhhbmRsZVVwbG9hZEl0ZW0oaXRlbSk7XG4gICAgICBpZiAob2JzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdXBsb2FkT2JzLnB1c2gob2JzKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZm9ya0pvaW4odXBsb2FkT2JzKS5zdWJzY3JpYmUoKHJlczogKHN0cmluZyB8IHVuZGVmaW5lZClbXSkgPT4ge1xuICAgICAgY29uc3QgdG1wUmVzID0gcmVzLmZpbHRlcigoeCkgPT4geCkgYXMgc3RyaW5nW107XG4gICAgICB0aGlzLnByb2Nlc3NVcGxvYWRFdmVudC5lbWl0KHRtcFJlcyk7XG4gICAgfSk7XG4gIH1cblxuICBhZGRGaWxlcyhldmVudDogRXZlbnQpIHtcbiAgICBjb25zdCBmaWxlczogRmlsZUxpc3QgPSAoZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLmZpbGVzIGFzIEZpbGVMaXN0O1xuICAgIGNvbnN0IGZpbGVEYXRhID0gW107XG4gICAgdGhpcy5lcnJvcnMgPSBcIlwiO1xuICAgIGZvciAoY29uc3QgZmlsZSBvZiBBcnJheS5mcm9tKGZpbGVzKSkge1xuICAgICAgaWYgKHRoaXMubWF4RmlsZVNpemUgJiYgZmlsZS5zaXplID4gdGhpcy5tYXhGaWxlU2l6ZSkge1xuICAgICAgICBjb25zdCBtYXhTaXplID0gTWF0aC5mbG9vcih0aGlzLm1heEZpbGVTaXplIC8gMTAwMDAwMCk7XG4gICAgICAgIHRoaXMuZXJyb3JzID0gdGhpcy50cmFuc2xhdGVTZXJ2aWNlLmluc3RhbnQoXCJFUlJPUlMuRklMRV9TSVpFX1RPT19CSUdcIiwge1xuICAgICAgICAgIG1heFNpemUsXG4gICAgICAgIH0pO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHRtcEZpbGVEYXRhID0ge1xuICAgICAgICAgIGlkOiBcIl9cIiArIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZygyLCA5KSxcbiAgICAgICAgICBkYXRhOiBmaWxlLFxuICAgICAgICAgIHN0YXR1czogdGhpcy5maWxlRGF0YVN0YXR1cy5XQUlUSU5HLFxuICAgICAgICAgIGlzUmVjb3JkOiBmYWxzZSxcbiAgICAgICAgfSBhcyBGaWxlRGF0YUludGVyZmFjZTtcbiAgICAgICAgZmlsZURhdGEucHVzaCh0bXBGaWxlRGF0YSk7XG4gICAgICAgIHRoaXMucmVhZEZpbGUoZmlsZSwgdG1wRmlsZURhdGEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuaGFuZGxlVXBsb2FkSXRlbXMoZmlsZURhdGEpO1xuICB9XG5cbiAgcmVhZEZpbGUoZmlsZTogRmlsZSwgZmlsZURhdGE6IEZpbGVEYXRhSW50ZXJmYWNlKSB7XG4gICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICByZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcblxuICAgIHJlYWRlci5vbmxvYWRlbmQgPSAoKSA9PiB7XG4gICAgICBjb25zdCBmaWxlQ29udGVudDogc3RyaW5nID0gcmVhZGVyLnJlc3VsdCBhcyBzdHJpbmc7XG4gICAgICBjb25zdCBibG9iID0gZGF0YVVSSVRvQmxvYihmaWxlQ29udGVudCk7XG4gICAgICB0aGlzLmFkZENvbnRyb2xGb3JtKHtcbiAgICAgICAgLi4uZmlsZURhdGEsXG4gICAgICAgIGNvbnRlbnRfdHlwZTogYmxvYi50eXBlLFxuICAgICAgICBmaWxlbmFtZTogZmlsZS5uYW1lLFxuICAgICAgICBmaWxlX3VybDogVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKSxcbiAgICAgIH0pO1xuICAgIH07XG4gIH1cblxuICBkb3dubG9hZEZpbGUoZmlsZTogRmlsZURhdGFJbnRlcmZhY2UpIHtcbiAgICBpZiAoZmlsZSAmJiBmaWxlLmZpbGVfdXJsKSB7XG4gICAgICB3aW5kb3cub3BlbihmaWxlLmZpbGVfdXJsKTtcbiAgICB9XG4gIH1cblxuICBhZGRDb250cm9sRm9ybShmaWxlRGF0YTogRmlsZURhdGFJbnRlcmZhY2UpIHtcbiAgICB0aGlzLmZpbGVzRm9ybS5hZGRDb250cm9sKGZpbGVEYXRhLmlkLCB0aGlzLmZvcm1CdWlsZGVyLmNvbnRyb2woZmlsZURhdGEpKTtcbiAgfVxuXG4gIHJlVXBsb2FkKCRldmVudDogRXZlbnQsIGl0ZW06IEZpbGVEYXRhSW50ZXJmYWNlKSB7XG4gICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGNvbnN0IHVwbG9hZE9icyA9IFtdO1xuICAgIGNvbnN0IG9icyA9IHRoaXMuaGFuZGxlVXBsb2FkSXRlbShpdGVtKTtcbiAgICB1cGxvYWRPYnMucHVzaChvYnMpO1xuICAgIGZvcmtKb2luKHVwbG9hZE9icykuc3Vic2NyaWJlKChyZXM6IChzdHJpbmcgfCB1bmRlZmluZWQpW10pID0+IHtcbiAgICAgIGNvbnN0IHRtcFJlcyA9IHJlcy5maWx0ZXIoKHgpID0+IHgpIGFzIHN0cmluZ1tdO1xuICAgICAgdGhpcy5wcm9jZXNzVXBsb2FkRXZlbnQuZW1pdCh0bXBSZXMpO1xuICAgIH0pO1xuICB9XG5cbiAgZmlsZU9uQ2xpY2soaXRlbTogRmlsZURhdGFJbnRlcmZhY2UpIHtcbiAgICB0aGlzLmZpbGVPbkNsaWNrRXZlbnQuZW1pdChpdGVtKTtcbiAgfVxuXG4gIHByZXZpZXdJdGVtKGl0ZW06IEZpbGVEYXRhSW50ZXJmYWNlKSB7XG4gICAgdGhpcy5jdXJyZW50UHJldmlld0l0ZW0gPSBpdGVtO1xuICAgIHRoaXMuZ2V0UHJldmlld0ltYWdlKCk7XG4gICAgdGhpcy5tb2RhbFNlcnZpY2Uub3BlbigpO1xuICB9XG5cbiAgZ2V0UHJldmlld0ltYWdlKCk6IHN0cmluZyB8IHZvaWQge1xuICAgIGlmICghdGhpcy5jdXJyZW50UHJldmlld0l0ZW0uZmlsZV91cmwpIHtcbiAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICByZWFkZXIub25sb2FkID0gKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgICAgdGhpcy5jdXJyZW50UHJldmlld0l0ZW0uZmlsZV91cmwgPSBldmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgfTtcbiAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKHRoaXMuY3VycmVudFByZXZpZXdJdGVtLmRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5jdXJyZW50UHJldmlld0l0ZW0uZmlsZV91cmw7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGdldEZvcm1WYWx1ZXMoKTogYW55W10ge1xuICAgIHJldHVybiAoT2JqZWN0LnZhbHVlcyh0aGlzLmZpbGVzRm9ybS52YWx1ZSkgYXMgRmlsZURhdGFJbnRlcmZhY2VbXSkuZmlsdGVyKFxuICAgICAgKHBob3RvOiBGaWxlRGF0YUludGVyZmFjZSkgPT4gIXBob3RvPy5fZGVzdHJveVxuICAgICk7XG4gIH1cblxuICBjbG9zZVByZXZpZXcoKSB7XG4gICAgdGhpcy5tb2RhbFNlcnZpY2UuY2xvc2UoKTtcbiAgfVxuXG4gIGlzSW52YWxpZChpdGVtOiBGaWxlRGF0YUludGVyZmFjZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBpdGVtLnN0YXR1cyA9PT0gXCJlcnJvclwiO1xuICB9XG5cbiAgcmVtb3ZlKCRldmVudDogRXZlbnQsIGZpbGU6IEZpbGVEYXRhSW50ZXJmYWNlKSB7XG4gICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGlmIChmaWxlLmlzUmVjb3JkKSB7XG4gICAgICB0aGlzLmZpbGVzRm9ybS5wYXRjaFZhbHVlKHtcbiAgICAgICAgW2ZpbGUuaWRdOiB7IC4uLmZpbGUsIGlzUmVjb3JkOiBmYWxzZSwgX2Rlc3Ryb3k6IHRydWUgfSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmZpbGVzRm9ybS5yZW1vdmVDb250cm9sKGZpbGUuaWQpO1xuICAgIH1cbiAgfVxufVxuIiwiPCEtLSBAZm9ybWF0IC0tPlxuXG48ZGl2IGNsYXNzPVwiZm9ybS1ncm91cCByb3dcIj5cbiAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImdldEZvcm1WYWx1ZXMubGVuZ3RoID4gMFwiPlxuICAgIDxuZy1jb250YWluZXIgKm5nRm9yPVwibGV0IGZpbGUgb2YgZ2V0Rm9ybVZhbHVlczsgaW5kZXggYXMgaVwiPlxuICAgICAgPGRpdiBbY2xhc3NOYW1lXT1cIml0ZW1XcmFwcGVyQ2xhc3NcIj5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImxhYmVsXCI+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzPVwiZm9ybS1sYWJlbFwiXG4gICAgICAgICAgICA+e3sgbGFiZWwgfX08c3BhbiAqbmdJZj1cImFsbG93TXVsdGlwbGVcIj57eyBpICsgMSB9fTwvc3BhblxuICAgICAgICAgICAgPjxzcGFuICpuZ0lmPVwicmVxdWlyZWRcIiBjbGFzcz1cInJlcXVpcmVkLWZpZWxkXCI+ICo8L3NwYW4+PC9sYWJlbFxuICAgICAgICAgID5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICAqbmdJZj1cImlzRmlsZVVybEltYWdlKGZpbGUuY29udGVudF90eXBlKTsgZWxzZSBmaWxlQmxvY2tcIlxuICAgICAgICAgIGNsYXNzPVwiZm9ybS1jb250cm9sIGltYWdlLWNvbnRhaW5lciBwLTIgZC1mbGV4IGZsZXgtY29sdW1uIGJvcmRlci1pbmZvIHJvdW5kIGJnLXdoaXRlIGN1cnNvci1wb2ludGVyIG1iLTNcIlxuICAgICAgICAgIFtuZ0NsYXNzXT1cIntcbiAgICAgICAgICAgIGludmFsaWQ6IGlzSW52YWxpZChmaWxlKSxcbiAgICAgICAgICAgIHZhbGlkOiAhaXNJbnZhbGlkKGZpbGUpXG4gICAgICAgICAgfVwiXG4gICAgICAgICAgKGNsaWNrKT1cInByZXZpZXdJdGVtKGZpbGUpXCJcbiAgICAgICAgICBbbmdTdHlsZV09XCJ7ICdiYWNrZ3JvdW5kLWltYWdlJzogJ3VybCgnICsgZmlsZS5maWxlX3VybCArICcpJyB9XCJcbiAgICAgICAgPlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzPVwiY3Vyc29yLXBvaW50ZXIgZC1mbGV4IGp1c3RpZnktY29udGVudC1lbmQgYWxpZ24taXRlbXMtZW5kXCJcbiAgICAgICAgICAgICpuZ0lmPVwiIXJlYWRvbmx5XCJcbiAgICAgICAgICAgIGFwcExheW91dERpcmVjdGlvblxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxhcHAtaWNvbi1yZW1vdmUtY2lyY2xlXG4gICAgICAgICAgICAgIChjbGljayk9XCJyZW1vdmUoJGV2ZW50LCBmaWxlKVwiXG4gICAgICAgICAgICA+PC9hcHAtaWNvbi1yZW1vdmUtY2lyY2xlPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICpuZ0lmPVwiZmlsZS5zdGF0dXMgPT09IGZpbGVEYXRhU3RhdHVzLkVSUk9SXCJcbiAgICAgICAgICAgIGNsYXNzPVwiZC1mbGV4IGZsZXgtcm93IHdyYXAtZXJyb3IgY3Vyc29yLXBvaW50ZXIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXIgZ2FwLTNcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjdXJzb3ItcG9pbnRlclwiPlxuICAgICAgICAgICAgICA8YXBwLWljb24tZXJyb3IgYXBwTGF5b3V0RGlyZWN0aW9uPjwvYXBwLWljb24tZXJyb3I+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjdXJzb3ItcG9pbnRlclwiIChjbGljayk9XCJyZVVwbG9hZCgkZXZlbnQsIGZpbGUpXCI+XG4gICAgICAgICAgICAgIDxhcHAtaWNvbi1yZXNldCBhcHBMYXlvdXREaXJlY3Rpb24+PC9hcHAtaWNvbi1yZXNldD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICpuZ0lmPVwiZmlsZS5zdGF0dXMgPT09IGZpbGVEYXRhU3RhdHVzLlVQTE9BRElOR1wiXG4gICAgICAgICAgICBjbGFzcz1cImQtZmxleCBmbGV4LXJvdyB3cmFwLWVycm9yIGN1cnNvci1wb2ludGVyIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8YXBwLWljb24tbG9hZGluZz48L2FwcC1pY29uLWxvYWRpbmc+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8bmctdGVtcGxhdGUgI2ZpbGVCbG9jaz5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzcz1cImZvcm0tY29udHJvbCBpbWFnZS1jb250YWluZXIgcC0yIGQtZmxleCBmbGV4LWNvbHVtbiBib3JkZXItaW5mbyByb3VuZCBiZy1maWxlIGN1cnNvci1wb2ludGVyIG1iLTNcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgY2xhc3M9XCJjdXJzb3ItcG9pbnRlciBkLWZsZXgganVzdGlmeS1jb250ZW50LWVuZCBhbGlnbi1pdGVtcy1lbmRcIlxuICAgICAgICAgICAgICAqbmdJZj1cIiFyZWFkb25seVwiXG4gICAgICAgICAgICAgIGFwcExheW91dERpcmVjdGlvblxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8YXBwLWljb24tcmVtb3ZlLWNpcmNsZVxuICAgICAgICAgICAgICAgIChjbGljayk9XCJyZW1vdmUoJGV2ZW50LCBmaWxlKVwiXG4gICAgICAgICAgICAgID48L2FwcC1pY29uLXJlbW92ZS1jaXJjbGU+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgY2xhc3M9XCJkLWZsZXggZmxleC1jb2x1bW4gaC0xMDAgd3JhcC1lcnJvciBjdXJzb3ItcG9pbnRlciBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyIGFsaWduLWl0ZW1zLWNlbnRlclwiXG4gICAgICAgICAgICAgIChjbGljayk9XCJkb3dubG9hZEZpbGUoZmlsZSlcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8YXBwLWljb24tZmlsZT48L2FwcC1pY29uLWZpbGU+XG4gICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAqbmdJZj1cImZpbGUuc3RhdHVzID09PSBmaWxlRGF0YVN0YXR1cy5FUlJPUlwiXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJkLWZsZXggZmxleC1yb3cgZmlsZS10eXBlLWVycm9yIGN1cnNvci1wb2ludGVyIGp1c3RpZnktY29udGVudC1jZW50ZXIgYWxpZ24taXRlbXMtY2VudGVyIGdhcC0zXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjdXJzb3ItcG9pbnRlclwiPlxuICAgICAgICAgICAgICAgICAgPGFwcC1pY29uLWVycm9yIGFwcExheW91dERpcmVjdGlvbj48L2FwcC1pY29uLWVycm9yPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjdXJzb3ItcG9pbnRlclwiIChjbGljayk9XCJyZVVwbG9hZCgkZXZlbnQsIGZpbGUpXCI+XG4gICAgICAgICAgICAgICAgICA8YXBwLWljb24tcmVzZXQgYXBwTGF5b3V0RGlyZWN0aW9uPjwvYXBwLWljb24tcmVzZXQ+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgKm5nSWY9XCJmaWxlLnN0YXR1cyA9PT0gZmlsZURhdGFTdGF0dXMuVVBMT0FESU5HXCJcbiAgICAgICAgICAgICAgICBjbGFzcz1cImQtZmxleCBmbGV4LXJvdyBmaWxlLXR5cGUtZXJyb3IgY3Vyc29yLXBvaW50ZXIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXJcIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPGFwcC1pY29uLWxvYWRpbmc+PC9hcHAtaWNvbi1sb2FkaW5nPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJleHRlbnNpb24tbmFtZVwiPiB7eyBmaWxlLmZpbGVOYW1lIH19IDwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgPC9kaXY+XG4gICAgPC9uZy1jb250YWluZXI+XG4gIDwvbmctY29udGFpbmVyPlxuICA8aW5wdXRcbiAgICAjZmlsZXNcbiAgICB0eXBlPVwiZmlsZVwiXG4gICAgW211bHRpcGxlXT1cImFsbG93TXVsdGlwbGVcIlxuICAgIFthY2NlcHRdPVwiYWxsb3dDb250ZW50VHlwZVwiXG4gICAgY2xhc3M9XCJkLW5vbmVcIlxuICAgIG9uY2xpY2s9XCJ0aGlzLnZhbHVlPW51bGxcIlxuICAgIChjaGFuZ2UpPVwiYWRkRmlsZXMoJGV2ZW50KVwiXG4gIC8+XG4gIDxkaXZcbiAgICBbY2xhc3NOYW1lXT1cIml0ZW1XcmFwcGVyQ2xhc3NcIlxuICAgICpuZ0lmPVwiIXJlYWRvbmx5ICYmIChhbGxvd011bHRpcGxlIHx8IGdldEZvcm1WYWx1ZXMubGVuZ3RoID09PSAwKVwiXG4gID5cbiAgICA8ZGl2XG4gICAgICBjbGFzcz1cImZvcm0tY29udHJvbCBpbWFnZS1jb250YWluZXIganVzdGlmeS1jb250ZW50LWNlbnRlciBhbGlnbi1pdGVtcy1jZW50ZXIgcC0yIGQtZmxleCBmbGV4LWNvbHVtbiBib3JkZXItaW5mbyByb3VuZCBiZy13aGl0ZSBjdXJzb3ItcG9pbnRlciBkLWlubGluZS1mbGV4IG1iLTNcIlxuICAgICAgKGNsaWNrKT1cImZpbGVzLmNsaWNrKClcIlxuICAgID5cbiAgICAgIDxuZy1jb250YWluZXI+XG4gICAgICAgIDxhcHAtaWNvbi11cGxvYWQtcGx1cyBhcHBMYXlvdXREaXJlY3Rpb24+PC9hcHAtaWNvbi11cGxvYWQtcGx1cz5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJ0ZXh0LW1pZC1ncmF5IG10LTJcIj57eyBwbGFjZWhvbGRlciB9fTwvc3Bhbj5cbiAgICAgIDwvbmctY29udGFpbmVyPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbiAgPGRpdiBjbGFzcz1cInRleHQtZGFuZ2VyXCIgKm5nSWY9XCJlcnJvcnNcIj57eyBlcnJvcnMgfX08L2Rpdj5cbjwvZGl2PlxuXG48YXBwLW1vZGFsIFtpbWdVcmxdPVwiY3VycmVudFByZXZpZXdJdGVtPy5maWxlX3VybCEgfCBzYWZlIDogJ3VybCdcIj48L2FwcC1tb2RhbD5cbiJdfQ==