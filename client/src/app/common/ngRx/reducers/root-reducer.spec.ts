import { getScenarioState, getTableHeaderState, RootReducerState } from "./root-reducer";

describe('getTableHeaderState', () => {
  it('should return the getTableHeader and getScenario states', () => {
    const state: RootReducerState = {
      TableHeader: {
        loaded: false,
        loading: false,
        colHeader: [],
      },
      Scenario: {
        loaded: false,
        loading: false,
        scenario: null,
          }
    };

    expect(getTableHeaderState(state)).toEqual({
        loaded: false,
        loading: false,
        colHeader: [],
    });
    
    expect(getScenarioState(state)).toEqual({
        loaded: false,
        loading: false,
        scenario: null,
    });
  });
});
