/** @format */
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import * as i0 from "@angular/core";
export class ModalService {
    constructor() {
        this.display = new BehaviorSubject("close");
    }
    watch() {
        return this.display.asObservable();
    }
    open() {
        this.display.next("open");
    }
    close() {
        this.display.next("close");
    }
}
ModalService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: ModalService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ModalService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: ModalService, providedIn: "root" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: ModalService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: "root",
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3Nha2FuaS11cGxvYWQtZmlsZXMvc3JjL3NlcnZpY2VzL21vZGFsLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsY0FBYztBQUVkLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLGVBQWUsRUFBYyxNQUFNLE1BQU0sQ0FBQzs7QUFLbkQsTUFBTSxPQUFPLFlBQVk7SUFIekI7UUFJVSxZQUFPLEdBQXNDLElBQUksZUFBZSxDQUN0RSxPQUFPLENBQ0QsQ0FBQztLQWFWO0lBWEMsS0FBSztRQUNILE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNyQyxDQUFDO0lBRUQsSUFBSTtRQUNGLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCxLQUFLO1FBQ0gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDN0IsQ0FBQzs7MEdBZlUsWUFBWTs4R0FBWixZQUFZLGNBRlgsTUFBTTs0RkFFUCxZQUFZO2tCQUh4QixVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAZm9ybWF0ICovXG5cbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuXG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUgfSBmcm9tIFwicnhqc1wiO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46IFwicm9vdFwiLFxufSlcbmV4cG9ydCBjbGFzcyBNb2RhbFNlcnZpY2Uge1xuICBwcml2YXRlIGRpc3BsYXk6IEJlaGF2aW9yU3ViamVjdDxcIm9wZW5cIiB8IFwiY2xvc2VcIj4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0KFxuICAgIFwiY2xvc2VcIlxuICApIGFzIGFueTtcblxuICB3YXRjaCgpOiBPYnNlcnZhYmxlPFwib3BlblwiIHwgXCJjbG9zZVwiPiB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGxheS5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIG9wZW4oKSB7XG4gICAgdGhpcy5kaXNwbGF5Lm5leHQoXCJvcGVuXCIpO1xuICB9XG5cbiAgY2xvc2UoKSB7XG4gICAgdGhpcy5kaXNwbGF5Lm5leHQoXCJjbG9zZVwiKTtcbiAgfVxufVxuIl19