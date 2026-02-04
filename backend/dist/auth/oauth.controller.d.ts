import { Response } from 'express';
import { AuthService } from './auth.service';
import { SettingsService } from '../settings/settings.service';
export declare class OAuthController {
    private authService;
    private settingsService;
    constructor(authService: AuthService, settingsService: SettingsService);
    googleAuth(res: Response): Promise<void>;
    googleCallback(code: string, res: Response): Promise<void>;
    discordAuth(res: Response): Promise<void>;
    discordCallback(code: string, res: Response): Promise<void>;
}
