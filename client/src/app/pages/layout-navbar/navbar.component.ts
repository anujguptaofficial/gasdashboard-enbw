import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { Subject, Subscription, debounceTime } from "rxjs";
import { FormControl } from "@angular/forms";
import * as moment from 'moment';

import { HighchartTablesComponent } from "../../common/modals/highchart-tables/highchart-tables.component";
import { CONSTANTS, GRANULARITY_OPTIONS } from "../../common/utils/constant";
import { NavbarResponse } from "../../common/interfaces/table.interface";
import { ScenarioDetail } from "../../common/interfaces/header.interface";
import { StoreService } from "../../services/api-store-service/store.service";
import { UploadExcelComponent } from "../../common/modals/upload-excel/upload-excel.component";
import { SharedService } from "../../services/shared-service/shared.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class Navbar implements OnInit, OnDestroy {
  scenario = new Subject<string>();
  private readonly debounceTimeMs = 1000;
  @Input() countryCode: string;
  @Input() refreshStart: boolean = false;
  @Input() disableGraphData: boolean;

  public params: any;
  selectedOption: string | null;
  granularityOptions: string[];
  displayCountryName: string;
  disableForecast: boolean;
  subscriptionManager: Subscription;
  selectedToggle: boolean;
  scenarioNames: string[];
  scenarioDetails: string[];
  defaultScenario: string;
  scenarioUpdate: string;
  displayScenario: boolean = false;
  latestScenario: string = "";
  formControl = new FormControl();
  scenarioDateObj: Date;
  displayDate: Date;
  scenarioDate: string | null = null;


  constructor(
    private readonly activeRoute: ActivatedRoute,
    public dialog: MatDialog,
    public router: Router,
    public storeService: StoreService,
    private readonly sharedService: SharedService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.subscriptionManager = new Subscription();
    this.granularityOptions = GRANULARITY_OPTIONS;
    this.scenarioStorage();
  }

  agInit(params: any): void {
    if (params) {
      this.params = params;
    }
  }

  ngOnInit(): void {
    this.storeService.getGranularity().subscribe((data) => {
      this.selectedOption = data
    })
    this.scenarioUpdate = localStorage.getItem('Scenario Name') ?? CONSTANTS.DEFAULT;
    this.getSavedScenarioDate()
    this.defaultScenario = this.scenarioUpdate;
    localStorage.setItem('Scenario Name', this.defaultScenario);
    this.activeRoute.params.subscribe((routeParams) => {
      if (routeParams) {
        this.getCountryName();
      }
    });
    this.getToggleStatus();
    this.settingSenerioNames();
  }

  ngOnDestroy(): void {
    this.subscriptionManager.unsubscribe();
  }

  onIconKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.refreshGrid();
    }
  };

  getSavedScenarioDate = () => {
    this.storeService.getScenarioDate().subscribe((date) => {
      this.scenarioDate = date;
    });
    if (this.scenarioDate) {
      const parsedDate = moment(this.scenarioDate, "YY-MM-DD").toDate();
      this.displayDate = parsedDate;
        this.filterScenarioNames(`gm-${this.scenarioDate}`)
    }
  }

  getToggleStatus = () => {
    this.sharedService.getToggleToPer().subscribe((toggle: boolean) => {
      if (toggle) {
        this.selectedToggle = toggle;
      }
    });
  }

  getScenarioDate = (event: { value: Date }) => {
    if (event.value) {
      this.scenarioDateObj = new Date(event.value);
      const formattedDate = moment(this.scenarioDateObj).format('YY-MM-DD');
      this.storeService.setScenarioDate(formattedDate);
      this.scenarioDate = `gm-${formattedDate}`;
      this.filterScenarioNames(this.scenarioDate);
    }
  };

  filterScenarioNames = (date: string) => {
    if (this.scenarioNames && date) {
      const filteredScenarios = this.scenarioNames.filter(
        (name) => name === this.scenarioDate
      );
      const updatedScenarios = ["default", ...filteredScenarios];
      this.scenarioNames = [];
      this.cdr.detectChanges();
      this.scenarioNames = updatedScenarios;
      this.cdr.detectChanges();
    }
  };

  getCountryName = () => {
    const countryName = this.storeService.getListofCountries();
    countryName[1].subscribe((res: NavbarResponse[]): void => {
      if (res.length > 0) {
        const countryData = res.find(item => item.name === this.countryCode);
        if (countryData) {
          this.displayCountryName = countryData.displayname;
          this.sharedService.setDisplayName(this.displayCountryName);
          this.disableForecast = countryData.forecastable;
          this.listOfScenarios();
        }
      }
    });
  };

  listOfScenarios = () => {
    const [_, scenarioList] = this.storeService.getListOfScenarios();
    scenarioList.subscribe((modes: ScenarioDetail | null) => {
      if (modes) {
        this.displayScenario = true;
        const scenarioModesForCountry: string[] = modes.scenario_modes[this.countryCode];
        this.scenarioNames = scenarioModesForCountry;
        this.scenarioNames = this.sortScenarioNamesWithCollator(this.scenarioNames);
        this.sharedService.setCountryScenarioModes(this.scenarioNames);
      }
    });
  };

  sortScenarioNamesWithCollator(scenarioNames: string[]): string[] {
    const collator = new Intl.Collator(['en', 'de'], { numeric: true });
    return scenarioNames.sort(collator.compare);
  }

  onSelectedGranularity = (event: any) => {
    if (event) {
      this.storeService.setGranularity(event)
    }
  };

  uploadFile = (): void => {
    this.dialog.open(UploadExcelComponent);
  };

  highChart = (): void => {
    this.dialog.open(HighchartTablesComponent);
  };

  refreshGrid = () => {
    this.listOfScenarios();
    this.sharedService.setRefreshGrid(true);
  };

  onChangeToggle = (event: boolean) => {
    this.sharedService.setToggleToPer(event);
  };

  onSelectedScenario = (event: string) => {
    const selectedInput = event.trim();
    this.scenario.next(selectedInput);  
  }

  settingSenerioNames = () => {
    this.formControl.valueChanges
      .pipe(debounceTime(3000))
      .subscribe((value) => {
        if (value && value.trim().length > 3 && value.trim().length < 21 && value.trim() !== CONSTANTS.DEFAULT) {
          localStorage.setItem('Scenario Name', value.trim());
        }
      });
  };

  scenarioStorage = () => {
    this.scenario.pipe(
      debounceTime(this.debounceTimeMs)
    ).subscribe(selectedInput => {
      this.scenarioUpdate = selectedInput ?? CONSTANTS.DEFAULT;
      this.sharedService.setScenario(this.scenarioUpdate);
      localStorage.setItem('Scenario Name', this.scenarioUpdate);
    });
  }
}
