import { Action } from "../actions/root-action";
import {
  COL_HEADER_REQUEST,
  COL_HEADER_SUCCESS,
  SCENARIO_REQUEST,
  SCENARIO_SUCCESS,
  SET_SCENARIO_DATE,
  SET_GRANULARITY
} from "../actions/main-action";
import { NavbarResponse } from "../../interfaces/table.interface";
import { ScenarioDetail } from "../../interfaces/header.interface";

export interface TableheaderReducerState {
  loading: boolean;
  loaded: boolean;
  colHeader: NavbarResponse[];
}

const initialState: TableheaderReducerState = {
  loaded: false,
  loading: false,
  colHeader: [],
};

export interface ScenarioReducerState {
  loading: boolean;
  loaded: boolean;
  scenario: ScenarioDetail | null;
}

export interface ScenarioDateReducerState {
  date: string | null;
}

export interface ScenarioGranularityReducerState {
  gran: string | null;
}

const initialScenarioState: ScenarioReducerState = {
    loaded: false,
    loading: false,
    scenario: null,
};

const initialScenarioDateState: ScenarioDateReducerState = {
  date: null,
};

const initialGranularityState: ScenarioGranularityReducerState = {
  gran: "monthly",
};

export function TableheaderReducer(
  state = initialState,
  action: Action
): TableheaderReducerState {
  switch (action.type) {
    case COL_HEADER_REQUEST: {
      return { ...state, loading: true };
    }
    case COL_HEADER_SUCCESS: {
      const updatedColHeader = state.colHeader.concat(action.payload.data);
      return {
        ...state,
        loading: false,
        loaded: true,
        colHeader: updatedColHeader,
      };
    }
    default: {
      return state;
    }
  }
}


export function ScenarioReducer(
  state = initialScenarioState,
  action: Action
): ScenarioReducerState {
  switch (action.type) {
    case SCENARIO_REQUEST: {
      return { ...state, loading: true };
    }
    case SCENARIO_SUCCESS: {
      return {
        ...state,
        loading: false,
        loaded: true,
        scenario: action.payload.data,
      };
    }
    default: {
      return state;
    }
  }
}

export function ScenarioDateReducer(
  state = initialScenarioDateState,
  action: Action
): ScenarioDateReducerState {
  switch (action.type) {
    case SET_SCENARIO_DATE: {
      return { ...state, date: action.payload.date };
    }
    default: {
      return state;
    }
  }
}

export function GranularityReducer(
  state = initialGranularityState,
  action: Action
): ScenarioGranularityReducerState {
  switch (action.type) {
    case SET_GRANULARITY: {
      return { ...state, gran: action.payload.gran };
    }
    default: {
      return state;
    }
  }
}

export const tableLoading = (state: TableheaderReducerState) => state.loading;
export const tableHeaderLoaded = (state: TableheaderReducerState) =>
  state.loaded;
export const tableColHeader = (state: TableheaderReducerState) =>
  state.colHeader;
export const scenarioLoading = (state: ScenarioReducerState) => state.loading;
export const scenarioLoaded = (state: ScenarioReducerState) => state.loaded;
export const scenarioData = (state: ScenarioReducerState) => state.scenario;
export const getScenarioDate = (state: ScenarioDateReducerState) => state.date;
export const getGranularity = (state: ScenarioGranularityReducerState) => state.gran