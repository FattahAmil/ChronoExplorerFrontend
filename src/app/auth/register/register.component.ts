import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';  // Assure-toi d'importer NgForm

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  user = {
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  };

  showPassword = false;
  showConfirmPassword = false;
  loading = false;
  errorMessages: string[] = [];

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Méthode pour soumettre le formulaire
  submitForm(registerForm: NgForm) {
    this.errorMessages = [];

    // Validation du formulaire
    if (!this.user.email) {
      this.errorMessages.push('L\'email est requis');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.user.email)) {
      this.errorMessages.push('Veuillez entrer une adresse email valide');
    }

    if (!this.user.password) {
      this.errorMessages.push('Le mot de passe est requis');
    } else if (this.user.password.length < 6) {
      this.errorMessages.push('Le mot de passe doit contenir au moins 6 caractères');
    }

    if (!this.user.confirmPassword) {
      this.errorMessages.push('Veuillez confirmer votre mot de passe');
    } else if (this.user.password !== this.user.confirmPassword) {
      this.errorMessages.push('Les mots de passe ne correspondent pas');
    }

    if (!this.user.terms) {
      this.errorMessages.push('Vous devez accepter les conditions d\'utilisation');
    }

    if (this.errorMessages.length > 0) {
      return;
    }

    // Simuler la soumission du formulaire
    this.loading = true;

    setTimeout(() => {
      this.loading = false;
      alert('Inscription réussie ! Bienvenue au Musée Imaginaire.');
      // Ici, tu rediriges vers la page de connexion ou tableau de bord
    }, 1500);
  }
}
