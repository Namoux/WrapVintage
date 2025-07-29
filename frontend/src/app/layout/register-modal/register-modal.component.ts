import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { ApiService } from '../../core/services/api.service'; // Ajoute l'import

@Component({
  selector: 'app-register-modal',
  imports: [RouterModule, FormsModule],
  templateUrl: './register-modal.component.html',
  styleUrl: './register-modal.component.css'
})
export class RegisterModalComponent {
  @Input() isRopen = false;
  @Output() linkClicked = new EventEmitter<void>();
  @Output() switchToLogin = new EventEmitter<void>();
  @ViewChild('registerForm') registerForm!: NgForm; // Référence au formulaire pour pouvoir le réinitialiser (resetForm)

  constructor(private api: ApiService) { }

  username = '';
  email = '';
  password = '';
  successMsg = '';
  errorMsg = '';
  submitted = false;

  /**
 * Ferme la modale d'inscription, réinitialise le formulaire et les champs.
 * Émet un événement pour informer le parent.
 */
  onClose() {
    this.username = '';
    this.password = '';
    this.email = '';
    this.submitted = false;
    // Réinitialise le formulaire pour effacer l’état touched/dirty
    this.registerForm?.resetForm();
    this.linkClicked.emit();
  }

  /**
 * Soumet le formulaire d'inscription.
 * 
 * - Valide les champs.
 * - Appelle l'API pour créer le compte utilisateur.
 * - Affiche un message de succès ou d'erreur selon le résultat.
 * - Ferme la modale après succès.
 * 
 * @param form Le formulaire Angular soumis.
 */
  async onRegister(form: NgForm) {
    console.log("submit");
    this.submitted = true;

    if (!this.username || !this.password || !this.email) {
      return; // Ne continue pas si les champs sont invalides
    }

    try {
      await this.api.register(this.username, this.password, this.email)
      this.successMsg = `Inscription réussie ! : ${this.username} (${this.email}) `;
      setTimeout(() => {
        this.successMsg = '';
        this.onClose();
      }, 2000);
    } catch (error: any) {
      this.errorMsg = error?.error || "Erreur lors de l'inscription";
      this.successMsg = '';
      setTimeout(() => this.errorMsg = '', 2000);
    }

  }

  /**
 * Passe à la modale de connexion.
 * Émet un événement pour informer le parent.
 */
  onSwitchToLogin() {
    this.switchToLogin.emit();
  }

}
