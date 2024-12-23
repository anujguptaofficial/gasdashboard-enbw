import { ComponentFixture, TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { MatMenuModule } from "@angular/material/menu";
import { MsalService } from "@azure/msal-angular";

import { AppToolbar } from "./app-toolbar.component";
import { environment } from "../../../../environments/environment";
import { RoutingService } from "../../../services/routing-service/routing-service.service";
import { ApiService } from "../../../services/api-service/api.service";

describe("AppToolbar", () => {
  let component: AppToolbar;
  let fixture: ComponentFixture<AppToolbar>;
  let userInfoMockService: any;
  let routingServiceMock: any;
  let authService: any;

  beforeEach(async () => {
    userInfoMockService = {
      getUserInfo: jest.fn(),
    };
    routingServiceMock = {
      navigateToURL: jest.fn(),
    };
    authService = {
      logoutRedirect: jest.fn(),
      logOut: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [MatMenuModule],
      declarations: [AppToolbar],
      providers: [
        {
          provide: ApiService,
          useValue: userInfoMockService,
        },
        {
          provide: RoutingService,
          useValue: routingServiceMock,
        },
        {
          provide: MsalService,
          useValue: authService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppToolbar);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should getUserDetail data", () => {
    const expRes = {
      mail: "test.com",
      username: "",
      avatar: "",
    };
    expect(environment.name).toBe("Development");
    jest.spyOn(userInfoMockService, "getUserInfo").mockReturnValue(of(expRes));
    component.ngOnInit();
  });

  it("should navigateToHome", () => {
    expect(routingServiceMock.navigateToURL).toBeDefined();
    component.navigateToHome();
  });

  it("should getCurrentEnvironment", () => {
    component.getCurrentEnvironment();
  });
});
