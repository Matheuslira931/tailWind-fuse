import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HeaderSettings} from "../enums/header-settings.enum";

@Injectable({providedIn: 'root'})
export class HeaderService {
    getHeaderSettings(): Map<HeaderSettings, boolean> {
        return new Map<HeaderSettings, boolean>([
            [HeaderSettings.CHAT, environment.showHeaderChat],
            [HeaderSettings.MESSAGE, environment.showHeaderMessages],
            [HeaderSettings.SHORTCUT, environment.showHeaderShortcut],
            [HeaderSettings.SEARCH, environment.showSearchShortcut],
            [HeaderSettings.FULL_SCREEN, environment.showHeaderFullScreen]
        ]);
    }
}
