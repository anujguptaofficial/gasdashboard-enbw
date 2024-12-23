import { AfterViewInit, Component, OnInit } from "@angular/core";
import { formatDate } from "@angular/common";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { ColumnMovedEvent, RowDataUpdatedEvent } from "@ag-grid-community/core";
import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridReadyEvent,
} from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { InfiniteRowModelModule } from "@ag-grid-community/infinite-row-model";
import { MenuModule } from "@ag-grid-enterprise/menu";
import { Subscription } from "rxjs";

import { ApiService } from "../../services/api-service/api.service";
import {
  NavbarResponse,
  HeaderColumn,
  BodyScrollEvent,
} from "../../common/interfaces/table.interface";
import { StoreService } from "../../services/api-store-service/store.service";
import { CustomHeaderGroup } from "../custom-aggridComponent/customtableheader/custom-header-group.component";
import { SharedService } from "../../services/shared-service/shared.service";
import { CustomNoRowsOverlay } from "../custom-aggridComponent/custom-norows-overlay/custom-norows-overlay.component";
import { CONSTANTS } from "../../common/utils/constant";

@Component({
  selector: "app-historictable",
  templateUrl: "./historic-table.component.html",
})
export class HistoricTableComponent implements OnInit, AfterViewInit {
  modules: any[] = [
    MenuModule,
    InfiniteRowModelModule,
    ClientSideRowModelModule,
  ];

  frameworkComponents: any;
  selectedGranularity: string;
  countryCode: string;
  gridApi: GridApi;
  columnDefs: ColGroupDef[];
  headerColDef: ColDef[] = [];
  rowData: ColDef[] = [];
  isGridReady: boolean = false;
  defaultColDef: ColDef = {
    flex: 1,
    autoHeaderHeight: true,
    suppressMenu: true,
  };
  yesterdayDate: string;
  endDate: string;
  startRow: number = 0;
  endRow: number = 60;
  rowHeight: number;
  pinnedBottomRowData: any;
  refreshStart: boolean;
  disableGraphData: boolean;
  reloadRowData: any;
  noRowsOverlayComponent: any;
  subscriptionManager: Subscription;
  resetRefresh: boolean;
  resetGranularity: boolean;
  rowDataLength: number;
  loadingIcon: boolean = true;
  toggleRowData: boolean;
  resetToggle: boolean;
  toggle: boolean;

