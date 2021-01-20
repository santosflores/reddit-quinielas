import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'reddit-quinielas';
  images: String[] = [
    'america', 
    'atlas', 
    'cruzazul', 
    'guadalajara', 
    'juarez',     
    'leon', 
    'mazatlan',
    'monterrey',
    'necaxa',
    'pachuca',
    'puebla',
    'pumas',
    'queretaro',
    'sanluis',
    'santos',
    'tijuana',
    'labudenl', 
    'toluca'
];
  constructor() { }


}
