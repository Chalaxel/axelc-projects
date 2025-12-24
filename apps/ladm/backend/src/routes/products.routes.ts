import { Request } from 'express';
import { Method } from '../types';
import { ProductService } from '../services/ProductService';
import { ProductVariantService } from '../services/ProductVariantService';

export const productRoutes = [
    {
        path: '/',
        method: Method.GET,
        handler: async (req: Request) => {
            const includeVariants = req.query.includeVariants === 'true';
            if (includeVariants) {
                return ProductService.getAvailableProductsWithVariants();
            }
            return ProductService.getAvailableProducts();
        },
    },
    {
        path: '/all',
        method: Method.GET,
        handler: async (req: Request) => {
            return ProductService.getAllProducts();
        },
    },
    {
        path: '/',
        method: Method.POST,
        handler: async (req: Request) => {
            return ProductService.createProduct(req.body);
        },
    },
    {
        path: '/:productId',
        method: Method.GET,
        handler: async (req: Request) => {
            const { productId } = req.params;
            const includeVariants = req.query.includeVariants === 'true';
            const onlyAvailable = req.query.onlyAvailable !== 'false';

            if (includeVariants) {
                return ProductService.getProductWithVariants(productId, onlyAvailable);
            }
            return ProductService.getProductById(productId);
        },
    },
    {
        path: '/:productId',
        method: Method.PUT,
        handler: async (req: Request) => {
            const { productId } = req.params;
            return ProductService.updateProduct(productId, req.body);
        },
    },
    {
        path: '/:productId',
        method: Method.DELETE,
        handler: async (req: Request) => {
            const { productId } = req.params;
            const success = await ProductService.deleteProduct(productId);
            return { success };
        },
    },
    {
        path: '/:productId/variants',
        method: Method.GET,
        handler: async (req: Request) => {
            const { productId } = req.params;
            return ProductVariantService.getVariantsByProductId(productId);
        },
    },
    {
        path: '/variants/:variantId',
        method: Method.GET,
        handler: async (req: Request) => {
            const { variantId } = req.params;
            return ProductVariantService.getVariantById(variantId);
        },
    },
    {
        path: '/:productId/variants',
        method: Method.POST,
        handler: async (req: Request) => {
            const { productId } = req.params;
            const variantData = {
                ...req.body,
                productId,
            };
            return ProductVariantService.createVariant(variantData);
        },
    },
    {
        path: '/variants/:variantId',
        method: Method.PUT,
        handler: async (req: Request) => {
            const { variantId } = req.params;
            return ProductVariantService.updateVariant(variantId, req.body);
        },
    },
    {
        path: '/variants/:variantId',
        method: Method.DELETE,
        handler: async (req: Request) => {
            const { variantId } = req.params;
            const success = await ProductVariantService.deleteVariant(variantId);
            return { success };
        },
    },
    {
        path: '/variants/:variantId/status',
        method: Method.PATCH,
        handler: async (req: Request) => {
            const { variantId } = req.params;
            const { status } = req.body;
            return ProductVariantService.updateStatus(variantId, status);
        },
    },
];
