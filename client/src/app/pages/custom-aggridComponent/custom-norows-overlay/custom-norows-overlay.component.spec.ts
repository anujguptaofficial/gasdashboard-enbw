import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { SharedService } from "../../../services/shared-service/shared.service";

import { CustomNoRowsOverlay } from "./custom-norows-overlay.component";

describe("CustomNorowsOverlayComponent", () => {
  let component: CustomNoRowsOverlay;
  let fixture: ComponentFixture<CustomNoRowsOverlay>;
  let sharedServiceMock: any;

  beforeEach(async () => {
    sharedServiceMock = {
      getErrorMessage: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [CustomNoRowsOverlay],
      providers: [{ provide: SharedService, useValue: sharedServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomNoRowsOverlay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should agInit", () => {
    jest.spyOn(sharedServiceMock, "getErrorMessage").mockReturnValue(of(true));
    component.agInit();
  });
});
