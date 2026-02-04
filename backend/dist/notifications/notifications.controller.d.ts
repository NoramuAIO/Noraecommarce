import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private notificationsService;
    constructor(notificationsService: NotificationsService);
    testNotification(body: {
        platform: 'discord' | 'telegram';
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
