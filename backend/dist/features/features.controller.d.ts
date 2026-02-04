import { FeaturesService } from './features.service';
export declare class FeaturesController {
    private featuresService;
    constructor(featuresService: FeaturesService);
    findAll(): Promise<{
        order: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        description: string;
        icon: string;
        title: string;
        color: string;
    }[]>;
    findAllAdmin(): Promise<{
        order: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        description: string;
        icon: string;
        title: string;
        color: string;
    }[]>;
    create(data: {
        title: string;
        description: string;
        icon: string;
        color: string;
    }): Promise<{
        order: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        description: string;
        icon: string;
        title: string;
        color: string;
    }>;
    update(id: string, data: any): Promise<{
        order: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        description: string;
        icon: string;
        title: string;
        color: string;
    }>;
    delete(id: string): Promise<{
        order: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        description: string;
        icon: string;
        title: string;
        color: string;
    }>;
}
