import { NavbarResponse } from "../../interfaces/table.interface";
import { ScenarioDetail } from "../../interfaces/header.interface";

export const COL_HEADER_REQUEST = "col header request";
export const COL_HEADER_SUCCESS = "col header success";
export const COL_HEADER_FAILED = "col header failed";
export const SCENARIO_REQUEST = "scenario request";
export const SCENARIO_SUCCESS = "scenario success";
export const SCENARIO_FAILED = "scenario failed";
export const SET_SCENARIO_DATE = "set scenario date";
export const SET_GRANULARITY = "set granularity"

export class TableheaderRequestAction {
  readonly type = COL_HEADER_REQUEST;
}

export class TableheaderSuccessAction {
  readonly type = COL_HEADER_SUCCESS;

  constructor(public payload?: { data: NavbarResponse[] }) {}
}

export class ScenarioRequestAction {
  readonly type = SCENARIO_REQUEST;
}

export class ScenarioSuccessAction {
  readonly type = SCENARIO_SUCCESS;

  constructor(public payload?: { data: ScenarioDetail }) {}
}

export class SetScenarioDateAction {
  readonly type = SET_SCENARIO_DATE;

  constructor(public payload: { date: string | null }) {}
}

export class SetGranularityAction {
  readonly type = SET_GRANULARITY;

  constructor(public payload: { gran: string | null }) {}
}