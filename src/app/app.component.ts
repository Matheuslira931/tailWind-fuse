import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {LoaderService} from "./modules/shared/services/loader.service";
import {NgIf} from "@angular/common";
import {AlertComponent} from "./modules/shared/components/alert/alert.component";
import {filter} from "rxjs";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet, MatProgressSpinnerModule, NgIf, AlertComponent],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
    showLoader = false;

    constructor(private loaderService: LoaderService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.watchRouterChanges();
        this.handleLoader();
    }

    private handleLoader(): void {
        this.loaderService.toggle$()
            .subscribe(() => this.showLoader = !this.showLoader);
    }

    private watchRouterChanges(): void {
        this.closeLoaderOnRouterChange();
    }

    private closeLoaderOnRouterChange(): void {
        this.router.events.pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((val) => {
                if (this.showLoader) {
                    this.showLoader = false;
                }
            });
    }
}
