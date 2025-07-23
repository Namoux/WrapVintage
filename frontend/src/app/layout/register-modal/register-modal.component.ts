import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ViewChild } from '@angular/core';

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

  username = '';
  email = '';
  password = '';
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

  onRegister(form: NgForm) {

    this.submitted = true;

    if (!this.username || !this.password || this.email) {
      return; // Ne continue pas si les champs sont invalides
    }
    alert(`Inscription : ${this.username} (${this.email})`);
    this.onClose();
  }
  onSwitchToLogin() {
    this.switchToLogin.emit();
  }

}
