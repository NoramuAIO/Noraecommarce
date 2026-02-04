import { TestimonialsService } from './testimonials.service';
export declare class TestimonialsController {
    private testimonialsService;
    constructor(testimonialsService: TestimonialsService);
    findAll(): Promise<{
        order: number;
        id: number;
        name: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        rating: number;
        content: string;
    }[]>;
    findAllAdmin(): Promise<{
        order: number;
        id: number;
        name: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        rating: number;
        content: string;
    }[]>;
    create(data: {
        name: string;
        role: string;
        content: string;
        rating: number;
    }): Promise<{
        order: number;
        id: number;
        name: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        rating: number;
        content: string;
    }>;
    update(id: string, data: any): Promise<{
        order: number;
        id: number;
        name: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        rating: number;
        content: string;
    }>;
    delete(id: string): Promise<{
        order: number;
        id: number;
        name: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        rating: number;
        content: string;
    }>;
}
