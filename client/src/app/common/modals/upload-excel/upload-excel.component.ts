import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { BehaviorSubject, Subject, Subscription, tap } from "rxjs";
import * as XLSX from "xlsx";

import {
  CONSTANTS,
  ERROR,
  FORECAST,
} from "../../utils/constant";
import { ApiService } from "../../../services/api-service/api.service";
import { SharedService } from "../../../services/shared-service/shared.service";
import {
  NotificationMessage,
  NotificationType,
} from "../../../services/shared-service/notify.message";
import { ToastService } from "../../../services/toastr-service/toatr.service";
import { StoreService } from "../../../services/api-store-service/store.service";
import { NavbarResponse } from "../../interfaces/table.interface";

@Component({
  selector: "app-upload-excel",
  templateUrl: "./upload-excel.component.html",
  styleUrls: ["./upload-excel.component.scss"],
})
export class UploadExcelComponent implements OnInit {
  @ViewChild("file") inputFile: ElementRef;
  loading: Subject<boolean> = new BehaviorSubject<boolean>(false);
  selectForecast = Object.keys(FORECAST);
  forecastPeriod: string = Object.keys(FORECAST)[0];
  selectedFile: any;
  countryCode: string;
  selectedFileName: string;
  fileNameTooltip: string;
  successMessage: string = "";
  errorMessage: string = "";
  csvFile: string;
  multipleCSVFile: string[] = [];
  sheetNames: string[] = [];
  sheetName: string;
  fileSheetselection = true;
  pastedCSV: string;
  buttonConditon = false;
  uploadExcelText: string;
  uploadPasteText: string;
  forecastFile: string;
  fileCounter: number = 0;
  scenarioNames: string[];
  scenarioText: string;
  displayCountyName: string;
  allCountryCode: string[];
  currentUrl = window.location.pathname;
  disableCopyPasteButton: boolean = false;
  subscriptionManager: Subscription;
  invalidSheetName: string[];

  constructor(
    public dialogRef: MatDialogRef<UploadExcelComponent>,
    private sharedService: SharedService,
    private uploadForecast: ApiService,
    readonly toastrService: ToastService,
    private readonly listofCountries: StoreService
  ) {
    this.uploadExcelText = CONSTANTS.UPLOAD_DATA;
    this.uploadPasteText = CONSTANTS.UPLOAD_PASTE_DATA;
    this.scenarioText = CONSTANTS.DEFAULT;
    this.pastedCSV = "";
    this.subscriptionManager = new Subscription();
  }

  ngOnInit(): void {
    this.displayCountryName();
    this.getAllCountryCodes();
    this.getCurrentCountryCode();
    this.listOfScenarios();
    this.disableCopyPasteButton = this.currentUrl !== "/";
  }

  ngOnDestroy(): void {
    this.subscriptionManager.unsubscribe();
  }

  displayCountryName = () => {
    this.sharedService.getDisplayName().subscribe((name: string) => {
      if (name) this.displayCountyName = name;
    });
  };

  getAllCountryCodes = () => {
    this.sharedService.getAllCountryCodes().subscribe((countries: string[]) => {
      if (countries) this.allCountryCode = countries;
    });
  };

  getCurrentCountryCode = () => {
    this.sharedService.getCountryCode().subscribe((code: string) => {
      if (code) {
        this.countryCode = code;
      }
    });
  };

  onSelectForecast = (event: any) => {
    if (event) {
      this.forecastPeriod = event;
      this.inputValidationStatus();
    }
  };

  resetInputField = () => {
    if (this.selectedFile) {
      this.inputFile.nativeElement.value = "";
      this.selectedFileName = CONSTANTS.CHOOSE_ANOTHER_FILE;
    }
  };

  getPastedData = (data: any) => {
    this.pastedCSV = data;
    if (this.pastedCSV.length) {
      this.buttonConditon = false;
      this.selectedFile = true;
    } else {
      this.buttonConditon = true;
      this.selectedFile = false;
    }
  };

