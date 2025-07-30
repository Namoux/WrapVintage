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

  /**
 * Objet temporaire pour l'édition du profil utilisateur.
 * Il est utilisé pour stocker les modifications avant de les enregistrer.
 * Les champs sont optionnels grâce à l'interface EditUser (Partial<User>).
 */
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

  /**
 * Active le mode édition du profil utilisateur.
 */
  enableEdit() {
    this.editMode = true;
    this.editUser = {};
  }

  /**
 * Annule l'édition du profil et recharge les informations utilisateur.
 */
  cancelEdit() {
    this.editMode = false;
    this.editUser = {};
    // recharger les infos utilisateur pour annuler les modifications
    this.ngOnInit();
  }

  /**
 * Enregistre les modifications du profil utilisateur.
 * Affiche un message de succès ou d'erreur selon le résultat.
 */
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

  /**
 * Déconnecte l'utilisateur, rafraîchit le header et redirige vers l'accueil.
 */
  async onLogout() {
    try {
      await this.api.logout();
      // Rafraîchir le username dans le header
      // Envoie un événement personnalisé au window pour demander au composant header de rafraîchir l'affichage du username.
      window.dispatchEvent(new CustomEvent('loadUserName'));
      window.dispatchEvent(new CustomEvent('loadCartQuantity'));
      // redirige a la page d'acceuil
      this.router.navigate(['/']);
    } catch (err) {
      console.error('Erreur lors de la déconnexion');
    }
  }

  /**
 * Supprime le compte utilisateur et déconnecte l'utilisateur.
 */
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

  /**
 * Ouvre la modale de confirmation de suppression de compte.
 */
  openDeleteModal() {
    this.showDeleteModal = true;
  }

  /**
 * Ferme la modale de confirmation de suppression de compte.
 */
  closeDeleteModal() {
    this.showDeleteModal = false;
  }

}
