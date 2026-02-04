export declare class MailService {
    private transporter;
    constructor();
    sendMail(to: string, subject: string, html: string): Promise<void>;
    sendOrderConfirmation(user: {
        email: string;
        name: string;
    }, order: {
        orderNumber: string;
        amount: number;
        product: {
            name: string;
        };
    }): Promise<void>;
    sendTicketCreated(user: {
        email: string;
        name: string;
    }, ticket: {
        id: number;
        subject: string;
    }): Promise<void>;
    sendTicketReply(user: {
        email: string;
        name: string;
    }, ticket: {
        id: number;
        subject: string;
    }, replyMessage: string): Promise<void>;
    sendTestEmail(to: string): Promise<void>;
    sendWelcome(user: {
        email: string;
        name: string;
    }): Promise<void>;
    sendPasswordReset(user: {
        email: string;
        name: string;
    }, resetToken: string): Promise<void>;
    sendEmailVerification(user: {
        email: string;
        name: string;
    }, verificationToken: string): Promise<void>;
}
