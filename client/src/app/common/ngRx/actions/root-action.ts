import { ScenarioDetail } from "../../interfaces/header.interface";
import { NavbarResponse } from "../../interfaces/table.interface";
import { COL_HEADER_REQUEST, COL_HEADER_SUCCESS, SCENARIO_REQUEST, SCENARIO_SUCCESS, SET_GRANULARITY, SET_SCENARIO_DATE } from "./main-action";

export type TableHeaderActions =
  | { type: typeof COL_HEADER_REQUEST }
  | { type: typeof COL_HEADER_SUCCESS; payload: { data: NavbarResponse[] } };

export type ScenarioActions =
  | { type: typeof SCENARIO_REQUEST }
  | { type: typeof SCENARIO_SUCCESS; payload: { data: ScenarioDetail } };

export type ScenarioDateActions =
  | { type: typeof SET_SCENARIO_DATE; payload: { date: string | null } };

export type GranularityActions = 
  | { type: typeof SET_GRANULARITY; payload: { gran: string | "monthly"  } }

export type Action = TableHeaderActions | ScenarioActions | ScenarioDateActions | GranularityActions;