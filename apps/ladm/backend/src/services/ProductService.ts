import { models } from '../models/models';
import { Product, ProductVariant, ProductCreationAttributes } from '@monorepo/shared-types';

export class ProductService {
    static async getAllProducts(): Promise<Product[]> {
        try {
            const products = await models.product.findAll({
                raw: true,
            });

            return products;
        } catch (error) {
            console.error('Erreur lors de la récupération des produits:', error);
            throw new Error('Impossible de récupérer les produits');
        }
    }

    static async getAvailableProducts(): Promise<Product[]> {
        try {
            const products = await models.product.findAll({
                include: [
                    {
                        model: models.productVariant,
                        as: 'variants',
                        where: { status: 'available' },
                        required: true,
                    },
                ],
            });

            return products.map((p) => p.get({ plain: true }));
        } catch (error) {
            console.error('Erreur lors de la récupération des produits disponibles:', error);
            throw new Error('Impossible de récupérer les produits disponibles');
        }
    }

    static async getAvailableProductsWithVariants(): Promise<any[]> {
        try {
            const products = await models.product.findAll({
                include: [
                    {
                        model: models.productVariant,
                        as: 'variants',
                        where: { status: 'available' },
                        required: true,
                        include: [
                            {
                                model: models.productVariantImage,
                                as: 'image',
                                attributes: ['imageBase64'],
                            },
                        ],
                    },
                ],
            });

            return products.map((p) => {
                const plain = p.get({ plain: true });
                const firstVariant = plain.variants?.[0];
                const preview = firstVariant?.image?.imageBase64 || null;

                const { variants, ...productWithoutVariants } = plain;
                return {
                    ...productWithoutVariants,
                    preview,
                };
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des produits disponibles:', error);
            throw new Error('Impossible de récupérer les produits disponibles');
        }
    }

    static async getProductById(productId: string): Promise<Product | null> {
        try {
            const product = await models.product.findByPk(productId, {
                raw: true,
            });

            return product;
        } catch (error) {
            console.error('Erreur lors de la récupération du produit:', error);
            throw new Error('Impossible de récupérer le produit');
        }
    }

    static async getProductWithVariants(
        productId: string,
        onlyAvailable: boolean = false,
    ): Promise<(Product & { variants: ProductVariant[] }) | null> {
        try {
            const includeOptions: any = {
                model: models.productVariant,
                as: 'variants',
                include: [
                    {
                        model: models.productVariantImage,
                        as: 'image',
                        attributes: ['imageBase64'],
                    },
                ],
            };

            if (onlyAvailable) {
                includeOptions.where = { status: 'available' };
            }

            const product = await models.product.findByPk(productId, {
                include: [includeOptions],
            });

            if (!product) {
                return null;
            }

            const plain = product.get({ plain: true });
            const mappedVariants = (plain.variants || []).map((v: any) => ({
                ...v,
                imageBase64: v.image?.imageBase64,
            }));

            return {
                ...plain,
                variants: mappedVariants,
            } as any;
        } catch (error) {
            console.error('Erreur lors de la récupération du produit avec variantes:', error);
            throw new Error('Impossible de récupérer le produit avec variantes');
        }
    }

    static async createProduct(productData: ProductCreationAttributes): Promise<Product> {
        try {
            const product = await models.product.create(productData);
            return product.get({ plain: true });
        } catch (error) {
            console.error('Erreur lors de la création du produit:', error);
            throw new Error('Impossible de créer le produit');
        }
    }

    static async updateProduct(
        productId: string,
        productData: Partial<ProductCreationAttributes>,
    ): Promise<Product | null> {
        try {
            const product = await models.product.findByPk(productId);

            if (!product) {
                return null;
            }

            await product.update(productData);
            return product.get({ plain: true });
        } catch (error) {
            console.error('Erreur lors de la mise à jour du produit:', error);
            throw new Error('Impossible de mettre à jour le produit');
        }
    }

    static async deleteProduct(productId: string): Promise<boolean> {
        try {
            const product = await models.product.findByPk(productId);

            if (!product) {
                return false;
            }

            // Supprimer d'abord toutes les variantes associées
            await models.productVariant.destroy({
                where: { productId },
            });

            // Puis supprimer le produit
            await product.destroy();
            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression du produit:', error);
            throw new Error('Impossible de supprimer le produit');
        }
    }
}
