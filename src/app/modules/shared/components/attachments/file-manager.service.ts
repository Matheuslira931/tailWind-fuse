import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, tap} from 'rxjs';
import {Item, Items} from './file-manager.types';

@Injectable({providedIn: 'root'})
export class FileManagerService {
    private _item: BehaviorSubject<Item | null> = new BehaviorSubject(null);
    private _items: BehaviorSubject<Items | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) {
    }

    get items$(): Observable<Items> {
        return this._items.asObservable();
    }

    get item$(): Observable<Item> {
        return this._item.asObservable();
    }

    getItems(folderId: string | null = null): Observable<Item[]> {
        return this._httpClient.get<Items>('api/apps/file-manager', {params: {folderId}}).pipe(
            tap((response: any) => {
                this._items.next(response);
            }),
        );
    }

    getItemById(id: string): Observable<Item> {
        return of({
            id: '5cb66e32-d1ac-4b9a-8c34-5991ce25add2',
            folderId: null,
            name: 'Contract #123',
            createdBy: 'Brian Hughes',
            createdAt: 'January 14, 2021',
            modifiedAt: 'January 14, 2021',
            size: '1.2 MB',
            type: 'PDF',
            contents: null,
            description: null,
        });
    }
}
