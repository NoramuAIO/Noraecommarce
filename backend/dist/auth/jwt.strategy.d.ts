import { Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private usersService;
    constructor(usersService: UsersService);
    validate(payload: any): Promise<{
        id: number;
        email: string;
        name: string;
        avatar: string | null;
        role: string;
        status: string;
        balance: number;
        discordId: string | null;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        emailVerified: boolean;
        emailVerificationToken: string | null;
        emailVerificationExpiry: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
