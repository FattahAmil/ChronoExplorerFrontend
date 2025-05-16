import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  rememberMe = false;

  errors: string[] = [];

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onSubmit(): void {
    this.errors = [];

    if (!this.email) {
      this.errors.push("L'adresse email est requise");
    } else if (!this.validateEmail(this.email)) {
      this.errors.push("Veuillez entrer une adresse email valide");
    }

    if (!this.password) {
      this.errors.push('Le mot de passe est requis');
    } else if (this.password.length < 6) {
      this.errors.push('Le mot de passe doit contenir au moins 6 caractères');
    }

    if (this.errors.length === 0) {
      // Simulation connexion réussie - à remplacer par appel API
      alert(`Connexion réussie avec ${this.email}`);
      // TODO : redirection ou autres actions
    }
  }

}
