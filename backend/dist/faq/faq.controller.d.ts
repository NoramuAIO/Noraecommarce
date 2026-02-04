import { FaqService } from './faq.service';
export declare class FaqController {
    private faqService;
    constructor(faqService: FaqService);
    findAll(category?: string): Promise<{
        category: string;
        order: number;
        id: number;
        createdAt: Date;
        question: string;
        answer: string;
    }[]>;
    findOne(id: string): Promise<{
        category: string;
        order: number;
        id: number;
        createdAt: Date;
        question: string;
        answer: string;
    }>;
    create(data: any): Promise<{
        category: string;
        order: number;
        id: number;
        createdAt: Date;
        question: string;
        answer: string;
    }>;
    update(id: string, data: any): Promise<{
        category: string;
        order: number;
        id: number;
        createdAt: Date;
        question: string;
        answer: string;
    }>;
    delete(id: string): Promise<{
        category: string;
        order: number;
        id: number;
        createdAt: Date;
        question: string;
        answer: string;
    }>;
}
