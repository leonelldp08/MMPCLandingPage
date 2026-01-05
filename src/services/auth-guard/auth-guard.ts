import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Auth } from '../auth/auth';
import { catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: Auth,
    private router: Router
  ) {}
  private readonly CURRENT_URL = 'currentUrl';

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // Set URL to session storage
    let url = '';
    if (Array.isArray(state.url)) {
      url = state.url.map((segment) => segment.path).join('/');
    } else if (typeof state.url === 'string') {
      url = state.url;
    } else {
      console.error('Unexpected type for state.url');
      return false;
    }

    if (!url) {
      console.error('Failed to get current route');
      this.redirectToLogin();
      return false;
    }
    this.setCurrentRoute(url);

    const token = this.authService.getAuthorizationHeader();
    if (token && this.isTokenValid(token)) {
      return true;
    } else {
      // Try to refresh token
      return this.authService.refreshToken().pipe(
        map((refreshSuccess) => {
          if (refreshSuccess) {
            return true;
          } else {
            this.redirectToLogin();
            return false;
          }
        }),
        catchError(() => {
          this.redirectToLogin();
          return of(false);
        })
      );
    }
  }

  private redirectToLogin(): void {
    // Clear any stored auth data
    this.authService.clearAuthData();
    // Redirect to login page instead of letting Angular fall back to root
    this.router.navigate(['/']);
  }

  setCurrentRoute(route: string): void {
    try {
      sessionStorage.setItem(this.CURRENT_URL, route);
    } catch (error) {
      console.error('Failed to save current route to sessionStorage', error);
    }
  }

  isTokenValid(token: string): boolean {
    let valid: boolean = false;
    this.authService.validateToken().subscribe((response) => {
      valid = (response.body as any)?.valid || false;
    });
    return valid;
  }
}
