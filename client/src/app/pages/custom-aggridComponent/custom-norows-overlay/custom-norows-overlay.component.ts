import { Component } from "@angular/core";
import { INoRowsOverlayAngularComp } from "@ag-grid-community/angular";

import { SharedService } from "../../../services/shared-service/shared.service";

@Component({
  selector: "app-no-rows-overlay",
  template:
    '<div class="no-data" id="tableError"><i id="errorMessage">{{message}}</i> </div>',
})
export class CustomNoRowsOverlay implements INoRowsOverlayAngularComp {
  message: string;
  constructor(private sharedService: SharedService) {}

  agInit(): void {
    this.sharedService.getErrorMessage().subscribe((err) => {
      if (err) {
        this.message = err;
      }
    });
  }
}
