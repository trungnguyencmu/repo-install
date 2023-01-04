/** @format */
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IconErrorComponent, IconFileComponent, IconLoadingComponent, IconResetComponent, IconUploadPlusComponent, ModalComponent, } from "../components";
import { IconRemoveCircleComponent } from "../components/svgs/icon-remove-circle/icon-remove-circle.component";
import { SafePipe } from "../pipes/safe.pipe";
import { SakaniUploadFilesComponent } from "./sakani-upload-files.component";
import * as i0 from "@angular/core";
const components = [
    IconRemoveCircleComponent,
    IconErrorComponent,
    IconResetComponent,
    IconUploadPlusComponent,
    IconLoadingComponent,
    IconFileComponent,
    ModalComponent,
];
export class SakaniMultipleUploadModule {
}
SakaniMultipleUploadModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: SakaniMultipleUploadModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
SakaniMultipleUploadModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: SakaniMultipleUploadModule, declarations: [SakaniUploadFilesComponent, SafePipe, IconRemoveCircleComponent,
        IconErrorComponent,
        IconResetComponent,
        IconUploadPlusComponent,
        IconLoadingComponent,
        IconFileComponent,
        ModalComponent], imports: [CommonModule, FormsModule, ReactiveFormsModule], exports: [SakaniUploadFilesComponent, IconRemoveCircleComponent,
        IconErrorComponent,
        IconResetComponent,
        IconUploadPlusComponent,
        IconLoadingComponent,
        IconFileComponent,
        ModalComponent] });
SakaniMultipleUploadModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: SakaniMultipleUploadModule, imports: [[CommonModule, FormsModule, ReactiveFormsModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: SakaniMultipleUploadModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [SakaniUploadFilesComponent, SafePipe, ...components],
                    imports: [CommonModule, FormsModule, ReactiveFormsModule],
                    exports: [SakaniUploadFilesComponent, ...components],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FrYW5pLXVwbG9hZC1maWxlcy5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9zYWthbmktdXBsb2FkLWZpbGVzL3NyYy9saWIvc2FrYW5pLXVwbG9hZC1maWxlcy5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsY0FBYztBQUVkLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxXQUFXLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVsRSxPQUFPLEVBQ0wsa0JBQWtCLEVBQ2xCLGlCQUFpQixFQUNqQixvQkFBb0IsRUFDcEIsa0JBQWtCLEVBQ2xCLHVCQUF1QixFQUN2QixjQUFjLEdBQ2YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sb0VBQW9FLENBQUM7QUFDL0csT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzlDLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLGlDQUFpQyxDQUFDOztBQUU3RSxNQUFNLFVBQVUsR0FBRztJQUNqQix5QkFBeUI7SUFDekIsa0JBQWtCO0lBQ2xCLGtCQUFrQjtJQUNsQix1QkFBdUI7SUFDdkIsb0JBQW9CO0lBQ3BCLGlCQUFpQjtJQUNqQixjQUFjO0NBQ2YsQ0FBQztBQU1GLE1BQU0sT0FBTywwQkFBMEI7O3dIQUExQiwwQkFBMEI7eUhBQTFCLDBCQUEwQixpQkFKdEIsMEJBQTBCLEVBQUUsUUFBUSxFQVRuRCx5QkFBeUI7UUFDekIsa0JBQWtCO1FBQ2xCLGtCQUFrQjtRQUNsQix1QkFBdUI7UUFDdkIsb0JBQW9CO1FBQ3BCLGlCQUFpQjtRQUNqQixjQUFjLGFBSUosWUFBWSxFQUFFLFdBQVcsRUFBRSxtQkFBbUIsYUFDOUMsMEJBQTBCLEVBWHBDLHlCQUF5QjtRQUN6QixrQkFBa0I7UUFDbEIsa0JBQWtCO1FBQ2xCLHVCQUF1QjtRQUN2QixvQkFBb0I7UUFDcEIsaUJBQWlCO1FBQ2pCLGNBQWM7eUhBT0gsMEJBQTBCLFlBSDVCLENBQUMsWUFBWSxFQUFFLFdBQVcsRUFBRSxtQkFBbUIsQ0FBQzs0RkFHOUMsMEJBQTBCO2tCQUx0QyxRQUFRO21CQUFDO29CQUNSLFlBQVksRUFBRSxDQUFDLDBCQUEwQixFQUFFLFFBQVEsRUFBRSxHQUFHLFVBQVUsQ0FBQztvQkFDbkUsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLFdBQVcsRUFBRSxtQkFBbUIsQ0FBQztvQkFDekQsT0FBTyxFQUFFLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxVQUFVLENBQUM7aUJBQ3JEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBmb3JtYXQgKi9cblxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvbW1vblwiO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUsIFJlYWN0aXZlRm9ybXNNb2R1bGUgfSBmcm9tIFwiQGFuZ3VsYXIvZm9ybXNcIjtcblxuaW1wb3J0IHtcbiAgSWNvbkVycm9yQ29tcG9uZW50LFxuICBJY29uRmlsZUNvbXBvbmVudCxcbiAgSWNvbkxvYWRpbmdDb21wb25lbnQsXG4gIEljb25SZXNldENvbXBvbmVudCxcbiAgSWNvblVwbG9hZFBsdXNDb21wb25lbnQsXG4gIE1vZGFsQ29tcG9uZW50LFxufSBmcm9tIFwiLi4vY29tcG9uZW50c1wiO1xuaW1wb3J0IHsgSWNvblJlbW92ZUNpcmNsZUNvbXBvbmVudCB9IGZyb20gXCIuLi9jb21wb25lbnRzL3N2Z3MvaWNvbi1yZW1vdmUtY2lyY2xlL2ljb24tcmVtb3ZlLWNpcmNsZS5jb21wb25lbnRcIjtcbmltcG9ydCB7IFNhZmVQaXBlIH0gZnJvbSBcIi4uL3BpcGVzL3NhZmUucGlwZVwiO1xuaW1wb3J0IHsgU2FrYW5pVXBsb2FkRmlsZXNDb21wb25lbnQgfSBmcm9tIFwiLi9zYWthbmktdXBsb2FkLWZpbGVzLmNvbXBvbmVudFwiO1xuXG5jb25zdCBjb21wb25lbnRzID0gW1xuICBJY29uUmVtb3ZlQ2lyY2xlQ29tcG9uZW50LFxuICBJY29uRXJyb3JDb21wb25lbnQsXG4gIEljb25SZXNldENvbXBvbmVudCxcbiAgSWNvblVwbG9hZFBsdXNDb21wb25lbnQsXG4gIEljb25Mb2FkaW5nQ29tcG9uZW50LFxuICBJY29uRmlsZUNvbXBvbmVudCxcbiAgTW9kYWxDb21wb25lbnQsXG5dO1xuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbU2FrYW5pVXBsb2FkRmlsZXNDb21wb25lbnQsIFNhZmVQaXBlLCAuLi5jb21wb25lbnRzXSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgRm9ybXNNb2R1bGUsIFJlYWN0aXZlRm9ybXNNb2R1bGVdLFxuICBleHBvcnRzOiBbU2FrYW5pVXBsb2FkRmlsZXNDb21wb25lbnQsIC4uLmNvbXBvbmVudHNdLFxufSlcbmV4cG9ydCBjbGFzcyBTYWthbmlNdWx0aXBsZVVwbG9hZE1vZHVsZSB7fVxuIl19