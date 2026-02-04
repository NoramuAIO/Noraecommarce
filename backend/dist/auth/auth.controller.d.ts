import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: {
        email: string;
        password: string;
        name: string;
    }): Promise<{
        user: any;
        token: string;
        message: string;
    }>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        user: any;
        token: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    resendVerification(body: {
        email: string;
    }): Promise<{
        message: string;
    }>;
    forgotPassword(body: {
        email: string;
    }): Promise<{
        message: string;
    }>;
    resetPassword(body: {
        token: string;
        password: string;
    }): Promise<{
        message: string;
    }>;
    getProfile(req: any): Promise<any>;
}
