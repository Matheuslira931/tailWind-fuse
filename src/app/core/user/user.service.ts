import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {User} from 'app/core/user/user.types';
import {map, Observable, ReplaySubject, tap} from 'rxjs';
import {environment} from "../../../environments/environment";

@Injectable({providedIn: 'root'})
export class UserService {
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

    constructor(private _httpClient: HttpClient) {
    }

    set user(value: User) {
        this._user.next(value);
    }

    get user$(): Observable<User> {
        return this._user.asObservable();
    }

    get(): Observable<User> {
        return this._httpClient.get<User>('api/common/user').pipe(
            tap((user) => {
                this._user.next(user);
            }),
        );
    }

    update(user: User): Observable<any> {
        return this._httpClient.patch<User>('api/common/user', {user}).pipe(
            map((response) => {
                this._user.next(response);
            }),
        );
    }

    welcome(id: number): Observable<string> {
        return this._httpClient.get(`${environment.URL_API}/users/welcome/${id}`, {
            responseType: 'text'
        });
    }
}
