import { NONE_TYPE } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { sheets_v4 } from 'googleapis';
import { LeaderboardComponent } from '../leaderboard/leaderboard.component';
import { SheetService, Leaderboard, Result } from '../sheet.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  dataSource?: sheets_v4.Schema$ValueRange;
  displayedColumns?: String[];
  leaderboard?: Leaderboard;
  global_results?: Result[];
  topRound?: Result[];
  wallOfShameRound?: Result[];
  round?: number;
  winner?: Result;
  loser?: Result;
  matchday: number = 1;

  constructor(private sheet: SheetService) {
    this.sheet.getData().subscribe((d: sheets_v4.Schema$ValueRange) => {
      this.dataSource = { ...d }
      if (d.values) {
        this.leaderboard = this.sheet.getLeaderboard(d.values, 10);
        this.global_results = this.sheet.getGlobalLeaderBoard(this.leaderboard).sort(this.sheet.sortDesc).slice(0, 15);
        this.round = this.sheet.getRoundIndex(this.leaderboard, this.matchday);
        this.topRound = this.leaderboard?.rounds[this.round].results.sort(this.sheet.sortDesc).slice(0, 5);
        this.winner = this.topRound?.shift();
        this.wallOfShameRound = this.leaderboard?.rounds[this.round].results.sort(this.sheet.sortAsc).slice(0, 5);
        this.loser = this.wallOfShameRound?.shift();
        this.displayedColumns = ['username', 'score'];
      }
    });
  }

  updateRound(matchday: number) {
    this.matchday = matchday;
    this.round = this.sheet.getRoundIndex(this.leaderboard, this.matchday);
    this.topRound = this.leaderboard?.rounds[this.round].results.sort(this.sheet.sortDesc).slice(0, 5);
    this.winner = this.topRound?.shift();
    this.wallOfShameRound = this.leaderboard?.rounds[this.round].results.sort(this.sheet.sortAsc).slice(0, 5);
    this.loser = this.wallOfShameRound?.shift();
  }

  ngOnInit(): void {
  }

}
