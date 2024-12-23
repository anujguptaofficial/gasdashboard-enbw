import { AfterViewInit, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  Module,
  IDatasource,
  IGetRowsParams,
} from "@ag-grid-community/core";
import { MenuModule } from "@ag-grid-enterprise/menu";
import { InfiniteRowModelModule } from "@ag-grid-community/infinite-row-model";
import { distinctUntilChanged, Subscription } from "rxjs";

import { StoreService } from "../../services/api-store-service/store.service";
import { CustomHeaderGroup } from "../custom-aggridComponent/customtableheader/custom-header-group.component";
import { SharedService } from "../../services/shared-service/shared.service";
import {
  HeaderColumn,
  HeaderField,
  NavbarResponse,
  ForecastGasDataParams,
} from "../../common/interfaces/table.interface";
import { ApiService } from "../../services/api-service/api.service";
import { CustomNoRowsOverlay } from "../custom-aggridComponent/custom-norows-overlay/custom-norows-overlay.component";
import { CONSTANTS, GRANULARITY_OPTIONS } from "../../common/utils/constant";

@Component({
  selector: "app-forecast-table",
  templateUrl: "./forecast-table.component.html",
})
export class ForecastTableComponent implements OnInit, AfterViewInit {
  modules: Module[] = [MenuModule, InfiniteRowModelModule];
  forecastheaderColDef: ColDef[] = [];
  forecastColDefs: any;
  forecastData: ColDef[] = [];
  gridApi: GridApi;
  isForecaseGridReady: boolean = false;
  forecastDefaultColDef: ColDef = {
    flex: 1,
    autoHeaderHeight: true,
    suppressMenu: true,
  };
  frameworkComponents: any;
  reloadRowData: any;
  selectedGranularity: string;
  countryCode: string;
  startRow: number;
  endRow: number;
  endDate: string;
  startDate: string;
  rowHeight: number;
  noRowsOverlayComponent: any;
  subscriptionManager: Subscription;
  isSeason: boolean = false;
  toggleRowData: boolean;
  scenarioValue: string;
  lastGasDataParams: ForecastGasDataParams;

