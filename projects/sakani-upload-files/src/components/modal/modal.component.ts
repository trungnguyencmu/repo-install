/** @format */

import { Component, Input, OnInit } from "@angular/core";
import { SafeHtml } from "@angular/platform-browser";

import { Observable } from "rxjs";

import { ModalService } from "../../services/modal.service";

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.scss"],
})
export class ModalComponent implements OnInit {
  display$!: Observable<"open" | "close">;

  @Input() imgUrl!: SafeHtml;
  constructor(private modalService: ModalService) {}

  ngOnInit() {
    this.display$ = this.modalService.watch();
  }

  close() {
    this.modalService.close();
  }
}
