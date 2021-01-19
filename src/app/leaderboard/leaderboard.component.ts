import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;
  /*@ViewChild(MatTable) table?: MatTable<LeaderboardItem>;*/
  dataSource?: [];

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name'];

  ngOnInit() {
    // this.dataSource = new LeaderboardDataSource();
  }

  ngAfterViewInit() {
    /*if(this.dataSource && this.sort) this.dataSource.sort = this.sort;
    if(this.dataSource && this.paginator) this.dataSource.paginator = this.paginator;
    if(this.dataSource && this.table) this.table.dataSource = this.dataSource;*/
  }
}
