import { NgClass, NgFor } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { FuseDrawerComponent } from '@fuse/components/drawer';
import { FuseConfig, FuseConfigService, Scheme, Theme, Themes } from '@fuse/services/config';

import { Subject, takeUntil } from 'rxjs';
import { HeaderSettings } from "../../../modules/shared/enums/header-settings.enum";
import { HeaderService } from "../../../modules/shared/services/header.service";
import { SettingsService } from "./settings.service";

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styles: [
        `
          settings {
            position: static;
            display: block;
            flex: none;
            width: auto;
          }
        `,
    ],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [MatIconModule, FuseDrawerComponent, MatButtonModule, NgFor, NgClass, MatTooltipModule],
})
export class SettingsComponent implements OnInit, OnDestroy {
    config: FuseConfig;
    layout: string;
    scheme: 'dark' | 'light';
    theme: string;
    themes: Themes;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    headerSettingsMap: Map<HeaderSettings, boolean>;
    headerSettings = HeaderSettings;
    protected readonly HeaderSettings = HeaderSettings;
    @ViewChild('settingsDrawer') private _settingsDrawer: FuseDrawerComponent;

    constructor(
        private _router: Router,
        private _fuseConfigService: FuseConfigService,
        private _headerService: HeaderService,
        private _settingsService: SettingsService,
    ) {
    }

    ngOnInit(): void {
        this.headerSettingsMap = this._headerService.getHeaderSettings();
        this._settingsService.getToggle$().subscribe(() => {
            this._settingsDrawer.toggle();
        });
        this._fuseConfigService.config$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config: FuseConfig) => {
                this.config = config;
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    setLayout(layout: string): void {
        this._router.navigate([], {
            queryParams: {
                layout: null,
            },
            queryParamsHandling: 'merge',
        }).then(() => {
            // Set the config
            this._fuseConfigService.config = {layout};
        });
    }

    setScheme(scheme: Scheme): void {
        this._fuseConfigService.config = {scheme};
    }

    setTheme(theme: Theme): void {
        this._fuseConfigService.config = {theme};
    }
}
