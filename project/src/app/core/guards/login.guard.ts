import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "@core/services/auth.service";

@Injectable({
    providedIn: 'root'
})
export class LoginGuard implements CanActivate {

    constructor(
        private router: Router,
        private authService: AuthService) {

    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authService.currentUserFromStorage;
        if (currentUser && currentUser.token) {
            this.router.navigate(['/']);
            return false;
        }        
        return true;
    }

}
