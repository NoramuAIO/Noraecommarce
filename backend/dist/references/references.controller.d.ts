import { ReferencesService } from './references.service';
export declare class ReferencesController {
    private referencesService;
    constructor(referencesService: ReferencesService);
    findAll(): Promise<{
        order: number;
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        discord: string | null;
        active: boolean;
        image: string;
        website: string | null;
    }[]>;
    findAllAdmin(): Promise<{
        order: number;
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        discord: string | null;
        active: boolean;
        image: string;
        website: string | null;
    }[]>;
    findOne(id: string): Promise<{
        order: number;
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        discord: string | null;
        active: boolean;
        image: string;
        website: string | null;
    }>;
    create(data: {
        name: string;
        image: string;
        website?: string;
        discord?: string;
    }): Promise<{
        order: number;
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        discord: string | null;
        active: boolean;
        image: string;
        website: string | null;
    }>;
    update(id: string, data: any): Promise<{
        order: number;
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        discord: string | null;
        active: boolean;
        image: string;
        website: string | null;
    }>;
    delete(id: string): Promise<{
        order: number;
        id: number;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        discord: string | null;
        active: boolean;
        image: string;
        website: string | null;
    }>;
}
