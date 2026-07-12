export declare class ProductRepository {
    findAll(status?: string): Promise<{
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: string;
        sku: string;
        moq: string;
        description: string;
        images: string;
        specs: string;
    }[]>;
    findById(id: number): Promise<{
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: string;
        sku: string;
        moq: string;
        description: string;
        images: string;
        specs: string;
    } | null>;
    create(data: {
        name: string;
        sku: string;
        category: string;
        moq: string;
        status: string;
        description: string;
        images: string;
        specs: string;
    }): Promise<{
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: string;
        sku: string;
        moq: string;
        description: string;
        images: string;
        specs: string;
    }>;
    update(id: number, data: {
        name?: string;
        sku?: string;
        category?: string;
        moq?: string;
        status?: string;
        description?: string;
        images?: string;
        specs?: string;
    }): Promise<{
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: string;
        sku: string;
        moq: string;
        description: string;
        images: string;
        specs: string;
    }>;
    delete(id: number): Promise<{
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        category: string;
        sku: string;
        moq: string;
        description: string;
        images: string;
        specs: string;
    }>;
    getDistinctCategories(): Promise<string[]>;
}
export declare const productRepository: ProductRepository;
