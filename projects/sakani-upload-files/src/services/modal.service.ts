/** @format */

import { Injectable } from "@angular/core";

import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ModalService {
  private display: BehaviorSubject<"open" | "close"> = new BehaviorSubject(
    "close"
  ) as any;

  watch(): Observable<"open" | "close"> {
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
