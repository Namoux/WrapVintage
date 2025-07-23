import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { EditUser, User } from '../../core/interfaces/models';
import { NgForm, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-compte',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './compte.component.html',
  styleUrls: ['./compte.component.css']
})
export class CompteComponent {
  user: User = {
    id: 0,
    username: '',
    password: '',
    email: '',
    adresse: '',
    is_admin: 0,
  };

  editUser: EditUser = {};
  editMode = false;
  successMsg = '';
  errorMsg = '';
  showDeleteModal = false;

  constructor(private api: ApiService, private router: Router) { }

  async ngOnInit() {
    this.user = await this.api.getMe(); // getMe() doit renvoyer {username, email, address, ...}
    console.log(this.user);
  }

  enableEdit() {
    this.editMode = true;
    this.editUser = {};
  }

  cancelEdit() {
    this.editMode = false;
    this.editUser = {};
    // Optionnel : recharger les infos utilisateur pour annuler les modifications
    this.ngOnInit();
  }

  async save() {
    try {
      await this.api.updateUser(this.user.id, this.editUser);
      // Récupère les nouvelles infos utilisateur
      await this.ngOnInit();
      this.editMode = false;
      this.successMsg = 'Modifications enregistrées avec succès !';
      window.scrollTo({ top: 0, behavior: 'smooth' }); // remonte la fenetre
      setTimeout(() => this.successMsg = '', 2000); // Efface le message après 2s
    } catch (error: any) {
      // Récupère le message d'erreur du backend
      this.errorMsg = error?.error || 'Erreur lors de la modification';
      // Vide les champs mot de passe
      this.editUser.currentPassword = '';
      this.editUser.newPassword = '';
      setTimeout(() => this.errorMsg = '', 2000); // Efface le message après 2s
      this.successMsg = '';
      console.error('Erreur lors de la modification', error);
    }
  }

  async onLogout() {
    try {
      await this.api.logout();
      // Rafraîchir le username dans le header
      window.dispatchEvent(new CustomEvent('refreshUserName'));
      // redirige a la page d'acceuil
      this.router.navigate(['/']);
    } catch (err) {
      console.error('Erreur lors de la déconnexion');
    }
  }

  async onDeleteAccount() {
    try {
      await this.api.deleteUser(this.user.id);
      await this.onLogout();
    } catch (err) {
      this.errorMsg = "Erreur lors de la suppression du compte";
      setTimeout(() => this.errorMsg = '', 2000);
      console.error('Erreur lors de la suppression du compte', err);
    }
  }

  openDeleteModal() {
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
  }


}
