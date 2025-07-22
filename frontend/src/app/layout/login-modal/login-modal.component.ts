import { Component , EventEmitter, Output, Input} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-modal',
  imports: [RouterModule, FormsModule],
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent {
  @Input() isLopen = false; // Reçoit l'état depuis le parent via Input (HeaderComponent)
  @Output() linkClicked = new EventEmitter<void>();
  @Output() switchToRegister = new EventEmitter<void>();
  
  username = '';
  password = '';

  onClose() {
    this.linkClicked.emit();
  }

  onLogin() {
    // Ajoute ici ta logique de connexion
    alert(`Connexion avec ${this.username}`);
    this.onClose();
  }

  onRegister() {
  // Redirige vers la page d'inscription
    this.switchToRegister.emit();
}
}
