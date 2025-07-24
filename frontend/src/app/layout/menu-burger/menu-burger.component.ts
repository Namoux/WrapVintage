import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu-burger',
  imports: [RouterModule],
  standalone: true,
  templateUrl: './menu-burger.component.html',
  styleUrls: ['./menu-burger.component.css']
})
export class MenuBurgerComponent {

  @Input() isMopen = false; // Reçoit l'état depuis le parent via Input (HeaderComponent)

  /**
 * Événement émis lorsque l'utilisateur clique sur un lien du menu ou ferme le menu.
 * Permet au parent de réagir (ex : fermer le menu burger).
 */
  @Output() linkClicked = new EventEmitter<void>();

  /**
 * Ferme le menu burger en émettant l'événement linkClicked.
 */
  closeMenu() {
    this.linkClicked.emit();
  }
}
