import { Injectable } from "@angular/core";
import { LocalStorageService } from "../storage/local-storage.service";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { AuthService, LoginRequest, RegisterRequest, TokenResponse } from "../api/auth.service";
import { JWT_TOKEN } from "../storage/local-storage.constant";
import { UserActions } from "../../state/actions";
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root'})
export class LoginService {

    private userInfo = new BehaviorSubject<{
        email: string;
        role: string;
        id: string;
        userGeneratedId: string;
    } | null>(null);

    get jwtToken(): string | null {
        return this.storage.get(JWT_TOKEN);
    }

    constructor(
        private storage: LocalStorageService,
        private store: Store,
        private authService: AuthService
    ) {
        this.updateUserInfo();
    }

    get isLoggedIn() {
        return !!this.jwtToken;
    }

    login(data: LoginRequest): Observable<TokenResponse> {
        return this.authService.login(data).pipe(
            tap((token) => {
                this.storage.set([{key: JWT_TOKEN, value: token.token}]);
                this.updateUserInfo();
            })
        );
    }

    register(data: RegisterRequest): Observable<TokenResponse> {
        return this.authService.register(data).pipe(
            // tap((token) => {
            //     this.storage.set([{key: JWT_TOKEN, value: token.token}]);
            //     this.updateUserInfo();
            // })
        );
    }

    signOut() {
        this.storage.remove([JWT_TOKEN]);
        this.userInfo.next(null);
        this.store.dispatch(UserActions.logoutAction());
    }

    private updateUserInfo() {
        const token = this.jwtToken;
        if (!token) return;

        // const {
        //     Email: email = '',
        //     UserRole: role = '',
        //     UserId: id = '',
        //     GeneratedId: userGeneratedId = '',
        // }: {Email: string; UserRole: string; UserId: string; GeneratedId: string} = JSON.parse(
        //     window.atob(token.split('.')[1])
        // );
        // this.userInfo.next({email, role, id, userGeneratedId});
    }
}