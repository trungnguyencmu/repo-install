/** @format */
import { Component, Input } from "@angular/core";
import * as i0 from "@angular/core";
import * as i1 from "../../services/modal.service";
import * as i2 from "@angular/common";
export class ModalComponent {
    constructor(modalService) {
        this.modalService = modalService;
    }
    ngOnInit() {
        this.display$ = this.modalService.watch();
    }
    close() {
        this.modalService.close();
    }
}
ModalComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: ModalComponent, deps: [{ token: i1.ModalService }], target: i0.ɵɵFactoryTarget.Component });
ModalComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.2.17", type: ModalComponent, selector: "app-modal", inputs: { imgUrl: "imgUrl" }, ngImport: i0, template: "<ng-container *ngIf=\"display$ | async as display\">\n  <section\n    [class.open]=\"display === 'open'\"\n    (click)=\"close()\"\n    class=\"d-block modal fade show\"\n  >\n    <div\n      (click)=\"$event.stopPropagation()\"\n      class=\"modal-dialog modal-dialog-centered modal-xl\"\n    >\n      <div class=\"modal-content\">\n        <div class=\"modal-body text-center\">\n          <img class=\"img-fluid\" [src]=\"imgUrl\" />\n        </div>\n      </div>\n    </div>\n  </section>\n</ng-container>\n", styles: ["section{visibility:hidden;opacity:0;display:block;position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.2);transition:opacity .25s ease-in}section.open{visibility:inherit;opacity:1}\n"], directives: [{ type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], pipes: { "async": i2.AsyncPipe } });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: ModalComponent, decorators: [{
            type: Component,
            args: [{
                    selector: "app-modal",
                    templateUrl: "./modal.component.html",
                    styleUrls: ["./modal.component.scss"],
                }]
        }], ctorParameters: function () { return [{ type: i1.ModalService }]; }, propDecorators: { imgUrl: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvc2FrYW5pLXVwbG9hZC1maWxlcy9zcmMvY29tcG9uZW50cy9tb2RhbC9tb2RhbC5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9zYWthbmktdXBsb2FkLWZpbGVzL3NyYy9jb21wb25lbnRzL21vZGFsL21vZGFsLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGNBQWM7QUFFZCxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBVSxNQUFNLGVBQWUsQ0FBQzs7OztBQVl6RCxNQUFNLE9BQU8sY0FBYztJQUl6QixZQUFvQixZQUEwQjtRQUExQixpQkFBWSxHQUFaLFlBQVksQ0FBYztJQUFHLENBQUM7SUFFbEQsUUFBUTtRQUNOLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUM1QyxDQUFDO0lBRUQsS0FBSztRQUNILElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDNUIsQ0FBQzs7NEdBWlUsY0FBYztnR0FBZCxjQUFjLCtFQ2QzQixrZ0JBa0JBOzRGREphLGNBQWM7a0JBTDFCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLFdBQVc7b0JBQ3JCLFdBQVcsRUFBRSx3QkFBd0I7b0JBQ3JDLFNBQVMsRUFBRSxDQUFDLHdCQUF3QixDQUFDO2lCQUN0QzttR0FJVSxNQUFNO3NCQUFkLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGZvcm1hdCAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPbkluaXQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgU2FmZUh0bWwgfSBmcm9tIFwiQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3NlclwiO1xuXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSBcInJ4anNcIjtcblxuaW1wb3J0IHsgTW9kYWxTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NlcnZpY2VzL21vZGFsLnNlcnZpY2VcIjtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiBcImFwcC1tb2RhbFwiLFxuICB0ZW1wbGF0ZVVybDogXCIuL21vZGFsLmNvbXBvbmVudC5odG1sXCIsXG4gIHN0eWxlVXJsczogW1wiLi9tb2RhbC5jb21wb25lbnQuc2Nzc1wiXSxcbn0pXG5leHBvcnQgY2xhc3MgTW9kYWxDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBkaXNwbGF5JCE6IE9ic2VydmFibGU8XCJvcGVuXCIgfCBcImNsb3NlXCI+O1xuXG4gIEBJbnB1dCgpIGltZ1VybCE6IFNhZmVIdG1sO1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIG1vZGFsU2VydmljZTogTW9kYWxTZXJ2aWNlKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuZGlzcGxheSQgPSB0aGlzLm1vZGFsU2VydmljZS53YXRjaCgpO1xuICB9XG5cbiAgY2xvc2UoKSB7XG4gICAgdGhpcy5tb2RhbFNlcnZpY2UuY2xvc2UoKTtcbiAgfVxufVxuIiwiPG5nLWNvbnRhaW5lciAqbmdJZj1cImRpc3BsYXkkIHwgYXN5bmMgYXMgZGlzcGxheVwiPlxuICA8c2VjdGlvblxuICAgIFtjbGFzcy5vcGVuXT1cImRpc3BsYXkgPT09ICdvcGVuJ1wiXG4gICAgKGNsaWNrKT1cImNsb3NlKClcIlxuICAgIGNsYXNzPVwiZC1ibG9jayBtb2RhbCBmYWRlIHNob3dcIlxuICA+XG4gICAgPGRpdlxuICAgICAgKGNsaWNrKT1cIiRldmVudC5zdG9wUHJvcGFnYXRpb24oKVwiXG4gICAgICBjbGFzcz1cIm1vZGFsLWRpYWxvZyBtb2RhbC1kaWFsb2ctY2VudGVyZWQgbW9kYWwteGxcIlxuICAgID5cbiAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5IHRleHQtY2VudGVyXCI+XG4gICAgICAgICAgPGltZyBjbGFzcz1cImltZy1mbHVpZFwiIFtzcmNdPVwiaW1nVXJsXCIgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9zZWN0aW9uPlxuPC9uZy1jb250YWluZXI+XG4iXX0=