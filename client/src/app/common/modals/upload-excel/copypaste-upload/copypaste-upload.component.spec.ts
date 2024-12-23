import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CopyPasteComponent } from "./copypaste-upload.component";
import { SharedService } from "../../../../services/shared-service/shared.service";
import { of } from "rxjs";

describe("CopyPasteComponent", () => {
  let component: CopyPasteComponent;
  let fixture: ComponentFixture<CopyPasteComponent>;
  let sharedServiceMock: any;

  beforeEach(async () => {
    sharedServiceMock = {
      getDropDownChange: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [CopyPasteComponent],
      providers: [
        {
          provide: SharedService,
          useValue: sharedServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CopyPasteComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should ngOnInit", () => {
    jest
      .spyOn(sharedServiceMock, "getDropDownChange")
      .mockReturnValue(of(true));
    component.ngOnInit();
  });

  it("should onChange", () => {
    let event = {
      inputType: "insertFromPaste",
    };
    component.onChange(event);
  });

  it("should uploadPastedData", () => {
    component.uploadPastedData();
  });

  it("should onPasteData", () => {
    const response =
      "column_name,stor_storage_balance,stor_storage_modelled,con_industry,con_ldc,imp_production,imp_lng,imp_norway,imp_de_h,imp_de_l,imp_be_h,imp_be_l,imp_uk,linepack\nBOM,0,0,0,0,0,0,0,0,0,0,0,0,0\nProjected_Outturn,0,0,0,0,0,0,0,0,0,0,0,0,0\n";
    const mEvent: any = {
      clipboardData: { getData: jest.fn().mockReturnValue(response) },
    };
    component.onPasteData(mEvent);
  });

  it("should onPasteData missing columns condition", () => {
    const response =
      "column_name\tstor_storage_balance\t\tcon_industry\t\timp_production\timp_lng\timp_norway\timp_de_h\timp_de_l\timp_be_h,imp_be_l,imp_uk,linepack\nBOM,0,0,0,0,0,0,0,0,0,0,0,0,0\nProjected_Outturn,0,0,0,0,0,0,0,0,0,0,0,0,0\n";
    const mEvent: any = {
      clipboardData: { getData: jest.fn().mockReturnValue(response) },
    };
    component.onPasteData(mEvent);
  });

  it("should onPasteData if condition", () => {
    const response =
      "2023-02-10\t0\t1\t-57\r2023-02-11\t0\t1\t-52\r2023-02-12\t0\t1\t-49\r2023-02-13\t0\t1\t-57\r";
    const mEvent: any = {
      clipboardData: { getData: jest.fn().mockReturnValue(response) },
    };
    component.onPasteData(mEvent);
  });
});
