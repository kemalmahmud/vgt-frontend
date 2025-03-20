import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router) {}

    canActivate(): boolean {
        if (sessionStorage.getItem('authToken')) {
          return true; // Izinkan akses
        } else {
          this.router.navigate(['/login']); // Redirect ke login kalau belum login
          return false;
        }
      }
}