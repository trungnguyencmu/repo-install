import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbPaginationModule, } from '@ng-bootstrap/ng-bootstrap';
import { IconErrorComponent, IconFileComponent, IconLoadingComponent, IconResetComponent, IconUploadPlusComponent, } from '../components';
import { IconRemoveCircleComponent } from '../components/svgs/icon-remove-circle/icon-remove-circle.component';
import { SafePipe } from '../pipes/safe.pipe';
import { SakaniUploadFilesComponent } from './sakani-upload-files.component';
import * as i0 from "@angular/core";
const components = [
    IconRemoveCircleComponent,
    IconErrorComponent,
    IconResetComponent,
    IconUploadPlusComponent,
    IconLoadingComponent,
    IconFileComponent,
];
export class SakaniMultipleUploadModule {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FrYW5pLXVwbG9hZC1maWxlcy5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9zYWthbmktdXBsb2FkLWZpbGVzL3NyYy9saWIvc2FrYW5pLXVwbG9hZC1maWxlcy5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFdBQVcsRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ2xFLE9BQU8sRUFFTCxjQUFjLEVBQ2QsbUJBQW1CLEdBQ3BCLE1BQU0sNEJBQTRCLENBQUM7QUFDcEMsT0FBTyxFQUNMLGtCQUFrQixFQUNsQixpQkFBaUIsRUFDakIsb0JBQW9CLEVBQ3BCLGtCQUFrQixFQUNsQix1QkFBdUIsR0FDeEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sb0VBQW9FLENBQUM7QUFDL0csT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzlDLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLGlDQUFpQyxDQUFDOztBQUU3RSxNQUFNLFVBQVUsR0FBRztJQUNqQix5QkFBeUI7SUFDekIsa0JBQWtCO0lBQ2xCLGtCQUFrQjtJQUNsQix1QkFBdUI7SUFDdkIsb0JBQW9CO0lBQ3BCLGlCQUFpQjtDQUNsQixDQUFDO0FBWUYsTUFBTSxPQUFPLDBCQUEwQjs7d0hBQTFCLDBCQUEwQjt5SEFBMUIsMEJBQTBCLGlCQVZ0QiwwQkFBMEIsRUFBRSxRQUFRLEVBUm5ELHlCQUF5QjtRQUN6QixrQkFBa0I7UUFDbEIsa0JBQWtCO1FBQ2xCLHVCQUF1QjtRQUN2QixvQkFBb0I7UUFDcEIsaUJBQWlCLGFBS2YsWUFBWTtRQUNaLFdBQVc7UUFDWCxtQkFBbUI7UUFDbkIsbUJBQW1CO1FBQ25CLGNBQWMsYUFFTiwwQkFBMEIsRUFoQnBDLHlCQUF5QjtRQUN6QixrQkFBa0I7UUFDbEIsa0JBQWtCO1FBQ2xCLHVCQUF1QjtRQUN2QixvQkFBb0I7UUFDcEIsaUJBQWlCO3lIQWFOLDBCQUEwQixZQVQ1QjtZQUNQLFlBQVk7WUFDWixXQUFXO1lBQ1gsbUJBQW1CO1lBQ25CLG1CQUFtQjtZQUNuQixjQUFjO1NBQ2Y7NEZBR1UsMEJBQTBCO2tCQVh0QyxRQUFRO21CQUFDO29CQUNSLFlBQVksRUFBRSxDQUFDLDBCQUEwQixFQUFFLFFBQVEsRUFBRSxHQUFHLFVBQVUsQ0FBQztvQkFDbkUsT0FBTyxFQUFFO3dCQUNQLFlBQVk7d0JBQ1osV0FBVzt3QkFDWCxtQkFBbUI7d0JBQ25CLG1CQUFtQjt3QkFDbkIsY0FBYztxQkFDZjtvQkFDRCxPQUFPLEVBQUUsQ0FBQywwQkFBMEIsRUFBRSxHQUFHLFVBQVUsQ0FBQztpQkFDckQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1zTW9kdWxlLCBSZWFjdGl2ZUZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtcbiAgTmdiQWxlcnQsXG4gIE5nYkFsZXJ0TW9kdWxlLFxuICBOZ2JQYWdpbmF0aW9uTW9kdWxlLFxufSBmcm9tICdAbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcCc7XG5pbXBvcnQge1xuICBJY29uRXJyb3JDb21wb25lbnQsXG4gIEljb25GaWxlQ29tcG9uZW50LFxuICBJY29uTG9hZGluZ0NvbXBvbmVudCxcbiAgSWNvblJlc2V0Q29tcG9uZW50LFxuICBJY29uVXBsb2FkUGx1c0NvbXBvbmVudCxcbn0gZnJvbSAnLi4vY29tcG9uZW50cyc7XG5pbXBvcnQgeyBJY29uUmVtb3ZlQ2lyY2xlQ29tcG9uZW50IH0gZnJvbSAnLi4vY29tcG9uZW50cy9zdmdzL2ljb24tcmVtb3ZlLWNpcmNsZS9pY29uLXJlbW92ZS1jaXJjbGUuY29tcG9uZW50JztcbmltcG9ydCB7IFNhZmVQaXBlIH0gZnJvbSAnLi4vcGlwZXMvc2FmZS5waXBlJztcbmltcG9ydCB7IFNha2FuaVVwbG9hZEZpbGVzQ29tcG9uZW50IH0gZnJvbSAnLi9zYWthbmktdXBsb2FkLWZpbGVzLmNvbXBvbmVudCc7XG5cbmNvbnN0IGNvbXBvbmVudHMgPSBbXG4gIEljb25SZW1vdmVDaXJjbGVDb21wb25lbnQsXG4gIEljb25FcnJvckNvbXBvbmVudCxcbiAgSWNvblJlc2V0Q29tcG9uZW50LFxuICBJY29uVXBsb2FkUGx1c0NvbXBvbmVudCxcbiAgSWNvbkxvYWRpbmdDb21wb25lbnQsXG4gIEljb25GaWxlQ29tcG9uZW50LFxuXTtcbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1Nha2FuaVVwbG9hZEZpbGVzQ29tcG9uZW50LCBTYWZlUGlwZSwgLi4uY29tcG9uZW50c10sXG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgRm9ybXNNb2R1bGUsXG4gICAgUmVhY3RpdmVGb3Jtc01vZHVsZSxcbiAgICBOZ2JQYWdpbmF0aW9uTW9kdWxlLFxuICAgIE5nYkFsZXJ0TW9kdWxlLFxuICBdLFxuICBleHBvcnRzOiBbU2FrYW5pVXBsb2FkRmlsZXNDb21wb25lbnQsIC4uLmNvbXBvbmVudHNdLFxufSlcbmV4cG9ydCBjbGFzcyBTYWthbmlNdWx0aXBsZVVwbG9hZE1vZHVsZSB7fVxuIl19