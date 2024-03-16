import {Injectable} from "@angular/core";
import {COLLABORATORS_ROUTE} from "../constants/path-constants";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Collaborator} from "../models/collaborator.model";

@Injectable({providedIn: 'root'})
export class CollaboratorService {
    private readonly BASE_URL = environment.URL_API;

    constructor(private httpClient: HttpClient) {
    }

    getItems(): Observable<Collaborator[]> {
        return this.httpClient.get<Collaborator[]>(`${this.getUrl()}items`);
    }

    getUrl(): string {
        return `${this.BASE_URL}${COLLABORATORS_ROUTE}`;
    }
}
