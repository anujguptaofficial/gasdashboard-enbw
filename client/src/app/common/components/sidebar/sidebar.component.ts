import { Component, OnInit } from "@angular/core";
import { SidebarMenuItem } from "@enbw_bricks/ui/lib/sidebar/menu-item/sidebar-menu-item.model";

import { RoutingService } from "../../../services/routing-service/routing-service.service";
import { StoreService } from "../../../services/api-store-service/store.service";
import { CountryField } from "../../interfaces/sidebar.interface";
import { NavbarResponse } from "../../interfaces/table.interface";
import { COUNTRY_ICONS } from "../../utils/constant";
import { SharedService } from "../../../services/shared-service/shared.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  listOfCountries: CountryField[] = [];
  link: string;
  menuList: SidebarMenuItem[] = [];
  countryIcons: { [key: string]: string } = COUNTRY_ICONS;
  allCountryCode: string[] = [];

  constructor(
    private readonly routingService: RoutingService,
    private readonly listofCountries: StoreService,
    private readonly sharedService: SharedService
  ) {}

  ngOnInit() {
    this.getListOfCountries();
  }

  getListOfCountries = () => {
    const listCountries = this.listofCountries.getListofCountries();
    listCountries[1].subscribe((res: NavbarResponse[]) => {
      if (res) {
        for (const i in res) {
          const country = res[i];
          this.listOfCountries.push({
            code: country.visualization,
            country: country.displayname,
            countryCode: country.name,
          });
          const svgIcon =
            this.countryIcons[country.visualization.toLowerCase()] || "";
          this.menuList.push({
            id: parseInt(i, 10),
            title: country.displayname,
            iconName: country.visualization.toLowerCase(),
            customSvgIcon: svgIcon,
            childMenuItems: [],
            isSectionSeperator: true,
            isMenuSelected: false,
            routerPath: country.name,
            routerLinkActiveOptions: { exact: false },
          });
        }

        this.listOfCountries.forEach((country) => {
          this.allCountryCode.push(country.countryCode);
          this.sharedService.setAllCountryCodes(this.allCountryCode);
        });
        this.listOfCountries.forEach((item: CountryField) => {
          if (item.code === "nwe_overview") {
            item.code = "eu";
          }
        });
      }
    });
  };

  navigateToCountryURL = (event: any) => {
    if (event) {
      this.link = event;
      this.routingService.navigateToURL(event);
      const closeSideBarMenu: any = document.querySelectorAll(
        "button.ng-star-inserted"
      )[0];
      if (closeSideBarMenu) {
        closeSideBarMenu.click();
      }
    }
  };
}
