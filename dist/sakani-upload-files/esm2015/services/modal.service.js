/** @format */
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import * as i0 from "@angular/core";
export class ModalService {
    constructor() {
        this.display = new BehaviorSubject("close");
    }
    watch() {
        console.log("this.display", this.display);
        return this.display.asObservable();
    }
    open() {
        console.log("run");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3Nha2FuaS11cGxvYWQtZmlsZXMvc3JjL3NlcnZpY2VzL21vZGFsLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsY0FBYztBQUVkLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLGVBQWUsRUFBYyxNQUFNLE1BQU0sQ0FBQzs7QUFLbkQsTUFBTSxPQUFPLFlBQVk7SUFIekI7UUFJVSxZQUFPLEdBQXNDLElBQUksZUFBZSxDQUN0RSxPQUFPLENBQ0QsQ0FBQztLQWVWO0lBYkMsS0FBSztRQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMxQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDckMsQ0FBQztJQUVELElBQUk7UUFDRixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25CLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCxLQUFLO1FBQ0gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDN0IsQ0FBQzs7MEdBakJVLFlBQVk7OEdBQVosWUFBWSxjQUZYLE1BQU07NEZBRVAsWUFBWTtrQkFIeEIsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGZvcm1hdCAqL1xuXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcblxuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSBcInJ4anNcIjtcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiBcInJvb3RcIixcbn0pXG5leHBvcnQgY2xhc3MgTW9kYWxTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBkaXNwbGF5OiBCZWhhdmlvclN1YmplY3Q8XCJvcGVuXCIgfCBcImNsb3NlXCI+ID0gbmV3IEJlaGF2aW9yU3ViamVjdChcbiAgICBcImNsb3NlXCJcbiAgKSBhcyBhbnk7XG5cbiAgd2F0Y2goKTogT2JzZXJ2YWJsZTxcIm9wZW5cIiB8IFwiY2xvc2VcIj4ge1xuICAgIGNvbnNvbGUubG9nKFwidGhpcy5kaXNwbGF5XCIsIHRoaXMuZGlzcGxheSk7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGxheS5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIG9wZW4oKSB7XG4gICAgY29uc29sZS5sb2coXCJydW5cIik7XG4gICAgdGhpcy5kaXNwbGF5Lm5leHQoXCJvcGVuXCIpO1xuICB9XG5cbiAgY2xvc2UoKSB7XG4gICAgdGhpcy5kaXNwbGF5Lm5leHQoXCJjbG9zZVwiKTtcbiAgfVxufVxuIl19