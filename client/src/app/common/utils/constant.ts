export const CONSTANTS = {
  UPPERCASE_DATE: "DATE",
  CAMELCASE_DATE: "Date",
  COLUMN_NAME: "Col_name",
  DATA_LOADING: '<span class="data-loading">Data is still loading...</span>',
  HOMEPAGE_URL: "/",
  LOADING_GIF: '<img src="https://www.ag-grid.com/example-assets/loading.gif">',
  CHOOSE_ANOTHER_FILE: "Choose another file",
  GD_UPLOAD: "gd-upload",
  UPLOAD_DATA: "Upload Excel Short Term sheet",
  UPLOAD_PASTE_DATA: "Upload your Short Term data",
  FORMAT_DATE: "YYYY-MM-DD",
  FORMAT_DATE_DD: "YYYY-MM-dd",
  BALANCING: "balancing",
  PRIMARY_COLOR: "primary_color",
  CUSTOM_OVERLAY: "customNoRowsOverlay",
  GASDATA: "Gasdata",
  CORRECT_DATE_RANGE:
    "'To' date can not be earlier than 'from' date, please select correct date range",
  DOWNLOAD_SUCCEESSFULL:
    "Downloaded successfully! select date range to download another file",
  DEV: "Development",
  UAT: "UAT",
  PROD: "Production",
  HISTORY_DATA: "History_Data",
  FORECAST_DATA: "Forecast_Data",
  DEFAULT: "default",
  FORECAST_TEMPLATE_FILENAME: "forecast-template.xlsx",
  SELECTED_COUNTRY: "selected country",
  UPLOAD_EXCEL: (forecastPeriod: string) =>
    `Upload Excel ${forecastPeriod} sheet`,
  UPLOAD_PASTE: (forecastPeriod: string) =>
    `Upload your ${forecastPeriod} data`,
  SUCCESS_RES: (res: string, country: string) =>
    `${res.replace(".", "")} for ${country}`,
};

export const GRANULARITY_OPTIONS: string[] = [
  "daily",
  "weekly",
  "monthly",
  "quarterly",
  "yearly",
  "seasonally",
];

export const FORECAST: any = {
  "Short Term": "short_term",
  "Mid Term": "mid_term",
  "Long Term": "longterm",
};

export const REMOVED_ITEMS: string[] = [
  "balancefull",
  "modelledbalancefull",
  "modelled_storage_total",
  "modelled_storage",
  "mktbalance",
  "modelled_storage_full",
  "balance_storage_full",
  "stor_storage_balance",
];

