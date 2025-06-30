import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Input, Output, EventEmitter } from '@angular/core';



@Component({
  selector: 'app-searchbar',
  imports: [RouterModule],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css'
})
export class SearchbarComponent {
  
  @Input() isSopen = false; // Reçoit l'état depuis le parent via Input (HeaderComponent)

}
