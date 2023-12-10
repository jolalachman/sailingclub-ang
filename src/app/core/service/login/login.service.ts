import { Injectable } from "@angular/core";
import { LocalStorageService } from "../storage/local-storage.service";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { AuthService, LoginRequest, LoginResponse, RecoverPasswordRequest, RegisterRequest, ResetPasswordRequest, TokenResponse } from "../api/auth.service";
import { JWT_TOKEN, USER_INFO } from "../storage/local-storage.constant";
import { UserActions } from "../../state/actions";
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root'})
export class LoginService {

    userInfo = new BehaviorSubject<{
        firstName: string;
        lastName: string;
        id: string;
    } | null>(null);

    get jwtToken(): string | null {
        return this.storage.get(JWT_TOKEN);
    }

    get userInfoStr(): string | null {
        return this.storage.get(USER_INFO);
    }

    getUserInfo() {
        return this.userInfo;
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

    login(data: LoginRequest): Observable<LoginResponse> {
        return this.authService.login(data).pipe(
            tap((token) => {
                this.storage.set([
                    {key: JWT_TOKEN, value: token.auth_token},
                    {key: USER_INFO, value: token.firstName + ' ' + token.lastName + ' ' + token.id }]);
                this.updateUserInfo();
            })
        );
    }

    register(data: RegisterRequest): Observable<TokenResponse> {
        return this.authService.register(data);
    }

    activateAccount(data: TokenResponse): Observable<boolean> {
        return this.authService.activateAccount(data);
    }

    recoverPassword(data: RecoverPasswordRequest): Observable<boolean> {
        return this.authService.recoverPassword(data);
    }

    resetPassword(data: ResetPasswordRequest): Observable<boolean> {
        return this.authService.resetPassword(data);
    }

    signOut() {
        this.storage.remove([JWT_TOKEN]);
        this.userInfo.next(null);
        this.store.dispatch(UserActions.logoutAction());
    }

    private updateUserInfo() {
        const userInfo = this.userInfoStr?.split(' ');
        if (!userInfo || userInfo.length < 3) return;
        const firstName = userInfo[0];
        const lastName = userInfo[1];
        const id = userInfo[2];
        this.userInfo.next({firstName, lastName, id});
    }

    setUserInfo(firstName: string, lastName: string, id: string) {
        this.storage.set([
            {key: USER_INFO, value: firstName + ' ' + lastName + ' ' + id }]);
        this.updateUserInfo();
    }
}