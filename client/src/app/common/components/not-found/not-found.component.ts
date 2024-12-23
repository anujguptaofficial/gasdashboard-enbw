import { Component, Input, OnInit } from "@angular/core";

import { RoutingService } from "../../../services/routing-service/routing-service.service";
import { StoreService } from "../../../services/api-store-service/store.service";

@Component({
  selector: "app-not-found",
  templateUrl: "./not-found.component.html",
  styleUrls: ["./not-found.component.scss"],
})
export class NotFoundComponent implements OnInit {
  /** Specifies the text on the button to get back */
  @Input()
  public homeButtonTitle: string = "Go Home";
  public overViewName: string;

  /** Will redirect to the Operation Center Page */
  constructor(
    private readonly navigateUrl: RoutingService,
    private readonly listofCountries: StoreService
  ) {}

  ngOnInit(): void {
    this.getListOfCountries();
  }

  navigateToHomePage = () => {
    this.navigateUrl.navigateToURL(this.overViewName);
  };

  getListOfCountries = () => {
    const listCountries = this.listofCountries.getListofCountries();
    listCountries[1].subscribe((res: any) => {
      if (res.length) {
        this.overViewName = res[0].visualization;
      }
    });
  };
}