  constructor(
    private readonly activeRoute: ActivatedRoute,
    private readonly storeService: StoreService,
    private readonly forecastTableData: ApiService,
    private readonly router: Router,
    private readonly sharedService: SharedService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.reloadRowData = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.router.navigated = false;
      }
    });
    this.frameworkComponents = {
      customHeaderGroupComponent: CustomHeaderGroup,
      customNoRowsOverlay: CustomNoRowsOverlay,
    };
    this.rowHeight = 20;
    this.noRowsOverlayComponent = CONSTANTS.CUSTOM_OVERLAY;
    this.subscriptionManager = new Subscription();
  }

  ngOnInit(): void {
    // this.selectedGranularity = localStorage.getItem("Granularity")!;
    this.storeService.getGranularity().subscribe((data) => {
      if(data) this.selectedGranularity = data
    })
    this.activeRoute.params.subscribe(() => {
      this.getCountryCode();
      this.onForecastHeaderInitalise();
      this.getSelectedGranularity();
      this.forecastRefreshControl();
    });
    this.subscriptionManager.add(
      this.sharedService.getScenario()
        .pipe(distinctUntilChanged()) 
        .subscribe((value: string) => {
          if (value && value !== this.scenarioValue) {
            this.scenarioValue = value;
            this.forecastTableContent(); 
          }
        })
    );
  }

  ngAfterViewInit(): void {
    this.subscriptionManager.add(
      this.sharedService.getHeader().subscribe((data: any) => {
        if (data) {
          let columnData: HeaderField[] = [];
          data.forEach((item: any) => {
            columnData.push(item.colDef);
          });
        }
      })
    );
    this.updateForecastOnToggle();
  }

  ngOnDestroy(): void {
    this.subscriptionManager.unsubscribe();
  }

  getCountryCode = () => {
    this.countryCode = this.router.url.split("/")[1];
  };

  getScenarioValue = (): void => {
    this.scenarioValue = localStorage.getItem('scenarioUpdate') ?? CONSTANTS.DEFAULT;
    this.forecastTableContent(); 
  };

  onForecastHeaderInitalise = () => {
    const tableheader = this.storeService.getListofCountries()[1];
    tableheader.subscribe((res: NavbarResponse[]) => {
      if (res.length) {
        for (const i in res) {
          if (res[i].name === this.countryCode) {
            this.forecastheaderColDef = [];
            const headerArr: string[] = [];
            res[i].columns.forEach((name: HeaderColumn) => {
              headerArr.push(name.percentage_display_name);
            });
            let columnsName = res[i].columns.map((header: HeaderColumn) => ({
              headerName: this.sharedService.percentageToggle(
                this.toggleRowData,
                header
              ),
              field: header.id,
              appearance: header.appearance,
            }));
            columnsName.forEach((el: any) => {
              let headerColumn: ColDef = {
                headerName: el.headerName,
                colId: el.field,
                field: el.field,
                valueFormatter: (params) => {
                  return params.value === 0 ? "0" : params.value || "";
                },
                cellClassRules: {
                  summer: (params) => {
                    const month = this.sharedService.getMonthForRows(params);
                    return +month >= 3 && +month <= 8;
                  },
                  winter: (params) => {
                    const month = this.sharedService.getMonthForRows(params);
                    return +month >= 9 || +month < 3;
                  },
                  appearance: (params: any) => {
                    if (
                      el.appearance === CONSTANTS.BALANCING &&
                      params.data &&
                      parseInt(params.data.mktBalance) < 0
                    ) {
                      return params.data.mktBalance;
                    }
                  },
                },
              };
              this.forecastheaderColDef.push(headerColumn);
            });
          }
        }
        this.forecastColDefs = [
          {
            children: [
              {
                minWidth: 100,
                headerName: CONSTANTS.CAMELCASE_DATE,
                field: CONSTANTS.UPPERCASE_DATE,
                colId: CONSTANTS.UPPERCASE_DATE,
                cellClassRules: {
                  summer: (params: any) => {
                    const month = this.sharedService.getMonth(params);
                    return +month >= 3 && +month <= 8;
                  },
                  winter: (params: any) => {
                    const month = this.sharedService.getMonth(params);
                    return +month >= 9 || +month < 3;
                  },
                },
              },
              ...this.forecastheaderColDef,
            ],
          },
        ];
      }
    });
  };

  onGridReady = (params: GridReadyEvent) => {
    if (params) {
      this.isForecaseGridReady = true;
      this.gridApi = params.api;
      this.getScenarioValue();
    }
  };

  forecastTableContent = () => {
    const dataSource: IDatasource = {
      rowCount: undefined,
      getRows: (params: IGetRowsParams) => {
        this.startRow = params.startRow;
        this.endRow = params.endRow;
        this.startDate = this.sharedService.updateRowDataOnGranulairty(
          this.selectedGranularity,
          this.startRow,
          this.endRow,
          true
        )[0];
        this.endDate = this.sharedService.updateRowDataOnGranulairty(
          this.selectedGranularity,
          this.startRow,
          this.endRow,
          true
        )[1];
        this.gridApi.setGridOption("loading", true);
        const gasDataParams = {
          startDate: this.startDate,
          endDate: this.endDate,
          bom: "false",
          foreCastMode: "forecast",
          granularity: this.selectedGranularity,
          countryCode: this.countryCode,
          percentage: this.toggleRowData,
          scenarioValue: this.scenarioValue,
        };
        if (JSON.stringify(gasDataParams) === JSON.stringify(this.lastGasDataParams)) {
          params.successCallback(this.forecastData, -1); 
          this.gridApi.setGridOption("loading", false);
          return;
        }
        this.lastGasDataParams = { ...gasDataParams }; 
        this.subscriptionManager.add(
          this.forecastTableData.getGasData(gasDataParams).subscribe({
            next: (res) => {
              this.gridApi.setGridOption("loading", false);
              this.forecastData = this.sharedService.csvToJSON(res);
              this.sharedService.setForecastRowData(this.forecastData);
              this.forecastData.sort(
                (a: any, b: any) =>
                  new Date(a.DATE).getTime() - new Date(b.DATE).getTime()
              );
              setTimeout(() => {
                const rowsThisPage = this.forecastData;
                let lastRow = -1;
                params.successCallback(rowsThisPage, lastRow);
              }, 500);
              this.isForecaseGridReady = true;
            },
            error: (err) => {
              this.gridApi.setGridOption("loading", false);
              this.forecastData = [];
              params.failCallback();
              this.sharedService.errorDisplay(err, this.gridApi); 
            },
          })
        );
      },
    };
    setTimeout(() => {
      this.gridApi.setGridOption("datasource", dataSource);
    }, 100);
  };

  updatedForecastGridData = () => {
    if (this.isForecaseGridReady) {
      this.gridApi.purgeInfiniteCache();
      this.lastGasDataParams = JSON.parse(JSON.stringify({}));
    }
  };

  getSelectedGranularity = () => {
    this.subscriptionManager.add(
      this.sharedService.getGranularity().subscribe((granularity: string) => {
        if (granularity) {
          // this.selectedGranularity = localStorage.getItem("Granularity")!;
          this.storeService.getGranularity().subscribe((data) => {
            if(data) this.selectedGranularity = data
          })
          this.updatedForecastGridData();
        }
      })
    );
  };

  forecastRefreshControl = () => {
    this.subscriptionManager.add(
      this.sharedService.getRefreshGrid().subscribe((data: boolean) => {
        if (data) {
          this.updatedForecastGridData();
        }
      })
    );
  };

  updateForecastOnToggle = () => {
    this.subscriptionManager.add(
      this.sharedService.getToggleToPer().subscribe((event: boolean) => {
        this.toggleRowData = event;
        this.updatedForecastGridData();
      })
    );
  };
}
