import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { Role } from '@core/types/user.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    const currentProfile = this.authService.currentUserFromStorage;
    if (currentProfile && currentProfile.user.role !== Role.ADMIN) {
      this.router.navigate(['/']);
      return false;
    }    
    return true;
  }
  
}
