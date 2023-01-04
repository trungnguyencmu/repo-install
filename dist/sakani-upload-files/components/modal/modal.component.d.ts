/** @format */
import { OnInit } from "@angular/core";
import { SafeHtml } from "@angular/platform-browser";
import { Observable } from "rxjs";
import { ModalService } from "../../services/modal.service";
import * as i0 from "@angular/core";
export declare class ModalComponent implements OnInit {
    private modalService;
    display$: Observable<"open" | "close">;
    imgUrl: SafeHtml;
    constructor(modalService: ModalService);
    ngOnInit(): void;
    close(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ModalComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ModalComponent, "app-modal", never, { "imgUrl": "imgUrl"; }, {}, never, never>;
}
