import { Component } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { FormsModule } from '@angular/forms';
import { ContactMessage } from '../../core/interfaces/models';

@Component({
  selector: 'app-contact',
  imports: [FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  // Champs du formulaire
  name = '';
  email = '';
  subject = '';
  message = '';

  // Messages de retour
  successMsg = '';
  errorMsg = '';

  // Pour gérer l'animation de fondu
  successHide = false;
  errorHide = false;

  constructor(private api: ApiService) { }

  /**
   * Soumet le formulaire de contact.
   * Affiche un message de succès ou d'erreur avec effet fondu.
   */
  async onSubmit() {
    try {
      // Envoie le message au backend
      await this.api.sendContactMessage({
        name: this.name,
        email: this.email,
        subject: this.subject,
        message: this.message
      } as ContactMessage);

      // Affiche le message de succès et réinitialise le formulaire
      this.successMsg = "Votre message a bien été envoyé !";
      this.errorMsg = '';
      this.successHide = false;
      this.name = this.email = this.subject = this.message = '';

      // Lance le fondu et efface le message après 2,6s
      setTimeout(() => this.successHide = true, 2000);
      setTimeout(() => this.successMsg = '', 2600);
    } catch (err: any) {
      // Affiche le message d'erreur
      this.errorMsg = err.message || "Erreur lors de l'envoi";
      this.successMsg = '';
      this.errorHide = false;

      // Lance le fondu et efface le message après 2,6s
      setTimeout(() => this.errorHide = true, 2000);
      setTimeout(() => this.errorMsg = '', 2600);
    }
  }
}
