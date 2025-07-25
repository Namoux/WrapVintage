import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Pour ngModel
import { RouterModule } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

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

  constructor(private api: ApiService) { } // <-- Injecte ApiService

  username = '';
  password = '';
  submitted = false;
  errorMsg = '';
  successMsg = '';

  /**
 * Ferme la modale de connexion et réinitialise tous les champs et messages.
 * Réinitialise le formulaire Angular pour effacer l’état touched/dirty.
 * Émet un événement pour informer le parent que le lien a été cliqué.
 */
  onClose() {
    this.username = '';
    this.password = '';
    this.submitted = false;
    this.errorMsg = '';
    this.successMsg = '';
    // Réinitialise le formulaire pour effacer l’état touched/dirty
    this.loginForm?.resetForm();
    this.linkClicked.emit();
  }

  /**
 * Tente de connecter l'utilisateur avec les identifiants saisis.
 * Affiche un message de succès ou d'erreur selon le résultat.
 * Ferme la modale automatiquement après une connexion réussie.
 * @param {NgForm} form - Formulaire Angular de connexion
 */
  async onLogin(form: NgForm) {
    this.submitted = true;
    this.errorMsg = '';

    if (!this.username || !this.password) {
      return; // Ne continue pas si les champs sont invalides
    }

    try {
      const response = await this.api.login(this.username, this.password);

      // Stocke le token et le username dans le localStorage
      // localStorage.setItem('token', response.token);
      // localStorage.setItem('username', response.username);
      // alert(`Connexion avec ${this.username}`);

      // → On va chercher à nouveau les infos utilisateur
      const user = await this.api.getMe();

      this.successMsg = `Connexion réussie, Bienvenue ${this.username}`;
      setTimeout(() => this.onClose(), 1200); // Ferme le modal après 1,2s
    } catch (error: any) {
      this.errorMsg = error?.error?.error || "Erreur lors de la connexion";
    }

  }

  /**
 * Passe à la modale d'inscription (switch).
 * Émet un événement pour informer le parent.
 */
  onRegister() {
    // Redirige vers la page d'inscription
    this.switchToRegister.emit();
  }
}