  hasDuplicateDates = (csvData: string): boolean => {
    if (!csvData) {
      this.errorMessage = ERROR.EMPTY_FILE;
      return true;
    }
    const rows = csvData.split("\n").filter((row) => row.trim() !== "");
    if (rows.length === 0 || !rows[0]) {
      this.errorMessage = ERROR.MISSING_DATA;
      return true;
    }
    const dateColumnIndex = rows[0].toLowerCase().split(",").indexOf("date");
    if (dateColumnIndex === -1) {
      this.errorMessage = ERROR.DATE_MISSING;
      return true;
    }
    const dates = new Set();
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].split(",");
      const dateValue = row[dateColumnIndex]?.trim();
      if (dateValue && dates.has(dateValue)) {
        this.errorMessage = ERROR.DUPLICATE_DATE(dateValue);
        return true;
      }
      dates.add(dateValue);
    }
    return false;
  };

  onFileSelected = (event: any) => {
    if (event) {
      this.fileNameTooltip = event.target.files[0].name.split(".")[0];
      this.selectedFileName =
        event.target.files[0].name.split(".")[0].length <= 10
          ? event.target.files[0].name.split(".")[0]
          : `${event.target.files[0].name.split(".")[0].substring(0, 8)}...`;
      this.selectedFile = event.target.files[0];
      if (this.selectedFile) {
        this.buttonConditon = false;
      }
      const reader = new FileReader();
      let workbook: any;
      reader.onload = () => {
        const data = reader.result;
        this.multipleCSVFile = [];
        workbook = XLSX.read(data, { type: "binary" });
        if (this.currentUrl === "/") {
          const validSheets = Array.from(
            new Set(
              workbook.SheetNames.filter((sheetName: string) =>
                this.allCountryCode.includes(sheetName)
              )
            )
          );
          this.invalidSheetName = workbook.SheetNames.filter(
            (sheetName: string) => !this.allCountryCode.includes(sheetName)
          );
          if (validSheets.length === 0) {
            this.errorMessage = ERROR.NO_VALID_SHEETS;
            const message: NotificationMessage = {
              message: this.errorMessage,
              type: NotificationType.warning,
            };
            this.toastrService.toastr(message);
            return;
          }
          validSheets.forEach((sheetName: any) => {
            const sheet = workbook.Sheets[sheetName];
            const csvData = XLSX.utils.sheet_to_csv(sheet, {
              blankrows: false,
            });
            this.multipleCSVFile.push(csvData);
            this.sheetNames.push(sheetName);
          });
          if (this.sheetNames.length === 0) {
            this.errorMessage = ERROR.NO_VALID_SHEETS;
            return;
          }
        } else {
          workbook = XLSX.read(data, { type: "binary" });
          this.sheetName = workbook.SheetNames.find((item: string) =>
            item === CONSTANTS.GD_UPLOAD
              ? CONSTANTS.GD_UPLOAD
              : workbook.SheetNames[0]
          );
          const sheet = workbook.Sheets[this.sheetName];
          this.csvFile = XLSX.utils.sheet_to_csv(sheet, { blankrows: false });
        }
      };
      reader.readAsBinaryString(this.selectedFile);
    } else {
      return;
    }
    this.successMessage = "";
    this.errorMessage = "";
  };

  uploadFile = () => {
    this.loading.next(true);
    try {
      if (!this.isScenarioTextValid()) {
        return this.loading.next(false);
      }
      if (this.currentUrl === "/") {
        if (this.hasDuplicateDatesInMultipleFiles(this.multipleCSVFile)) {
          return this.loading.next(false);
        }
        if (this.multipleCSVFile.length > 0 && !this.isSheetNameValid()) {
          return this.loading.next(false);
        }
        this.uploadMultipleSheets();
      } else if (this.csvFile) {
        if (this.hasDuplicateDates(this.csvFile)) {
          return this.loading.next(false);
        }
        this.uploadSingleSheet();
      } else if (this.pastedCSV) {
        this.validatePasteData();
      }
    } catch (error) {
      this.handleUploadError();
    }
  };

  isScenarioTextValid = () => {
    if (!/^\w+$/.test(this.scenarioText)) {
      this.errorMessage = ERROR.SCENARIO_VALIDATION;
      return false;
    }
    return true;
  };

  hasDuplicateDatesInMultipleFiles = (csvFiles: any) => {
    return csvFiles.some((csvData: string) => this.hasDuplicateDates(csvData));
  };

  isSheetNameValid = () => {
    if (this.invalidSheetName.length > 0) {
      this.errorMessage = ERROR.IGNORED_SHEETS(this.invalidSheetName);
      const message: NotificationMessage = {
        message: this.errorMessage,
        type: NotificationType.warning,
      };
      this.toastrService.toastr(message);
      this.inputValidationStatus();
    }
    return true;
  };

  uploadMultipleSheets = () => {
    this.fileCounter = this.multipleCSVFile.length;
    this.multipleCSVFile.forEach((csvData, index) => {
      this.countryCode = this.sheetNames[index];
      this.uploadForecastData(csvData, this.countryCode);
    });
  };

  uploadSingleSheet = () => {
    const sheetName = this.sheetNames[0];
    this.uploadForecastData(this.csvFile, sheetName);
  };

  handleUploadError = () => {
    this.errorMessage = ERROR.UNKNOW_ERROR;
    const message: NotificationMessage = {
      message: this.errorMessage,
      type: NotificationType.error,
    };
    this.toastrService.toastr(message);
    this.fileCounter--;
    if (this.fileCounter === 0) {
      this.loading.next(false);
    }
  };

  handleError = (err: any, country: string) => {
    if (err.status == 502) {
      this.errorMessage = ERROR.STATUS_ERROR(ERROR.ERROR_502, country);
      const message: NotificationMessage = {
        message: `${this.errorMessage} for ${country}`,
        type: NotificationType.error,
      };
      this.toastrService.toastr(message);
    } else if (err.status == 408) {
      this.errorMessage = ERROR.STATUS_ERROR(ERROR.ERROR_408, country);
      const message: NotificationMessage = {
        message: `${this.errorMessage} for ${country}`,
        type: NotificationType.error,
      };
      this.toastrService.toastr(message);
    } else if (err.status == 401) {
      this.errorMessage = ERROR.STATUS_ERROR(ERROR.ERROR_401, country);
      const message: NotificationMessage = {
        message: `${this.errorMessage} for ${country}`,
        type: NotificationType.error,
      };
      this.toastrService.toastr(message);
    } else {
      this.errorMessage = ERROR.CUSTOM_ERROR(err, country);
      const message: NotificationMessage = {
        message: `${this.errorMessage} for ${country}`,
        type: NotificationType.error,
      };
      this.toastrService.toastr(message);
    }
    this.loading.next(false);
    this.resetInputField();
  };

  uploadForecastData = (uploadData: string, sheetName: string) => {
    const listCountries = this.listofCountries.getListofCountries();
    let country: string;
    listCountries[1].subscribe((res: NavbarResponse[]) => {
      const matchingCountry = res.find((code) => code.name === sheetName);
      country = matchingCountry
        ? matchingCountry.displayname
        : CONSTANTS.SELECTED_COUNTRY;
    });
    this.loading.next(true);
    this.fileCounter++;
    if (!this.scenarioText.trim()) {
      this.scenarioText = CONSTANTS.DEFAULT;
    }
    this.uploadForecast
      .uploadForecast(
        FORECAST[this.forecastPeriod],
        this.countryCode,
        uploadData,
        this.scenarioText
      )
      .subscribe({
        next: (res) => {
          if (res) {
            this.loading.next(false);
            this.successMessage = CONSTANTS.SUCCESS_RES(res, country);
            const message: NotificationMessage = {
              message: this.successMessage,
              type: NotificationType.success,
            };
            this.toastrService.toastr(message);
          }
          this.resetInputField();
        },
        error: (err) => {
          this.handleError(err, country);
        },
      });
  };

  changeView = () => {
    this.fileSheetselection = false;
  };

  jumpToPasteDialog = () => {
    this.fileSheetselection = false;
  };

  arrayToCSV = (objArray: any) => {
    let array: any =
      typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    let str = "";
    let row = "";
    for (let index in objArray[0]) {
      row += index + ",";
    }
    row = row.slice(0, -1);
    str += row + "\r\n";
    for (let individualData of array) {
      let line = "";
      for (let index in individualData) {
        if (line != "") line += ",";
        line += individualData[index];
      }
      str += line + "\r\n";
    }
    return str;
  };

  closeDialog = () => {
    this.dialogRef.close();
  };

  onSelectedScenario = (value: any) => {
    if (value?.trim().length > 3 && value?.trim().length < 21) {
      this.scenarioText = value;
      this.inputValidationStatus();
    }
  };

  inputValidationStatus = () => {
    this.selectedFile = "";
    this.forecastFile = "";
    this.successMessage = "";
    this.errorMessage = "";
    this.loading.next(false);
    this.sharedService.setDropDownChange("");
    this.resetInputField();
    this.uploadExcelText = CONSTANTS.UPLOAD_EXCEL(this.forecastPeriod);
    this.uploadPasteText = CONSTANTS.UPLOAD_PASTE(this.forecastPeriod);
  };

  validatePasteData = () => {
    this.subscriptionManager.add(
      this.sharedService.getRowHeader().subscribe((headers: any) => {
        const pastedHeadersKeys = Object.keys(this.pastedCSV[0]).map(
          (item: any) => item.toLowerCase().replace("\r", "")
        );
        const headersData: string[] = ["date"];
        headers.forEach((item: any) => {
          headersData.push(item.id.toLowerCase());
        });
        const invalidHeaders = pastedHeadersKeys.filter(
          (item: string) => !headersData.includes(item)
        );
        if (invalidHeaders.length === 0) {
          this.uploadForecastData(
            this.arrayToCSV(this.pastedCSV),
            this.countryCode
          );
        } else {
          this.errorMessage = ERROR.HEADERS_MISMATCH(this.displayCountyName);
        }
      })
    );
  };

  listOfScenarios = () => {
    this.sharedService.getCountryScenarioModes().subscribe((countryScenarioModes: string[]) => {
      if (countryScenarioModes) {
        this.scenarioNames = countryScenarioModes;
      }
    });
  };
}
