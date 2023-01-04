/** @format */

import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NgControl,
} from "@angular/forms";
import { SafeHtml } from "@angular/platform-browser";
import { combineLatest, defer, forkJoin, Observable, of, Subscription } from "rxjs";
import { catchError, finalize, map, mergeMap } from "rxjs/operators";
import {
  dataURIToBlob,
  FILE_DATA_STATUS,
  GenerateChecksum,
  ReadAsync,
} from "../helpers/utilities";
import { FileDataInterface, FileDataStatusT } from "../interfaces/file-data.interface";
import { DirectUpload } from "../models/direct-upload";
import { ModalService } from "../services/modal.service";
import { SakaniUploadFilesService } from "./sakani-upload-files.service";

@Component({
  selector: "lib-sakani-upload-files",
  templateUrl: "./sakani-upload-files.component.html",
  styleUrls: ["./sakani-upload-files.component.scss"],
})
export class SakaniUploadFilesComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  imgUrl!: SafeHtml;
  filesControl!: FormControl;
  currentPreviewItem!: FileDataInterface;
  filesForm!: FormGroup;
  formSubscription!: Subscription;
  formChanged = new EventEmitter<any>();

  @Input() translateService: any;
  @Input() isActiveStorage = false;
  @Input() headers: any = "";
  @Input() endpointAPI: string = "";
  @Input() required = false;
  @Input() placeholder: string = "Upload [photo type]";
  @Input() uploading = false;
  @Input() allowMultiple = false;
  @Input() label: string = "";
  @Input() itemWrapperClass: string = "col-12 col-lg-3 col-xxl-2";
  @Input() allowContentType = "*"; // 'image/png, image/jpeg'
  @Input() readonly = false;
  @Input() uploader!: string | null;
  @Input() folder!: string | null;
  @Input() maxFileSize!: number; // max file size in MB
  @Output() processUploadEvent = new EventEmitter<string[]>();
  @Output() deleteFileEvent = new EventEmitter<FileDataInterface>();
  @Output() fileOnClickEvent = new EventEmitter<FileDataInterface>();
  @ViewChild("preview") previewTpl!: ElementRef<any>;
  fileDataStatus = FILE_DATA_STATUS;
  errors = "";
  constructor(
    private control: NgControl,
    private formBuilder: FormBuilder,
    private SakaniUploadFilesService: SakaniUploadFilesService,
    private modalService: ModalService
  ) {
    if (this.control) {
      this.control.valueAccessor = this;
    }
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

  registerOnChange(fn: any): void {
    this.formChanged.subscribe(fn);
  }

  registerOnTouched(fn: any): void {}

  subscriptionFilesForm() {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }

    this.formSubscription = this.filesForm.valueChanges.subscribe((val) => {
      this.formChanged.emit(val);
    });
  }

  writeValue(controls: any): void {
    if (controls) {
      this.filesForm = this.formBuilder.group(controls);
      this.subscriptionFilesForm();
    } else {
      this.filesForm = this.formBuilder.group({});
      this.subscriptionFilesForm();
    }
  }

  handleUploadItem(item: FileDataInterface): Observable<string | undefined> {
    return defer(() => {
      item.status = this.fileDataStatus.UPLOADING as FileDataStatusT;
      this.filesForm.patchValue({ [item.id]: { ...item } });
      let blob: any;
      // read file and generate checksum
      return ReadAsync(item).pipe(
        mergeMap((file: ArrayBuffer) => {
          const checksum = GenerateChecksum(file);
          item.checksum = checksum as string;
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
        }),
        mergeMap((res) => {
          item.public_url = res?.public_url;
          item.signed_blob_id = res?.blob_signed_id;
          return combineLatest([
            of(res),
            this.SakaniUploadFilesService.s3Upload(
              res?.presigned_url || res?.url || "",
              blob,
              res?.headers
            ),
          ]);
        }),
        catchError((err) => {
          item.status = this.fileDataStatus.ERROR as FileDataStatusT;
          return of(undefined);
        }),
        map((res) => {
          if (res) return (res[0] as DirectUpload).public_url;
          return;
        }),
        finalize(() => {
          if (item.status !== this.fileDataStatus.ERROR) {
            item.status = this.fileDataStatus.UPLOADED as FileDataStatusT;
          }
          const itemFormValue = this.filesForm.value[item.id];
          this.filesForm.patchValue({
            [item.id]: { ...itemFormValue, ...item },
          });
        }),
        catchError((err) => {
          return of(undefined);
        })
      );
    });
  }

  isFileUrlImage(type: string): boolean {
    if (!type) {
      return false;
    }
    return type?.includes("image");
  }

  handleUploadItems(items: FileDataInterface[]) {
    const uploadObs = [];
    for (const item of items) {
      const obs = this.handleUploadItem(item);
      if (obs !== undefined) {
        uploadObs.push(obs);
      }
    }
    forkJoin(uploadObs).subscribe((res: (string | undefined)[]) => {
      const tmpRes = res.filter((x) => x) as string[];
      this.processUploadEvent.emit(tmpRes);
    });
  }

  addFiles(event: Event) {
    const files: FileList = (event.target as HTMLInputElement).files as FileList;
    const fileData = [];
    this.errors = "";
    for (const file of Array.from(files)) {
      if (this.maxFileSize && file.size > this.maxFileSize) {
        const maxSize = Math.floor(this.maxFileSize / 1000000);
        this.errors = this.translateService.instant("ERRORS.FILE_SIZE_TOO_BIG", {
          maxSize,
        });
        continue;
      } else {
        const tmpFileData = {
          id: "_" + Math.random().toString(36).substring(2, 9),
          data: file,
          status: this.fileDataStatus.WAITING,
          isRecord: false,
        } as FileDataInterface;
        fileData.push(tmpFileData);
        this.readFile(file, tmpFileData);
      }
    }

    this.handleUploadItems(fileData);
  }

  readFile(file: File, fileData: FileDataInterface) {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      const fileContent: string = reader.result as string;
      const blob = dataURIToBlob(fileContent);
      this.addControlForm({
        ...fileData,
        content_type: blob.type,
        filename: file.name,
        file_url: URL.createObjectURL(blob),
      });
    };
  }

  downloadFile(file: FileDataInterface) {
    if (file && file.file_url) {
      window.open(file.file_url);
    }
  }

  addControlForm(fileData: FileDataInterface) {
    this.filesForm.addControl(fileData.id, this.formBuilder.control(fileData));
  }

  reUpload($event: Event, item: FileDataInterface) {
    $event.stopPropagation();
    const uploadObs = [];
    const obs = this.handleUploadItem(item);
    uploadObs.push(obs);
    forkJoin(uploadObs).subscribe((res: (string | undefined)[]) => {
      const tmpRes = res.filter((x) => x) as string[];
      this.processUploadEvent.emit(tmpRes);
    });
  }

  fileOnClick(item: FileDataInterface) {
    this.fileOnClickEvent.emit(item);
  }

  previewItem(item: FileDataInterface) {
    this.currentPreviewItem = item;
    this.getPreviewImage();
    this.modalService.open();
  }

  getPreviewImage(): string | void {
    if (!this.currentPreviewItem.file_url) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.currentPreviewItem.file_url = event.target.result;
      };
      reader.readAsDataURL(this.currentPreviewItem.data);
    } else {
      return this.currentPreviewItem.file_url;
    }
  }

  get getFormValues(): any[] {
    return (Object.values(this.filesForm.value) as FileDataInterface[]).filter(
      (photo: FileDataInterface) => !photo?._destroy
    );
  }

  closePreview() {
    this.modalService.close();
  }

  isInvalid(item: FileDataInterface): boolean {
    return item.status === "error";
  }

  remove($event: Event, file: FileDataInterface) {
    $event.stopPropagation();
    if (file.isRecord) {
      this.filesForm.patchValue({
        [file.id]: { ...file, isRecord: false, _destroy: true },
      });
    } else {
      this.filesForm.removeControl(file.id);
    }
  }
}
