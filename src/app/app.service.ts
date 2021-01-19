import { Injectable } from '@angular/core';
import { sheets_v4 } from 'googleapis';
import { SheetService } from './sheet.service';
@Injectable({
  providedIn: 'root'
})
export class AppService {
  data?: sheets_v4.Schema$ValueRange;

  constructor(private sheetService: SheetService) {
    this.sheetService.getData().subscribe((data: sheets_v4.Schema$ValueRange) => {
      this.data = data;
    });
  }

  getData(): sheets_v4.Schema$ValueRange|undefined {
    return this.data;
  }
}
