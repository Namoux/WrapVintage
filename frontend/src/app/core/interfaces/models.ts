
export interface Product {
    id: number,
    name: string,
    description: string,
    price: number,
    imageURL: string,
    quantity: number,
    is_new: number
}

export interface User {
    id: number,
    username: string,
    password: string,
    email: string,
    adresse: string,
    is_admin: number
}

/**
 * Interface pour la modification d'un utilisateur.
 * Hérite de tous les champs de User (optionnels grâce à Partial).
 * Ajoute les champs pour la gestion du changement de mot de passe.
 * - currentPassword : mot de passe actuel (pour vérification)
 * - newPassword : nouveau mot de passe (à enregistrer)
 */
export interface EditUser extends Partial<User> {
  currentPassword?: string;
  newPassword?: string;
}


export interface CartItem {
  product_id: number;
  name: string;
  price: number;
  imageURL: string;
  quantity: number;
}
