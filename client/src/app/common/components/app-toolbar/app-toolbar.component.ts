import { Component, OnInit } from "@angular/core";
import { MsalService } from "@azure/msal-angular";

import { RoutingService } from "../../../services/routing-service/routing-service.service";
import { ApiService } from "../../../services/api-service/api.service";
import { CONSTANTS } from "../../utils/constant";

@Component({
  selector: "app-toolbar",
  templateUrl: "./app-toolbar.component.html",
  styleUrls: ["./app-toolbar.component.scss"],
})
export class AppToolbar implements OnInit {
  constructor(
    private authService: MsalService,
    private routingService: RoutingService,
    private userInfo: ApiService
  ) {}
  public email: string;
  public userName: string;
  public avatar: string;

  currentEnv: string;
  ngOnInit(): void {
    this.getUserDetail();
    this.getCurrentEnvironment();
  }

  navigateToHome = () => {
    this.routingService.navigateToURL(CONSTANTS.HOMEPAGE_URL);
  };

  getUserDetail = () => {
    this.userInfo.getUserInfo().subscribe((res: any) => {
      if (res) {
        this.email = res.mail;
        this.userName = res.username;
        this.avatar = res.avatar;
      }
    });
  };

  getCurrentEnvironment = () => {
    const hostname = window.location.hostname;
    switch (true) {
      case hostname.includes("prod"):
        this.currentEnv = CONSTANTS.PROD;
        break;
      case hostname.includes("uat"):
        this.currentEnv = CONSTANTS.UAT;
        break;
      default:
        this.currentEnv = CONSTANTS.DEV;
    }
  };

  logout = () => {
    this.authService.logoutRedirect({
      postLogoutRedirectUri:
        "https://gasdashboard.tradingmop-gasdashboarddev.enbw.cloud/",
    });
  };
}
