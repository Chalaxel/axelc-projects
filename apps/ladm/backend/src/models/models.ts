import { CategoryModel } from './categories.model';
import { ProductModel } from './products.model';
import { ProductVariantModel } from './product-variants.model';
import { OrderModel } from './orders.model';
import { OrderItemModel } from './order-items.model';
import { NotificationModel } from './notifications.model';
import { ArticleModel } from './articles.model';
import { PageModel } from './pages.model';
import { ProductVariantImageModel } from './product-variant-images.model';

enum Models {
    CATEGORY = 'category',
    PRODUCT = 'product',
    PRODUCT_VARIANT = 'productVariant',
    ORDER = 'order',
    ORDER_ITEM = 'orderItem',
    NOTIFICATION = 'notification',
    ARTICLE = 'article',
    PAGE = 'page',
    PRODUCT_VARIANT_IMAGE = 'productVariantImage',
}

// Définir les associations
ProductModel.hasMany(ProductVariantModel, {
    sourceKey: 'id',
    foreignKey: 'productId',
    as: 'variants',
});

ProductVariantModel.belongsTo(ProductModel, {
    targetKey: 'id',
    foreignKey: 'productId',
    as: 'product',
});

// Association 1:1 entre Variant et Image
ProductVariantModel.hasOne(ProductVariantImageModel, {
    sourceKey: 'id',
    foreignKey: 'variantId',
    as: 'image',
});

ProductVariantImageModel.belongsTo(ProductVariantModel, {
    targetKey: 'id',
    foreignKey: 'variantId',
    as: 'variant',
});

// Associations Order <-> OrderItem
OrderModel.hasMany(OrderItemModel, {
    sourceKey: 'id',
    foreignKey: 'orderId',
    as: 'items',
});

OrderItemModel.belongsTo(OrderModel, {
    targetKey: 'id',
    foreignKey: 'orderId',
    as: 'order',
});

// Associations OrderItem <-> Product
OrderItemModel.belongsTo(ProductModel, {
    targetKey: 'id',
    foreignKey: 'productId',
    as: 'product',
});

// Associations OrderItem <-> ProductVariant
OrderItemModel.belongsTo(ProductVariantModel, {
    targetKey: 'id',
    foreignKey: 'variantId',
    as: 'variant',
});

// Associations Order <-> Notification
OrderModel.hasMany(NotificationModel, {
    sourceKey: 'id',
    foreignKey: 'orderId',
    as: 'notifications',
});

NotificationModel.belongsTo(OrderModel, {
    targetKey: 'id',
    foreignKey: 'orderId',
    as: 'order',
});

export const models = {
    [Models.CATEGORY]: CategoryModel,
    [Models.PRODUCT]: ProductModel,
    [Models.PRODUCT_VARIANT]: ProductVariantModel,
    [Models.ORDER]: OrderModel,
    [Models.ORDER_ITEM]: OrderItemModel,
    [Models.NOTIFICATION]: NotificationModel,
    [Models.ARTICLE]: ArticleModel,
    [Models.PAGE]: PageModel,
    [Models.PRODUCT_VARIANT_IMAGE]: ProductVariantImageModel,
};
