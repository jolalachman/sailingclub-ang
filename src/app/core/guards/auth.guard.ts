import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { LoginService } from "../service/login/login.service";

@Injectable({
    providedIn:'root'
})
export class AuthGuard {
    constructor(private service: LoginService, private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot
    ):
      | Observable<boolean | UrlTree>
      | Promise<boolean | UrlTree>
      | boolean
      | UrlTree {
        const allowedRoles = route.data['allowedRoles'] as string[];
        if (!this.service.isLoggedIn) {
            this.router.navigate(['/']);
            return false;
        }
        if (allowedRoles.includes('ADMIN') && this.service.userInformation?.role === 'ADMIN') {
            return true;
        }
        if (allowedRoles.includes('BOSMAN') && this.service.userInformation?.role === 'BOSMAN') {
            return true;
        }
        if (allowedRoles.includes('MAT') && this.service.userInformation?.role === 'MAT') {
            return true;
        }
        if (allowedRoles.includes('SAILOR') && this.service.userInformation?.role === 'SAILOR') {
            return true;
        }
        return false;
      }
}