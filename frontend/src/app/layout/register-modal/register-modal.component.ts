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

  onClose() {
    this.username = '';
    this.password = '';
    this.email = '';
    this.submitted = false;
    // Réinitialise le formulaire pour effacer l’état touched/dirty
    this.registerForm?.resetForm();
    this.linkClicked.emit();
  }

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

  onSwitchToLogin() {
    this.switchToLogin.emit();
  }

}
