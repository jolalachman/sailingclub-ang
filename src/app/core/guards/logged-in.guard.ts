import { Injectable } from "@angular/core";
import { Router, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { LoginService } from "../service/login/login.service";

@Injectable({
    providedIn:'root'
})
export class LoggedInGuard {
    constructor(private service: LoginService, private router: Router) {}

    canActivate():
      | Observable<boolean | UrlTree>
      | Promise<boolean | UrlTree>
      | boolean
      | UrlTree {
        if (!this.service.isLoggedIn) {
            this.router.navigate(['/']);
            return false;
        }
        return true;
      }
}