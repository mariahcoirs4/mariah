import { Request, Response, NextFunction } from 'express';
export declare const uploadProductImages: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
declare class ProductController {
    getAllProducts: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getCategories: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getProductById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createProduct: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateProduct: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteProduct: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export declare const productController: ProductController;
export {};
