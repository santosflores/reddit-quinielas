import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeaderboardComponent} from './leaderboard/leaderboard.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  {
    path: 'leaderboard',
    component: LeaderboardComponent
  },
  {path:'main', 
  component: MainComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
