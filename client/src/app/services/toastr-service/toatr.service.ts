import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

import { NotificationType } from "../shared-service/notify.message";

@Injectable({
  providedIn: "root",
})
export class ToastService {
  constructor(private toastrService: ToastrService) {}

  toastr = (message: { message: string; type: number }) => {
    switch (message.type) {
      case NotificationType.success:
        this.toastrService.success(message.message, "Success", {
          positionClass: "toast-bottom-right",
        });
        break;
      case NotificationType.error:
        this.toastrService.error(message.message, "Failed", {
          positionClass: "toast-bottom-right",
        });
        break;
      case NotificationType.warning:
        this.toastrService.warning(message.message, "Warning", {
          positionClass: "toast-bottom-right",
        });
        break;
      default:
        this.toastrService.info(message.message);
    }
  };
}
