import { models } from '../models/models';
import {
    ProductVariant,
    ProductVariantCreationAttributes,
    ProductVariantStatus,
} from '@monorepo/shared-types';

export class ProductVariantService {
    // Récupérer toutes les variantes d'un produit
    static async getVariantsByProductId(productId: string): Promise<ProductVariant[]> {
        try {
            const variants = await models.productVariant.findAll({
                where: { productId },
                include: [{
                    model: models.productVariantImage,
                    as: 'image',
                    attributes: ['imageBase64']
                }]
            });

            return variants.map(v => {
                const plain = v.get({ plain: true });
                return {
                    ...plain,
                    imageBase64: plain.image?.imageBase64
                };
            }) as ProductVariant[];
        } catch (error) {
            console.error('Erreur lors de la récupération des variantes:', error);
            throw new Error('Impossible de récupérer les variantes');
        }
    }

    // Récupérer une variante par son ID
    static async getVariantById(variantId: string): Promise<ProductVariant | null> {
        try {
            const variant = await models.productVariant.findByPk(variantId, {
                include: [{
                    model: models.productVariantImage,
                    as: 'image',
                    attributes: ['imageBase64']
                }]
            });

            if (!variant) return null;

            const plain = variant.get({ plain: true });
            return {
                ...plain,
                imageBase64: plain.image?.imageBase64
            } as ProductVariant;
        } catch (error) {
            console.error('Erreur lors de la récupération de la variante:', error);
            throw new Error('Impossible de récupérer la variante');
        }
    }

    // Créer une nouvelle variante
    static async createVariant(
        variantData: ProductVariantCreationAttributes,
    ): Promise<ProductVariant> {
        try {
            const { imageBase64, ...rest } = variantData as any;
            const variant = await models.productVariant.create(rest);
            
            if (imageBase64) {
                await models.productVariantImage.create({
                    variantId: variant.id,
                    imageBase64
                });
            }

            return this.getVariantById(variant.id) as Promise<ProductVariant>;
        } catch (error) {
            console.error('Erreur lors de la création de la variante:', error);
            throw new Error('Impossible de créer la variante');
        }
    }

    // Mettre à jour une variante
    static async updateVariant(
        variantId: string,
        variantData: Partial<ProductVariantCreationAttributes>,
    ): Promise<ProductVariant | null> {
        try {
            const variant = await models.productVariant.findByPk(variantId);

            if (!variant) {
                return null;
            }

            const { imageBase64, ...rest } = variantData as any;
            await variant.update(rest);

            if (imageBase64 !== undefined) {
                if (imageBase64 === null) {
                    await models.productVariantImage.destroy({ where: { variantId } });
                } else {
                    const [image, created] = await models.productVariantImage.findOrCreate({
                        where: { variantId },
                        defaults: { variantId, imageBase64 }
                    });
                    if (!created) {
                        await image.update({ imageBase64 });
                    }
                }
            }

            return this.getVariantById(variantId);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la variante:', error);
            throw new Error('Impossible de mettre à jour la variante');
        }
    }

    // Supprimer une variante
    static async deleteVariant(variantId: string): Promise<boolean> {
        try {
            const variant = await models.productVariant.findByPk(variantId);

            if (!variant) {
                return false;
            }

            await variant.destroy();
            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression de la variante:', error);
            throw new Error('Impossible de supprimer la variante');
        }
    }

    // Mettre à jour le statut d'une variante
    static async updateStatus(
        variantId: string,
        status: ProductVariantStatus,
    ): Promise<ProductVariant | null> {
        try {
            const variant = await models.productVariant.findByPk(variantId);

            if (!variant) {
                return null;
            }

            await variant.update({ status });

            return variant.get({ plain: true });
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut:', error);
            throw new Error('Impossible de mettre à jour le statut');
        }
    }

    // Vérifier la disponibilité du stock
    static async checkStockAvailability(
        variantId: string,
        requestedQuantity: number,
    ): Promise<{ available: boolean; currentStock: number }> {
        try {
            const variant = await models.productVariant.findByPk(variantId, { raw: true });

            if (!variant) {
                return { available: false, currentStock: 0 };
            }

            return {
                available: variant.stock >= requestedQuantity,
                currentStock: variant.stock,
            };
        } catch (error) {
            console.error('Erreur lors de la vérification du stock:', error);
            throw new Error('Impossible de vérifier le stock');
        }
    }

    // Décrémenter le stock d'une variante
    static async decrementStock(
        variantId: string,
        quantity: number,
    ): Promise<ProductVariant | null> {
        try {
            const variant = await models.productVariant.findByPk(variantId);

            if (!variant) {
                return null;
            }

            const newStock = Math.max(0, variant.stock - quantity);
            const newStatus: ProductVariantStatus = newStock > 0 ? 'available' : 'sold';

            await variant.update({ stock: newStock, status: newStatus });

            return variant.get({ plain: true });
        } catch (error) {
            console.error('Erreur lors de la décrémentation du stock:', error);
            throw new Error('Impossible de décrémenter le stock');
        }
    }

    // Incrémenter le stock d'une variante
    static async incrementStock(
        variantId: string,
        quantity: number,
    ): Promise<ProductVariant | null> {
        try {
            const variant = await models.productVariant.findByPk(variantId);

            if (!variant) {
                return null;
            }

            const newStock = variant.stock + quantity;
            const newStatus: ProductVariantStatus = newStock > 0 ? 'available' : 'sold';

            await variant.update({ stock: newStock, status: newStatus });

            return variant.get({ plain: true });
        } catch (error) {
            console.error("Erreur lors de l'incrémentation du stock:", error);
            throw new Error("Impossible d'incrémenter le stock");
        }
    }
}
