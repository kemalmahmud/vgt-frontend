import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  standalone: true
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  name: string = '';
  email: string = '';
  apiUrl: string = 'http://localhost:8082/api/auth/register';

  constructor(private http: HttpClient, private router: Router) {}

  async onRegister() {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    const registerData = { username: this.username, password: hashedPassword, name: this.name, email: this.email };

    this.http.post<{ data : { token: string }}>(this.apiUrl, registerData).subscribe({
      next: (response) => {
        alert('Register berhasil! Silahkan login dengan username yang dibuat.');
        this.router.navigate(['/login']); // Redirect ke login jika sukses
      },
      error: () => {
        alert('Register gagal! Coba lagi nanti');
      }
    });
  }
}