export const COUNTRY_ICONS = {
  nwe_overview:
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 810 540"><defs><g id="d"><g id="b"><path id="a" d="M0 0v1h.5z" transform="rotate(18 3.157 -.5)"/><use xlink:href="#a" transform="scale(-1 1)"/></g><g id="c"><use xlink:href="#b" transform="rotate(72)"/><use xlink:href="#b" transform="rotate(144)"/></g><use xlink:href="#c" transform="scale(-1 1)"/></g></defs><path fill="#039" d="M0 0h810v540H0z"/><g fill="#fc0" transform="matrix(30 0 0 30 405 270)"><use xlink:href="#d" y="-6"/><use xlink:href="#d" y="6"/><g id="e"><use xlink:href="#d" x="-6"/><use xlink:href="#d" transform="rotate(-144 -2.344 -2.11)"/><use xlink:href="#d" transform="rotate(144 -2.11 -2.344)"/><use xlink:href="#d" transform="rotate(72 -4.663 -2.076)"/><use xlink:href="#d" transform="rotate(72 -5.076 .534)"/></g><use xlink:href="#e" transform="scale(-1 1)"/></g></svg>',
  nl: '<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 43.06 29.96"><g fill-rule="nonzero"><path fill="#21468B" d="M43.06 20v7.59c0 1.3-1.06 2.37-2.37 2.37H2.37C1.06 29.96 0 28.89 0 27.59V20h43.06z"/><path fill="#fff" d="M43.06 20H0V2.37C0 1.06 1.06 0 2.37 0h38.32c1.31 0 2.37 1.06 2.37 2.37V20z"/><path fill="#AE1C28" d="M43.06 9.96H0V2.37C0 1.06 1.06 0 2.37 0h38.32c1.31 0 2.37 1.06 2.37 2.37v7.59z"/></g></svg>',
  de: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 55.2 38.4"><g fill-rule="evenodd" clip-rule="evenodd"><path d="M3.03 0h49.13c1.67 0 3.03 1.36 3.03 3.03v32.33c0 1.66-1.36 3.02-3.02 3.03H3.02C1.36 38.4 0 37.03 0 35.37V3.03C0 1.36 1.36 0 3.03 0z"/><path d="M0 12.8h55.2v22.57c0 1.67-1.36 3.03-3.03 3.03H3.03C1.36 38.4 0 37.04 0 35.37V12.8z" fill="#d00"/><path d="M0 25.6h55.2v9.77c0 1.66-1.36 3.02-3.02 3.03H3.03A3.04 3.04 0 010 35.37V25.6z" fill="#ffce00"/></g></svg>',
  fr: '<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 356.18"><path fill="#E1000F" d="M345.04 0h139C499.44.1 512 12.72 512 28.13v299.91c0 15.47-12.65 28.13-28.13 28.14H345.04V0zM15.11 352.95zm-9.54-8.15z"/><path fill="#fff" d="M27.96 0h317.08v356.18H27.98C12.57 356.09 0 343.46 0 328.04V28.14C0 12.72 12.56.1 27.96 0z"/><path fill="#273375" d="M27.96 0h138.99v356.18H28c-15.42-.08-28-12.71-28-28.14V28.14C0 12.72 12.56.1 27.96 0z"/></svg>',
  be: '<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 203.55 141.6"><g fill-rule="nonzero"><path fill="#ED2939" d="M203.55 11.19v119.22c0 6.16-5.04 11.19-11.19 11.19H11.19C5.05 141.6.02 136.59 0 130.45V11.15C.02 5.01 5.05 0 11.19 0h181.17c6.15 0 11.19 5.03 11.19 11.19z"/><path fill="#FAE042" d="M135.7 0v141.6H11.19C5.05 141.6.02 136.59 0 130.45V11.15C.02 5.01 5.05 0 11.19 0H135.7z"/><path d="M67.85 0v141.6H11.19C5.05 141.6.02 136.59 0 130.45V11.15C.02 5.01 5.05 0 11.19 0h56.66z"/></g></svg>',
  gb: '<?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 55.2 38.4" style="enable-background:new 0 0 55.2 38.4" xml:space="preserve"><style type="text/css">.st0{fill:#FEFEFE;} .st1{fill:#C8102E;} .st2{fill:#012169;}</style><g><path class="st0" d="M2.87,38.4h49.46c1.59-0.09,2.87-1.42,2.87-3.03V3.03c0-1.66-1.35-3.02-3.01-3.03H3.01 C1.35,0.01,0,1.37,0,3.03v32.33C0,36.98,1.28,38.31,2.87,38.4L2.87,38.4z"/><polygon class="st1" points="23.74,23.03 23.74,38.4 31.42,38.4 31.42,23.03 55.2,23.03 55.2,15.35 31.42,15.35 31.42,0 23.74,0 23.74,15.35 0,15.35 0,23.03 23.74,23.03"/><path class="st2" d="M33.98,12.43V0h18.23c1.26,0.02,2.34,0.81,2.78,1.92L33.98,12.43L33.98,12.43z"/><path class="st2" d="M33.98,25.97V38.4h18.35c1.21-0.07,2.23-0.85,2.66-1.92L33.98,25.97L33.98,25.97z"/><path class="st2" d="M21.18,25.97V38.4H2.87c-1.21-0.07-2.24-0.85-2.66-1.94L21.18,25.97L21.18,25.97z"/><path class="st2" d="M21.18,12.43V0H2.99C1.73,0.02,0.64,0.82,0.21,1.94L21.18,12.43L21.18,12.43z"/><polygon class="st2" points="0,12.8 7.65,12.8 0,8.97 0,12.8"/><polygon class="st2" points="55.2,12.8 47.51,12.8 55.2,8.95 55.2,12.8"/><polygon class="st2" points="55.2,25.6 47.51,25.6 55.2,29.45 55.2,25.6"/><polygon class="st2" points="0,25.6 7.65,25.6 0,29.43 0,25.6"/><polygon class="st1" points="55.2,3.25 36.15,12.8 40.41,12.8 55.2,5.4 55.2,3.25"/><polygon class="st1" points="19.01,25.6 14.75,25.6 0,32.98 0,35.13 19.05,25.6 19.01,25.6"/><polygon class="st1" points="10.52,12.81 14.78,12.81 0,5.41 0,7.55 10.52,12.81"/><polygon class="st1" points="44.63,25.59 40.37,25.59 55.2,33.02 55.2,30.88 44.63,25.59"/></g></svg>',
  at: '<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 39.06 27.17"><g fill-rule="nonzero"><path fill="#ED2939" d="M2.15 0h34.76c1.18 0 2.15.97 2.15 2.15v6.82H0V2.15C0 .97.97 0 2.15 0zm36.91 18.2v6.82c0 1.18-.97 2.15-2.15 2.15H2.15A2.16 2.16 0 0 1 0 25.02V18.2h39.06z"/><path fill="#fff" d="M0 8.97h39.06v9.23H0z"/></g></svg>',
  it: '<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 90.77 63.15"><g fill-rule="nonzero"><path fill="#009246" d="M29.47 0v63.15H4.99C2.24 63.15 0 60.9 0 58.16V4.99C0 2.24 2.24 0 4.99 0h24.48z"/><path fill="#fff" d="M61.31 0v63.15H29.47V0z"/><path fill="#CE2B37" d="M61.31 63.15V0h24.48c2.74 0 4.98 2.24 4.98 4.99v53.17c0 2.74-2.24 4.99-4.98 4.99H61.31z"/></g></svg>',
  cz: '<svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 51.28 35.67"><g fill-rule="nonzero"><path fill="#D7141A" d="M51.28 17.84v15.01a2.83 2.83 0 0 1-2.82 2.82H2.82A2.83 2.83 0 0 1 0 32.85V17.84h51.28z"/><path fill="#fff" d="M51.28 17.84H0V2.82A2.83 2.83 0 0 1 2.82 0h45.64a2.83 2.83 0 0 1 2.82 2.82v15.02z"/><path fill="#11457E" d="M25.64 17.84.57 1.12C.21 1.6 0 2.18 0 2.82v30.03c0 .64.21 1.23.57 1.7l25.07-16.71z"/></g></svg>',
  sk: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6"><path fill="#ee1c25" d="M0 0h9v6H0z"/><path fill="#0b4ea2" d="M0 0h9v4H0z"/><path fill="#fff" d="M0 0h9v2H0z"/><path fill="#fff" d="M3.163 4.635c-.538-.259-1.308-.773-1.308-1.79s.05-1.48.05-1.48H4.42s.049.463.049 1.48-.77 1.53-1.307 1.79z"/><path fill="#ee1c25" d="M3.163 4.5c-.494-.238-1.2-.71-1.2-1.643S2.008 1.5 2.008 1.5h2.309s.045.424.045 1.357c0 .934-.706 1.405-1.2 1.643z"/><path fill="#fff" d="M3.268 2.613c.134.002.394.007.626-.07 0 0-.006.083-.006.18 0 .096.006.18.006.18-.212-.072-.475-.074-.626-.072v.516h-.211V2.83c-.15-.002-.413 0-.626.071 0 0 .006-.083.006-.18 0-.096-.006-.18-.006-.18.232.078.492.073.626.07V2.29a1.481 1.481 0 00-.496.071s.007-.083.007-.18c0-.096-.007-.18-.007-.18.199.067.374.073.496.072-.007-.205-.066-.464-.066-.464s.122.01.172.01c.049 0 .172-.01.172-.01s-.06.259-.066.464A1.48 1.48 0 003.764 2s-.006.083-.006.18c0 .096.006.18.006.18a1.481 1.481 0 00-.496-.072v.324z"/><path fill="#0b4ea2" d="M3.163 3.29c-.249 0-.382.346-.382.346s-.074-.164-.277-.164c-.137 0-.238.122-.302.235.25.397.648.642.96.793.313-.15.712-.396.961-.793-.064-.113-.165-.235-.302-.235-.203 0-.277.164-.277.164s-.133-.345-.382-.345z"/></svg>',
};

