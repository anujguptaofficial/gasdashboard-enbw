import { Component, OnInit, AfterViewInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { Chart } from "chart.js/auto";
import * as moment from "moment";

import { SharedService } from "../../../services/shared-service/shared.service";
import { HeaderColumn } from "../../interfaces/table.interface";

@Component({
  selector: "app-highchart-tables",
  templateUrl: "./highchart-tables.component.html",
  styleUrls: ["./highchart-tables.component.scss"],
})
export class HighchartTablesComponent implements OnInit, AfterViewInit {
  chart: any;
  forecastChart: any;
  rowDataRes: any;
  rowDataHeader: string[] = [];
  displayName: string;
  tableDate: string[] = [];
  forecastDate: string[] = [];
  forecastDataRes: any;

  constructor(
    public dialogRef: MatDialogRef<HighchartTablesComponent>,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.getDatafromService();
    this.createTableChart();
    this.createForecastChart();
  }

  ngAfterViewInit(): void {
    this.structuredData(this.chart, this.rowDataRes, this.rowDataHeader);
    this.structuredData(
      this.forecastChart,
      this.forecastDataRes,
      this.rowDataHeader
    );
  }

  chartDataSet = (arr: string[]) => {
    if (!arr.length) {
      return [];
    }
    const res: any = {};
    const keys = Object.keys(arr[0]);
    keys.forEach((key: string) => {
      arr.forEach((el: any) => {
        if (res.hasOwnProperty(key)) {
          res[key].push(el[key]);
        } else {
          res[key] = [el[key]];
        }
      });
    });
    return res;
  };

  structuredData = (chart: any, rowDataRes: any, rowDataHeader: string[]) => {
    if (rowDataRes) {
      let noDateRowData: string[] = [];
      let chartArrayData: string[] = [];
      noDateRowData = rowDataRes.map(({ DATE, ...rest }: any) => rest);
      const tableChartData = Object.assign(this.chartDataSet(noDateRowData));
      chartArrayData = Object.keys(tableChartData)
        .sort()
        .map((x) => tableChartData[x]);
      chartArrayData.forEach((data: string, i: number) => {
        chart.data.datasets.push({
          label: rowDataHeader[i],
          data: data,
        });
      });
    }
  };

  createTableChart = () => {
    this.chart = new Chart("MyChart", {
      type: "line",
      data: {
        labels: this.tableDate,
        datasets: [],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
  };

  createForecastChart = () => {
    this.forecastChart = new Chart("MyForecastChart", {
      type: "line",
      data: {
        labels: this.forecastDate,
        datasets: [],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
  };

  getallDate = (today: any, end: any) => {
    const dateArray: string[] = [];
    const date = new Date(today.getTime());
    while (date <= end) {
      dateArray.push(moment(new Date(date)).format("YYYY-MM-DD"));
      date.setDate(date.getDate() + 1);
    }
    return dateArray;
  };

  getDatafromService = () => {
    this.sharedService.getChartData().subscribe((data: any) => {
      if (data) {
        this.rowDataRes = data;
        data.forEach((item: any) => {
          this.tableDate.push(item.DATE);
        });
      }
    });
    this.sharedService.getRowHeader().subscribe((headers: any) => {
      if (headers) {
        const headersDataSorted = headers.sort((a: any, b: any) => {
          if (a.id > b.id) {
            return 1;
          }
          return b.id > a.id ? -1 : 0;
        });
        headersDataSorted.map((item: HeaderColumn) => {
          let toggle: boolean;
          this.sharedService.getToggleToPer().subscribe((event: boolean) => {
            toggle = event;
            toggle
              ? this.rowDataHeader.push(item.percentage_display_name)
              : this.rowDataHeader.push(item.bcm_display_name);
          });
        });
      }
    });
    this.sharedService.getDisplayName().subscribe((name: string) => {
      if (name) {
        this.displayName = name;
      }
    });
    this.sharedService.getForecastRowData().subscribe((data: any) => {
      if (data) {
        this.forecastDataRes = data;
        data.forEach((item: any) => {
          this.forecastDate.push(item.DATE);
        });
      }
    });
  };

  closeDialog = () => {
    this.dialogRef.close();
  };
}
