import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { combineLatest, Observable } from "rxjs";

import { ApiService } from "../api-service/api.service";
import {
  getTableHeader,
  getTableHeaderLoaded,
  getTableHeaderLoading,
  getScenario,
  getScenarioLoaded,
  getScenarioLoading,
  RootReducerState,
  getSelectedScenarioDate,
  getSelectedGranularity,
} from "../../common/ngRx/reducers/root-reducer";
import {
  ScenarioRequestAction,
  ScenarioSuccessAction,
  SetGranularityAction,
  SetScenarioDateAction,
  TableheaderRequestAction,
  TableheaderSuccessAction,
} from "../../common/ngRx/actions/main-action";
import { NavbarResponse } from "../../common/interfaces/table.interface";
import { ScenarioDetail } from "../../common/interfaces/header.interface";

@Injectable({
  providedIn: "root",
})
export class StoreService {
  constructor(
    private readonly apiService: ApiService,
    private readonly store: Store<RootReducerState>
  ) {}

  setScenarioDate = (date: string | null): void => {
    this.store.dispatch(new SetScenarioDateAction({ date }));
  }

  getScenarioDate = (): Observable<string | null> => {
    return this.store.select(getSelectedScenarioDate);
  }

  setGranularity = (gran: string | null): void => {
    this.store.dispatch(new SetGranularityAction({ gran }));
  }

  getGranularity = (): Observable<string | null> => {
    return this.store.select(getSelectedGranularity);
  }

  getListofCountries = (
    force = false
  ): [Observable<boolean>, Observable<NavbarResponse[]>] => {
    const loading$ = this.store.select(getTableHeaderLoading);
    const loaded$ = this.store.select(getTableHeaderLoaded);
    const tableHeader = this.store.select(getTableHeader);
    combineLatest([loaded$, loading$]).subscribe((data) => {
      if (data) {
        if ((!data[0] && !data[1]) || force) {
          this.store.dispatch(new TableheaderRequestAction());
          this.apiService
            .getCountryList()
            .subscribe((res: NavbarResponse[]) => {
              if (res) {
                this.store.dispatch(
                  new TableheaderSuccessAction({ data: res })
                );
              }
            });
        }
      }
    });
    return [loaded$, tableHeader];
  };
  
  getListOfScenarios = (
    force = false
  ): [Observable<boolean>, Observable<ScenarioDetail | null>] => {
    const loading$ = this.store.select(getScenarioLoading);
    const loaded$ = this.store.select(getScenarioLoaded);
    const scenario = this.store.select(getScenario);
    combineLatest([loaded$, loading$]).subscribe((data) => {
      if (data) {
        if ((!data[0] && !data[1]) || force) {
          this.store.dispatch(new ScenarioRequestAction());
          this.apiService
            .getScenarioList()
            .subscribe((res: ScenarioDetail) => {
              if (res) {
                this.store.dispatch(
                  new ScenarioSuccessAction({ data: res })
                );
              }
            });
        }
      }
    });
    return [loaded$, scenario];
  };
}
