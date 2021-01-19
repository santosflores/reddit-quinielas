import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { sheets_v4 } from 'googleapis';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map} from 'rxjs/operators';
import { NONE_TYPE } from '@angular/compiler';


export interface Leaderboard {
  rounds: Array<Round>
}

export interface Round {
  matchday: number,
  results: Array<Result>
}

export interface Result {
  username: string,
  score: number,
  timestamp: Date
}


@Injectable({
  providedIn: 'root'
})
export class SheetService {
  URL = 'https://us-central1-reddit-quinielas.cloudfunctions.net/sheet_content';
  USERNAME = 0;
  MATCHDAY = 1;
  SCORE = 2;
  TIMESTAMP = 12;

  constructor(private http: HttpClient) { }

  getData(): Observable<sheets_v4.Schema$ValueRange> {
    return this.http.get<sheets_v4.Schema$ValueRange>(this.URL)
      .pipe(
        map((value: sheets_v4.Schema$ValueRange) => value),        
        catchError(this.handleError));
  }

  getLeaderboard(values: any[][]|null|undefined, size:number): Leaderboard | undefined {
    let leaderboard: Leaderboard = { rounds: [] };
    if(values){
      let headers: any[]|undefined = values.shift();
      values.forEach(element => {
        let username: string = element[this.USERNAME];
        let matchday: number = element[this.MATCHDAY];
        let score: number = element[this.SCORE];
        let timestamp: Date = element[this.TIMESTAMP];        
        let match_index = this.searchRound(leaderboard, matchday);
        if(match_index != -1){
          let result: Result = {username, score, timestamp};
          leaderboard.rounds[match_index].results.push(result);
        }else{
          let round: Round = {matchday, results: []};
          let result: Result = {username, score, timestamp};
          round.results.push(result);
          leaderboard.rounds.push(round);
        }
      });
      return leaderboard;
    }
    return undefined;
  }

  sortDesc(a: Result, b:Result) {
    const scoreA = a.score;
    const scoreB = b.score;
    let comparison = 0;
    if(scoreA>scoreB) comparison = -1;
    if(scoreA<scoreB) comparison = 1;
    return comparison;
  }

  sortAsc(a: Result, b:Result) {
    const scoreA = a.score;
    const scoreB = b.score;
    let comparison = 0;
    if(scoreA>scoreB) comparison = 1;
    if(scoreA<scoreB) comparison = -1;
    return comparison;
  }

  getGlobalLeaderBoard(leaderboard: Leaderboard|undefined): Result[]{    
    let indexed: string[] = [];
    let tmp: any = {};
    if(leaderboard?.rounds){
      leaderboard.rounds.forEach((round: Round) => {
        round.results.forEach((result: Result) => {
          if(indexed.includes(result.username)){
            let currentState = tmp[result.username];
            tmp[result.username] = {username: result.username, score: Number(currentState.score) + Number(result.score) }
          }else{
            tmp[result.username] = {username: result.username, score: Number(result.score) };
            indexed.push(result.username);
          }
        });
      });
    }
    return Object.values(tmp);
  }
  
  getRoundIndex(leaderboard: Leaderboard|undefined, matchday: number){
    return this.searchRound(leaderboard, matchday);
  }

  private searchRound(leaderboard: Leaderboard |undefined, matchday: number){
    let found: number = -1;
    leaderboard?.rounds.forEach((round:Round, index:number) => {
      if(round.matchday == matchday) found = index;
    })
    return found;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
}