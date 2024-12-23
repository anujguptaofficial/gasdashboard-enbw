import { scenarioData, scenarioLoaded, scenarioLoading, ScenarioReducer, tableColHeader, tableHeaderLoaded, TableheaderReducer, tableLoading } from "./main-state-reducer";

describe('TableheaderReducer', () => {
    it('should have initial state initial', () => {
        const expected = {
            loaded: false,
            loading: false,
            colHeader: []
        };
        const action = { type: 'test' } as any;
        expect(TableheaderReducer(undefined, action)).toEqual(expected);
    });

    it('should have initial state of col header request', () => {
        const state = {
            loaded: false,
            loading: true,
            colHeader: []
        };
        const action = { type: 'col header request' } as any;
        expect(TableheaderReducer(state, action)).toEqual(state);
    });

    it('should have initial state of col header success', () => {
        const expected = {
            loaded: true,
            loading: false,
            colHeader: [{ "test": "testData" }]
        };
        const state = {
            loaded: true,
            loading: false,
            colHeader: []
        };
        const action = { type: 'col header success', payload: { data: [{ "test": "testData" }] } } as any;
        expect(TableheaderReducer(state, action)).toEqual(expected);
    });

    it('should load tableLoading', () => {
        const state = {
            loaded: false,
            loading: true,
            colHeader: []
        };
        expect(tableLoading(state)).toBeTruthy();
    })

    it('should load tableHeaderLoaded', () => {
        const state = {
            loaded: true,
            loading: false,
            colHeader: []
        };
        expect(tableHeaderLoaded(state)).toBeTruthy();
    })

    it('should load tableColHeader', () => {
        const state = {
            loaded: false,
            loading: false,
            colHeader: []
        };
        expect(tableColHeader(state)).toBeTruthy();
    })

    it('should have initial scenario state initial', () => {
        const expected = {
            loaded: false,
            loading: false,
            scenario: null
        };
        const action = { type: 'test' } as any;
        expect(ScenarioReducer(undefined, action)).toEqual(expected);
    });

    it('should have initial state of scenario request', () => {
        const state = {
            loaded: false,
            loading: true,
            scenario: null
        };
        const action = { type: 'scenario request' } as any;
        expect(ScenarioReducer(state, action)).toEqual(state);
    });

    it('should have initial state of scenario success', () => {
        const expected = {
            loaded: true,
            loading: false,
            scenario: [{ "test": "testData" }]
        };
        const state = {
            loaded: true,
            loading: false,
            scenario: null
        };
        const action = { type: 'scenario success', payload: { data: [{ "test": "testData" }] } } as any;
        expect(ScenarioReducer(state, action)).toEqual(expected);
    });

    it('should load scenarioLoading', () => {
        const state = {
            loaded: false,
            loading: true,
            scenario: null
        };
        expect(scenarioLoading(state)).toBeTruthy();
    })

    it('should load scenarioLoaded', () => {
        const state = {
            loaded: true,
            loading: false,
            scenario: null
        };
        expect(scenarioLoaded(state)).toBeTruthy();
    })

    it('should load scenarioData', () => {
        const state = {
            loaded: false,
            loading: false,
            scenario: null
        };
        expect(scenarioData(state)).toBeNull();
    })
});
