import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  APP_INITIALIZER,
} from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { BricksUiModule } from "@enbw_bricks/ui";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { MatInputModule } from "@angular/material/input";
import { LicenseManager } from "@ag-grid-enterprise/core";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { StoreModule } from "@ngrx/store";
import { ToastrModule } from "ngx-toastr";
import { MsalModule } from "@azure/msal-angular";
import { InteractionType, PublicClientApplication } from "@azure/msal-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AppToolbar } from "./common/components/app-toolbar/app-toolbar.component";
import { SidebarComponent } from "./common/components/sidebar/sidebar.component";
import { UserComponent } from "./common/components/user/user.component";
import { environment } from "../environments/environment";
import { rootReducer } from "./common/ngRx/reducers/root-reducer";
import { DatadogService } from "./services/datadog-service/datadog.service";

const isIE =
  window.navigator.userAgent.indexOf("MSIE ") > -1 ||
  window.navigator.userAgent.indexOf("Trident/") > -1;

function initializeDatadog(datadogService: DatadogService) {
  return (): Promise<void> => {
    return new Promise((resolve) => {
      datadogService.initializeRUM();
      resolve();
    });
  };
}

LicenseManager.setLicenseKey(environment.license);
@NgModule({
  declarations: [AppComponent, AppToolbar, SidebarComponent, UserComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    BricksUiModule,
    MatInputModule,
    MatMenuModule,
    MatButtonModule,
    ToastrModule.forRoot(),
    StoreModule.forRoot(rootReducer),
    MsalModule.forRoot(
      new PublicClientApplication({
        auth: {
          clientId: "e7483ba5-3d84-4f64-b077-0bab410a4ca5",
          postLogoutRedirectUri:
            "https://gasdashboard.tradingmop-gasdashboarddev.enbw.cloud/",
        },
        cache: {
          cacheLocation: "localStorage",
          storeAuthStateInCookie: isIE, // Set to true for Internet Explorer 11
        },
      }),
      {
        interactionType: InteractionType.Redirect,
        authRequest: { scopes: ["user.read"] },
      },
      {
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map(),
      }
    ),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    DatadogService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeDatadog,
      deps: [DatadogService],
      multi: true,
    },
    provideHttpClient(withInterceptorsFromDi()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
