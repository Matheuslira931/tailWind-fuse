import {NgIf} from '@angular/common';
import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {FuseFullscreenComponent} from '@fuse/components/fullscreen';
import {FuseLoadingBarComponent} from '@fuse/components/loading-bar';
import {
    FuseHorizontalNavigationComponent,
    FuseNavigationService,
    FuseVerticalNavigationComponent
} from '@fuse/components/navigation';
import {FuseMediaWatcherService} from '@fuse/services/media-watcher';
import {NavigationService} from 'app/core/navigation/navigation.service';
import {Navigation} from 'app/core/navigation/navigation.types';
import {MessagesComponent} from 'app/layout/common/messages/messages.component';
import {NotificationsComponent} from 'app/layout/common/notifications/notifications.component';
import {SearchComponent} from 'app/layout/common/search/search.component';
import {ShortcutsComponent} from 'app/layout/common/shortcuts/shortcuts.component';
import {UserComponent} from 'app/layout/common/user/user.component';
import {HeaderSettings} from 'app/modules/shared/enums/header-settings.enum';
import {Subject, takeUntil} from 'rxjs';
import {HeaderService} from "../../../../modules/shared/services/header.service";

@Component({
    selector: 'centered-layout',
    templateUrl: './centered.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [FuseLoadingBarComponent, NgIf, FuseVerticalNavigationComponent, FuseHorizontalNavigationComponent, MatButtonModule, MatIconModule, FuseFullscreenComponent, SearchComponent, ShortcutsComponent, MessagesComponent, NotificationsComponent, UserComponent, RouterOutlet],
})
export class CenteredLayoutComponent implements OnInit, OnDestroy {
    navigation: Navigation;
    isScreenSmall: boolean;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    headerSettingsMap: Map<HeaderSettings, boolean>;
    headerSettings = HeaderSettings;

    /**
     * Constructor
     */
    constructor(
        private _navigationService: NavigationService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        private _headerService: HeaderService,
    ) {
    }

    get currentYear(): number {
        return new Date().getFullYear();
    }

    ngOnInit(): void {
        this.headerSettingsMap = this._headerService.getHeaderSettings();
        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) => {
                this.navigation = navigation;
            });

        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    }
}
