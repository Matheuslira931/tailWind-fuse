import {NgIf} from '@angular/common';
import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {RouterOutlet} from '@angular/router';
import {FuseFullscreenComponent} from '@fuse/components/fullscreen';
import {FuseLoadingBarComponent} from '@fuse/components/loading-bar';
import {FuseNavigationService, FuseVerticalNavigationComponent} from '@fuse/components/navigation';
import {FuseMediaWatcherService} from '@fuse/services/media-watcher';
import {Navigation} from 'app/core/navigation/navigation.types';
import {MessagesComponent} from 'app/layout/common/messages/messages.component';
import {NotificationsComponent} from 'app/layout/common/notifications/notifications.component';
import {QuickChatComponent} from 'app/layout/common/quick-chat/quick-chat.component';
import {SearchComponent} from 'app/layout/common/search/search.component';
import {ShortcutsComponent} from 'app/layout/common/shortcuts/shortcuts.component';
import {UserComponent} from 'app/layout/common/user/user.component';
import {Subject, takeUntil} from 'rxjs';
import {HeaderSettings} from "../../../../modules/shared/enums/header-settings.enum";
import {HeaderService} from "../../../../modules/shared/services/header.service";
import {NavigationService} from "../../../../core/navigation/navigation.service";
import {SettingsService} from "../../../common/settings/settings.service";

@Component({
    selector     : 'thin-layout',
    templateUrl  : './thin.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    imports      : [FuseLoadingBarComponent, FuseVerticalNavigationComponent, MatButtonModule, MatIconModule, FuseFullscreenComponent, SearchComponent, ShortcutsComponent, MessagesComponent, NotificationsComponent, UserComponent, NgIf, RouterOutlet, QuickChatComponent],
})
export class ThinLayoutComponent implements OnInit, OnDestroy
{
    isScreenSmall: boolean;
    navigation: Navigation;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    headerSettingsMap: Map<HeaderSettings, boolean>;
    headerSettings = HeaderSettings;

    constructor(
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        private _navigationService: NavigationService,
        private _headerService: HeaderService,
        private _settingsService: SettingsService,
    )
    {
    }

    get currentYear(): number
    {
        return new Date().getFullYear();
    }

    ngOnInit(): void
    {
        this.headerSettingsMap = this._headerService.getHeaderSettings();
        // Subscribe to navigation data
        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) =>
            {
                this.navigation = navigation;
            });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) =>
            {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
    }

    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    toggleNavigation(name: string): void
    {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if ( navigation )
        {
            // Toggle the opened status
            navigation.toggle();
        }
    }

    protected readonly HeaderSettings = HeaderSettings;

    onClickSettings(): void {
        this._settingsService.toggle();
    }
}
