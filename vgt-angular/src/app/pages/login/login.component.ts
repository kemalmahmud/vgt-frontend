import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [FormsModule],
  standalone: true
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  apiUrl: string = 'http://localhost:8082/api/auth/login';


  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    const loginData = { username: this.username, password: this.password };

    this.http.post<{ data : { token: string, userId: string, username: string }}>(this.apiUrl, loginData).subscribe({
      next: (response) => {
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('authToken', response.data.token);
        this.router.navigate(['/home']); // Redirect ke home jika sukses
      },
      error: () => {
        alert('Login gagal! Cek kembali username dan password.');
      }
    });
  }
}