export const ERROR = {
  ERROR_502: "Internal server error, please try after some time",
  ERROR_408: "Connection timed out, please refresh the page",
  ERROR_401: "Authentication failed, please refresh the page & login again",
  NO_DATA: '<span class="no-data">No data available</span>',
  MISSING_DATA: "Some data is/are missing, Please check",
  UNKNOW_ERROR: "An error occurred during file upload, please try again!",
  INVALID_CSV: "Error: Please upload a valid CSV file",
  SCENARIO_VALIDATION:
    "Only alphabets, Numbers, _ are allowed in scenario name",
  HEADERS_MISMATCH: (country: string) =>
    `Uploaded Columns Are Not Matching For Country: ${country}`,
  DATE_MISSING: "Date column is missing in the uploaded file.",
  EMPTY_FILE: "The uploaded file is empty or invalid.",
  DUPLICATE_DATE: (dateValue: string) =>
    `Duplicate date found: ${dateValue}, please remove it & try again!`,
  INVALID_SHEET: (invalidSheets: string[]) =>
    `Please check the sheet names: ${invalidSheets.join(
      ", "
    )} is/are incorrect`,
  NO_VALID_SHEETS: "No vaild sheet found in the excel",
  IGNORED_SHEETS: (invalidSheet: string[]) =>
    `The extra sheet(s) ${invalidSheet.join(
      ", "
    )} were ignored while uploading the rest of the worksheets!`,

  STATUS_ERROR: (status: string, country: string) => `${status} for ${country}`,
  CUSTOM_ERROR: (err: { error: string }, country: string) =>
    `${err.error.replace(".", "")} for ${country}`,
};
