import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ViewChild } from '@angular/core';

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
  @ViewChild('loginForm') loginForm!: NgForm; // Référence au formulaire pour pouvoir le réinitialiser (resetForm)

  username = '';
  password = '';
  submitted = false;

  onClose() {
    this.username = '';
    this.password = '';
    this.submitted = false;
    // Réinitialise le formulaire pour effacer l’état touched/dirty
    this.loginForm?.resetForm();
    this.linkClicked.emit();
  }

  onLogin(form: NgForm) {
    this.submitted = true;

    if (!this.username || !this.password) {
      return; // Ne continue pas si les champs sont invalides
    }

    // Ajoute ici ta logique de connexion
    alert(`Connexion avec ${this.username}`);
    this.onClose();
  }

  onRegister() {
    // Redirige vers la page d'inscription
    this.switchToRegister.emit();
  }
}
