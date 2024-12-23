import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { formatDate } from "@angular/common";
import { MatDialogRef } from "@angular/material/dialog";
import { BehaviorSubject, Subject, Subscription, tap } from "rxjs";
import * as moment from 'moment';

import { ApiService } from "../../../services/api-service/api.service";
import { ExcelExportService } from "../../../services/excel-service/export-excel.service";
import { SharedService } from "../../../services/shared-service/shared.service";
import { CONSTANTS, ERROR, GRANULARITY_OPTIONS } from "../../utils/constant";
import {
  NotificationMessage,
  NotificationType,
} from "../../../services/shared-service/notify.message";
import { ToastService } from "../../../services/toastr-service/toatr.service";
import { DownloadExcelColumns } from "../../interfaces/table.interface";

@Component({
  selector: "app-download-excel",
  templateUrl: "./download-excel.component.html",
  styleUrls: ["./download-excel.component.scss"],
})
export class DownloadExcelComponent implements OnInit {
  @ViewChild("fromdate") emptyfromDate: ElementRef;
  @ViewChild("todate") emptyToDate: ElementRef;

  selectedGranularity: string;
  countryCode: string;
  loading: Subject<boolean> = new BehaviorSubject<boolean>(false);
  fromDate: string;
  toDate: string;
  historyData: any = [];
  forecastData: any = [];
  gridColumnsHeader: DownloadExcelColumns[] = [];
  downloadError: string;
  successMessage: string;
  fromDateObj: Date;
  toDateObj: Date;
  requestedHistory: boolean = false;
  requestedForecast: boolean = false;
  toggleRowData: boolean = true;
  subscriptionManager: Subscription;

  constructor(
    public dialogRef: MatDialogRef<DownloadExcelComponent>,
    private downloadSelected: ApiService,
    private exportService: ExcelExportService,
    private sharedService: SharedService,
    private toastrServce: ToastService
  ) {
    this.subscriptionManager = new Subscription();
  }

  ngOnInit(): void {

    this.sharedService.getGranularity().subscribe(() => {
      this.selectedGranularity = localStorage.getItem("Granularity")! || GRANULARITY_OPTIONS[0];
    });

    this.sharedService.getCountryCode().subscribe((code: string) => {
      if (code) {
        this.countryCode = code;
      }
    });
    this.sharedService.getToggleToPer().subscribe((event: boolean) => {
      this.toggleRowData = event;
    });

    this.sharedService.getRowHeader().subscribe((columnsHeader: DownloadExcelColumns[]) => {
      if (columnsHeader?.length) {
        this.gridColumnsHeader = [
          { id: "DATE", bcm_display_name: "Date" },
          ...columnsHeader
            .filter((data:DownloadExcelColumns) => data.id && data.bcm_display_name)
            .map((data:DownloadExcelColumns) => ({ id:data.id, bcm_display_name:data.bcm_display_name }))
        ];
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptionManager.unsubscribe();
  }

  getFromDate = (event: { value: Date }) => {
    if (event.value) {
      this.fromDateObj = new Date(event.value);
      this.fromDate = moment(this.fromDateObj).format(CONSTANTS.FORMAT_DATE);
    }
  };

  getToDate = (event: { value: Date }) => {
    if (event.value) {
      this.toDateObj = new Date(event.value);
      this.toDate = moment(this.toDateObj).format(CONSTANTS.FORMAT_DATE);
    }
  };

  resetDatePicker = () => {
    this.emptyfromDate.nativeElement.value = "";
    this.emptyToDate.nativeElement.value = "";
    this.fromDate = "";
    this.toDate = "";
  };

  downloadFile = () => {
    this.historyData = null;
    this.forecastData = null;
    this.loading.next(true);
    this.downloadError = "";
    this.successMessage = "";
    const today = new Date();
    const formattedDate = today.toISOString().substring(0, 10);
    const yesterdayDate = new Date(today);
    yesterdayDate.setDate(today.getDate() - 1);
    const selectedScenario = localStorage.getItem('scenarioUpdate')
    if (this.fromDate > this.toDate) {
      this.loading.next(false);
      this.checkDateRange();
    }
    if (this.fromDate < formattedDate && this.toDate > this.fromDate) {
      this.requestedHistory = true;
      this.selectDownloadData(this.fromDate, this.toDate, "history", CONSTANTS.DEFAULT);
    }
    if (this.toDate >= formattedDate && selectedScenario) {
      if (this.fromDate < formattedDate) {
        this.fromDate = formattedDate;
      }
      this.requestedForecast = true;
      this.selectDownloadData(formattedDate, this.toDate, "forecast", selectedScenario);
    }
  };

  verifyExportData = () => {
    if (
      (this.requestedForecast && !this.forecastData) ||
      (this.requestedHistory && !this.historyData) ||
      (this.requestedForecast &&
        this.requestedHistory &&
        !this.forecastData &&
        !this.historyData)
    ) {
      return;
    }
      this.exportService.exportExcel(
        this.historyData || [],
        this.forecastData || [],
        CONSTANTS.GASDATA, 
        this.gridColumnsHeader
    );
    this.successMessage = CONSTANTS.DOWNLOAD_SUCCEESSFULL;
    const message: NotificationMessage = {
      message: this.successMessage,
      type: NotificationType.success,
    };
    this.toastrServce.toastr(message);
    this.historyData = null;
    this.forecastData = null;
    this.requestedForecast = false;
    this.requestedHistory = false;
  };

  selectDownloadData = (
    startDate: string,
    endDate: string,
    dataType: string,
    scenario: string
  ) => {
    const gasDataParams = {
      startDate: startDate,
      endDate: endDate,
      bom: "false",
      foreCastMode: dataType,
      granularity: this.selectedGranularity,
      countryCode: this.countryCode,
      percentage: this.toggleRowData,
      scenarioValue:  scenario,
    };
    this.subscriptionManager.add(
      this.downloadSelected
        .getGasData(gasDataParams)
        .pipe(tap(() => this.loading.next(false)))
        .subscribe({
          next: (res) => {
            if (res) {
              const gridData = this.sharedService.csvToJSON(res);
              if (dataType === "history") {
                this.historyData = gridData;
                this.verifyExportData();
              } else {
                this.forecastData = gridData;
                this.verifyExportData();
              }
            }
            this.resetDatePicker();
          },
          error: (err) => {
            this.loading.next(false);
            if (err.status == 502) {
              if (this.fromDateObj > this.toDateObj) {
                this.checkDateRange();
              } else {
                this.downloadError = ERROR.ERROR_502;
                const message: NotificationMessage = {
                  message: this.downloadError,
                  type: NotificationType.error,
                };
                this.toastrServce.toastr(message);
              }
            } else if (err.status == 409) {
              this.downloadError = ERROR.ERROR_408;
              const message: NotificationMessage = {
                message: this.downloadError,
                type: NotificationType.error,
              };
              this.toastrServce.toastr(message);
            } else if (err.status == 401) {
              this.downloadError = ERROR.ERROR_401;
              const message: NotificationMessage = {
                message: this.downloadError,
                type: NotificationType.error,
              };
              this.toastrServce.toastr(message);
            }
            this.resetDatePicker();
          },
        })
    );
  };

  closeDialog = () => {
    this.dialogRef.close();
  };

  checkDateRange = () => {
    this.downloadError = CONSTANTS.CORRECT_DATE_RANGE;
    const message: NotificationMessage = {
      message: this.downloadError,
      type: NotificationType.warning,
    };
    this.toastrServce.toastr(message);
  };
}
