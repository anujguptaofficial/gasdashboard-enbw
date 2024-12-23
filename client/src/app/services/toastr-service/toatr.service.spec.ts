import { TestBed } from "@angular/core/testing";
import { ToastrService } from "ngx-toastr";

import {
  NotificationMessage,
  NotificationType,
} from "../shared-service/notify.message";
import { ToastService } from "./toatr.service";

describe("ToastService", () => {
  let service: ToastService;
  let toastrService: jest.Mocked<ToastrService>;

  beforeEach(() => {
    const toastrServiceMock: Partial<jest.Mocked<ToastrService>> = {
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      info: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ToastService,
        { provide: ToastrService, useValue: toastrServiceMock },
      ],
    });

    service = TestBed.inject(ToastService);
    toastrService = TestBed.inject(ToastrService) as jest.Mocked<ToastrService>;
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should display a success message", () => {
    const message: NotificationMessage = {
      message: "Success message",
      type: NotificationType.success,
    };

    service.toastr(message);

    expect(toastrService.success).toHaveBeenCalledWith(
      "Success message",
      "Success",
      { positionClass: "toast-bottom-right" }
    );
  });

  it("should display an error message", () => {
    const message: NotificationMessage = {
      message: "Error message",
      type: NotificationType.error,
    };

    service.toastr(message);

    expect(toastrService.error).toHaveBeenCalledWith(
      "Error message",
      "Failed",
      { positionClass: "toast-bottom-right" }
    );
  });

  it("should display a warning message", () => {
    const message: NotificationMessage = {
      message: "Warning message",
      type: NotificationType.warning,
    };

    service.toastr(message);

    expect(toastrService.warning).toHaveBeenCalledWith(
      "Warning message",
      "Warning",
      { positionClass: "toast-bottom-right" }
    );
  });

  it("should display an info message for default case", () => {
    const message: NotificationMessage = {
      message: "Info message",
      type: NotificationType.info,
    };

    service.toastr(message);

    expect(toastrService.info).toHaveBeenCalledWith("Info message");
  });
});
