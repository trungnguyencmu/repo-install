/** @format */

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import {
  IconErrorComponent,
  IconFileComponent,
  IconLoadingComponent,
  IconResetComponent,
  IconUploadPlusComponent,
  ModalComponent,
} from "../components";
import { IconRemoveCircleComponent } from "../components/svgs/icon-remove-circle/icon-remove-circle.component";
import { SafePipe } from "../pipes/safe.pipe";
import { SakaniUploadFilesComponent } from "./sakani-upload-files.component";

const components = [
  IconRemoveCircleComponent,
  IconErrorComponent,
  IconResetComponent,
  IconUploadPlusComponent,
  IconLoadingComponent,
  IconFileComponent,
  ModalComponent,
];
@NgModule({
  declarations: [SakaniUploadFilesComponent, SafePipe, ...components],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [SakaniUploadFilesComponent, ...components],
})
export class SakaniMultipleUploadModule {}
