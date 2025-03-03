import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports:[CommonModule, RouterModule],
  standalone: true
})
export class NavbarComponent implements OnInit{
  username: string | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    if (typeof window !== 'undefined') { // Pastikan berjalan di browser
      this.username = localStorage.getItem('username');
    }
  }

  getInitials(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '?'; // Ambil huruf pertama
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('username'); 
      localStorage.removeItem('userId'); 
      localStorage.removeItem('token'); 
    }
    this.username = null;
    this.router.navigate(['/login']); // Redirect ke halaman login
  }
}
