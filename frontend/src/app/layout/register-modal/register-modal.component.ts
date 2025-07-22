import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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

  username = '';
  email = '';
  password = '';

  onClose() {
    this.linkClicked.emit();
  }

  onRegister() {
    alert(`Inscription : ${this.username} (${this.email})`);
    this.onClose();
  }
  onSwitchToLogin() {
    this.switchToLogin.emit();
  }

}