  constructor(
    private readonly activeRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly sharedService: SharedService,
    private readonly tableContent: ApiService,
    private readonly storeService: StoreService
  ) {
    this.reloadRowData = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.router.navigated = false;
      }
    });
    this.frameworkComponents = {
      customHeaderGroupComponent: CustomHeaderGroup,
      customNoRowsOverlay: CustomNoRowsOverlay,
    };
    this.subscriptionManager = new Subscription();
    this.rowHeight = 20;
    this.noRowsOverlayComponent = "customNoRowsOverlay";
    this.refreshStart = false;
    this.toggleRowData = false;
    this.disableGraphData = true;
    this.resetRefresh = this.resetGranularity = false;
    this.rowDataLength = 60;
  }

  ngOnInit(): void {
    // this.selectedGranularity = localStorage.getItem("Granularity")!;
    
    this.activeRoute.params.subscribe(() => {
      this.getCountryCode();
      this.getSelectedGranularity();
      this.onHeaderInitalise();
      this.historyRefreshControl();
    });
    this.pinnedBottomRowData = [];
  }

  ngOnDestroy(): void {
    this.subscriptionManager.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.updateTableOnToggle();
  }

  getCountryCode = () => {
    this.countryCode = this.router.url.split("/")[1];
    this.sharedService.setCountryCode(this.countryCode);
    this.sharedService.setRefreshGrid(false)
  };

  getSelectedGranularity = () => {
    this.subscriptionManager.add(
      this.sharedService.getGranularity().subscribe((granularity: string) => {
        if (granularity) {
          // this.selectedGranularity = localStorage.getItem("Granularity")!;
          this.storeService.getGranularity().subscribe((data) => {
            if(data) this.selectedGranularity = data
          })
          this.resetGranularity = true;
          this.getStartData();
        }
      })
    );
  };

  onHeaderInitalise = () => {
    const tableheader = this.storeService.getListofCountries()[1];
    tableheader.subscribe((res: NavbarResponse[]) => {
      if (res.length) {
        for (const i in res) {
          if (res[i].name === this.countryCode) {
            this.headerColDef = [];
            const headerArr: any = [];
            res[i].columns.forEach((name: HeaderColumn) => {
              headerArr.push(name);
            });
            this.sharedService.setRowHeader(headerArr);
            let columnsName = res[i].columns.map((header: HeaderColumn) => ({
              headerName: this.sharedService.percentageToggle(
                this.toggle,
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
                filter: true,
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
                  bomDisplay: (params: any) => {
                    return params.node.rowPinned;
                  },
                  appearance: (params: any) => {
                    if (el.appearance === CONSTANTS.BALANCING) {
                      if (params.data && parseInt(params.data.mktBalance) < 0) {
                        return params.data.mktBalance;
                      }
                    }
                  },
                },
              };
              this.headerColDef.push(headerColumn);
            });
          }
        }
        this.columnDefs = [
          {
            headerGroupComponent: "customHeaderGroupComponent",
            children: [
              {
                minWidth: 100,
                headerName: CONSTANTS.CAMELCASE_DATE,
                field: CONSTANTS.UPPERCASE_DATE,
                colId: CONSTANTS.UPPERCASE_DATE,
                filter: true,
                valueFormatter: (params) => {
                  return params.value === 0 ? "0" : params.value || "";
                },
                cellClassRules: {
                  summer: (params) => {
                    const month = this.sharedService.getMonth(params);
                    return +month >= 3 && +month <= 8;
                  },
                  winter: (params) => {
                    const month = this.sharedService.getMonth(params);
                    return +month >= 9 || +month < 3;
                  },
                  bomDisplay: (params: any) => {
                    return params.node.rowPinned;
                  },
                },
              },
              ...this.headerColDef,
            ],
          },
        ];
      }
    });
  };

  onGridReady = (params: GridReadyEvent) => {
    if (params) {
      this.isGridReady = true;
      this.gridApi = params.api;
      this.historyTableContent();
      this.createBomData();
    }
  };

  onRowDataChanged = (event: RowDataUpdatedEvent) => {
    if (event) {
      let getRowIndex: number = this.rowDataLength;
      this.gridApi?.ensureIndexVisible(getRowIndex - 2);
    }
  };

  updatedGridData = () => {
    if (this.isGridReady) {
      this.loadingIcon = true;
      this.createBomData();
      this.historyTableContent();
    }
  };

  fetchDates = () => {
    this.yesterdayDate = this.sharedService.updateRowDataOnGranulairty(
      this.selectedGranularity,
      this.startRow,
      this.endRow,
      false
    )[0];
    this.endDate = this.sharedService.updateRowDataOnGranulairty(
      this.selectedGranularity,
      this.startRow,
      this.endRow,
      false
    )[1];
  };

  createBomData = () => {
    let result: ColDef[] = [];
    this.fetchDates();
    const gasDataParams = {
      startDate: this.endDate,
      endDate: this.yesterdayDate,
      bom: "true",
      foreCastMode: "history",
      granularity: this.selectedGranularity,
      countryCode: this.countryCode,
      percentage: this.toggleRowData,
      scenarioValue: CONSTANTS.DEFAULT,
    };
    this.subscriptionManager.add(
      this.tableContent.getGasData(gasDataParams).subscribe({
        next: (res) => {
          if (res) {
            this.gridApi.hideOverlay();
            const bomData = this.sharedService.csvToJSON(res);
            bomData.splice(-1);
            bomData.forEach((item: any) => {
              item.DATE = item.DATE.replace(/_/g, " ");
              result.push(item);
            });
            this.pinnedBottomRowData = [...result];
          }
        },
        error: (err) => {
          this.pinnedBottomRowData = [
            {
              DATE: err.error,
            },
          ];
        },
      })
    );
  };

  historyRefreshControl = () => {
    this.subscriptionManager.add(
      this.sharedService.getRefreshGrid().subscribe((data: boolean) => {
        if (data) {
          this.refreshStart = data;
          this.resetRefresh = data;
          this.getStartData();
        }
      })
    );
  };

  updateTableOnToggle = () => {
    this.subscriptionManager.add(
      this.sharedService.getToggleToPer().subscribe((event: boolean) => {
        this.toggleRowData = event;
        this.toggle = event;
        this.resetToggle = true;
        this.getStartData();
        this.onHeaderInitalise();
      })
    );
  };

  onColumnMoved = (params: ColumnMovedEvent) => {
    if (params) {
      this.sharedService.setHeader(params.api.getAllGridColumns());
    }
  };

  historyTableContent = () => {
    this.gridApi.setGridOption("loading", true);
    this.fetchDates();
    this.dateFormate(this.yesterdayDate);
    const gasDataParams = {
      startDate: this.endDate,
      endDate: this.yesterdayDate,
      bom: "false",
      foreCastMode: "history",
      granularity: this.selectedGranularity,
      countryCode: this.countryCode,
      percentage: this.toggleRowData,
      scenarioValue: CONSTANTS.DEFAULT,
    };
    this.subscriptionManager.add(
      this.tableContent.getGasData(gasDataParams).subscribe({
        next: (res) => {
          this.gridApi.setGridOption("loading", false);
          if (res) {
            this.refreshStart = false;
            this.rowData = this.sharedService.csvToJSON(res);
            this.rowData.splice(-1);
            this.sharedService.setChartData(this.rowData);
            this.rowDataLength = this.rowData.length;
            this.rowData.sort(
              (a: any, b: any) =>
                new Date(a.DATE).getTime() - new Date(b.DATE).getTime()
            );
            this.disableGraphData = false;
            this.gridApi.setGridOption("rowData", this.rowData);
          }
        },
        error: (err) => {
          this.gridApi.setGridOption("loading", false);
          this.gridApi.setGridOption("rowData", []);
          this.sharedService.errorDisplay(err, this.gridApi);
          this.refreshStart = false;
        },
      })
    );
  };

  getStartData = () => {
    this.startRow = 0;
    if (["yearly", "seasonally"].includes(this.selectedGranularity)) {
      this.endRow = 15;
    } else {
      this.endRow = 60;
    }
    this.updatedGridData();
  };

  handleScroll = (event: BodyScrollEvent) => {
    if (
      event.top === 0 &&
      !this.resetRefresh &&
      !this.resetGranularity &&
      !this.resetToggle
    ) {
      this.startRow = this.endRow;
      if (["yearly", "seasonally"].includes(this.selectedGranularity)) {
        this.endRow += 15;
      } else {
        this.endRow += 60;
      }
      this.yesterdayDate = this.sharedService.updateRowDataOnGranulairty(
        this.selectedGranularity,
        this.startRow,
        this.endRow,
        false
      )[0];
      this.endDate = this.sharedService.updateRowDataOnGranulairty(
        this.selectedGranularity,
        this.startRow,
        this.endRow,
        false
      )[1];
      this.gridApi.setGridOption("loading", true);
      this.dateFormate(this.yesterdayDate);
      const gasDataParams = {
        startDate: this.endDate,
        endDate: this.yesterdayDate,
        bom: "false",
        foreCastMode: "history",
        granularity: this.selectedGranularity,
        countryCode: this.countryCode,
        percentage: this.toggleRowData,
        scenarioValue: CONSTANTS.DEFAULT,
      };
      this.subscriptionManager.add(
        this.tableContent.getGasData(gasDataParams).subscribe({
          next: (res) => {
            if (res) {
              this.gridApi.setGridOption("loading", false);
              this.gridApi.hideOverlay();
              let chartData: ColDef<any>[] = [];
              this.sharedService.csvToJSON(res).forEach((item: any) => {
                if (item.DATE) {
                  chartData.unshift(item);
                  this.rowData.unshift(item);
                }
                this.sharedService.setChartData(chartData);
              });
              this.gridApi.setGridOption("rowData", this.rowData);
              this.resetRefresh =
                this.resetToggle =
                this.resetGranularity =
                  true;
            }
          },
          error: (err) => {
            this.gridApi.setGridOption("rowData", []);
            this.sharedService.errorDisplay(err, this.gridApi);
            this.refreshStart = false;
          },
        })
      );
    }
    this.resetRefresh = this.resetToggle = this.resetGranularity = false;
  };

  dateFormate = (beforeDate: string) => {
    if (beforeDate) {
      let dateFormate: Date = new Date(beforeDate);
      dateFormate.setDate(dateFormate.getDate() - 1);
      this.yesterdayDate = formatDate(
        dateFormate,
        CONSTANTS.FORMAT_DATE_DD,
        "en"
      );
    }
  };
}
