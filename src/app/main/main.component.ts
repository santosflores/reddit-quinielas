import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { Component, OnInit, HostBinding } from '@angular/core';
import { sheets_v4 } from 'googleapis';
import { SheetService, Leaderboard, Result } from '../sheet.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  animations: [// ...
    trigger('openClose', [
      state('open', style({
        opacity: 1
      })),
      state('closed', style({
        opacity: 0        

      })),
      transition('open <=> closed', [
        animate('1s')
      ]),
    ]),
  ]
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
  isOpen = true;

  toggle() {
    this.isOpen = !this.isOpen;
  }

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

  async updateRound(matchday: number) {
    this.toggle();
    await this.sleep(500);
    this.matchday = matchday;
    this.round = this.sheet.getRoundIndex(this.leaderboard, this.matchday);
    this.topRound = this.leaderboard?.rounds[this.round].results.sort(this.sheet.sortDesc).slice(0, 5);
    this.winner = this.topRound?.shift();
    this.wallOfShameRound = this.leaderboard?.rounds[this.round].results.sort(this.sheet.sortAsc).slice(0, 5);
    this.loser = this.wallOfShameRound?.shift();
    this.toggle();
  }

  ngOnInit(): void {
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
