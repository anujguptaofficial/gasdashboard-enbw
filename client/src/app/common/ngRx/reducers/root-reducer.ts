import { ActionReducerMap, createSelector } from "@ngrx/store";

import * as fromtableheader from "./main-state-reducer";
import { Action } from "../actions/root-action";

export interface RootReducerState {
  TableHeader: fromtableheader.TableheaderReducerState;
  Scenario: fromtableheader.ScenarioReducerState;
  ScenarioDate: fromtableheader.ScenarioDateReducerState;
  Granularity: fromtableheader.ScenarioGranularityReducerState;
}

export const rootReducer: ActionReducerMap<RootReducerState, Action> = {
  TableHeader: fromtableheader.TableheaderReducer,
  Scenario: fromtableheader.ScenarioReducer,
  ScenarioDate: fromtableheader.ScenarioDateReducer,
  Granularity: fromtableheader.GranularityReducer
};

export const getTableHeaderState = (state: RootReducerState) =>
  state.TableHeader;

export const getTableHeaderLoaded = createSelector(
  getTableHeaderState,
  fromtableheader.tableHeaderLoaded
);
export const getTableHeaderLoading = createSelector(
  getTableHeaderState,
  fromtableheader.tableLoading
);
export const getTableHeader = createSelector(
  getTableHeaderState,
  fromtableheader.tableColHeader
);

export const getScenarioState = (state: RootReducerState) =>
  state.Scenario;

export const getScenarioDateState = (state: RootReducerState) => state.ScenarioDate;

export const getGranularityState = (state: RootReducerState) => state.Granularity;

export const getScenarioLoaded = createSelector(
  getScenarioState,
  fromtableheader.scenarioLoaded
);

export const getScenarioLoading = createSelector(
  getScenarioState,
  fromtableheader.scenarioLoading
);

export const getScenario = createSelector(
  getScenarioState,
  fromtableheader.scenarioData
)

export const getSelectedScenarioDate = createSelector(
  getScenarioDateState,
  fromtableheader.getScenarioDate
);

export const getSelectedGranularity = createSelector(
  getGranularityState,
  fromtableheader.getGranularity
);