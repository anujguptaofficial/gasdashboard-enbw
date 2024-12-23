import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { SharedService } from "../../../../services/shared-service/shared.service";

@Component({
  selector: "app-copypaste-upload",
  templateUrl: "./copypaste-upload.component.html",
  styleUrls: ["./copypaste-upload.component.scss"],
})
export class CopyPasteComponent implements OnInit {
  @Output() onDataAdded = new EventEmitter<any>();
  @Input() pasteTextArea: string = "";

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.sharedService.getDropDownChange().subscribe((code: string) => {
      this.pasteTextArea = code;
      this.textArea = false;
    });
  }

  pastedData: string;
  displayedColumns: string[] = [];
  dataSource: any[] = [];
  textArea = false;

  onPasteData = (event: ClipboardEvent) => {
    let clipboardData = event.clipboardData;
    if (clipboardData != undefined) {
      let pastedText = clipboardData.getData("text");
      let row_data = pastedText.split("\n");
      let row_split = row_data[0].split("\t");
      this.displayedColumns = row_split.map((item: string) =>
        item === "" ? " " : item
      );
      row_data.shift();
      let data: any[] = [];
      row_data.forEach((rowData) => {
        let row: any = {};
        let rowValues = rowData.split("\t");
        this.displayedColumns.forEach((column, colIndex) => {
          let value = rowValues[colIndex] || "";
          if (!isNaN(parseFloat(value.replace(",", ".")))) {
            value = value.replace(",", ".");
          }
          row[column] = value;
        });
        data.push(row);
      });
      this.dataSource = data.filter((row) =>
        Object.values(row).some((val) => val !== "")
      );
    }
  };

  onChange = (event: any) => {
    if (event.inputType === "insertFromPaste") {
      this.textArea = true;
    }
  };

  uploadPastedData = () => {
    this.onDataAdded.emit(this.dataSource);
  };
}
