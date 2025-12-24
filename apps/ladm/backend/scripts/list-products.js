/**
 * Script pour lister tous les produits avec leurs variantes
 * 
 * Usage:
 *   node scripts/list-products.js
 */

const axios = require('axios');

// Configuration
const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';

/**
 * Récupère tous les produits
 */
async function getProducts() {
    try {
        const response = await axios.get(`${API_BASE_URL}/products`);
        return response.data.items || [];
    } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error.message);
        process.exit(1);
    }
}

/**
 * Récupère les variantes d'un produit
 */
async function getProductVariants(productId) {
    try {
        const response = await axios.get(`${API_BASE_URL}/products/${productId}/variants`);
        return response.data.items || [];
    } catch (error) {
        return [];
    }
}

/**
 * Fonction principale
 */
async function main() {
    console.log('\n📦 Liste des produits et leurs variantes');
    console.log('═══════════════════════════════════════\n');
    
    const products = await getProducts();
    
    if (products.length === 0) {
        console.log('Aucun produit trouvé.\n');
        return;
    }
    
    for (const product of products) {
        console.log(`\n🏷️  ${product.name}`);
        console.log(`   ID: ${product.id}`);
        console.log(`   Prix: ${product.price} €`);
        console.log(`   Catégorie: ${product.categoryId}`);
        
        const variants = await getProductVariants(product.id);
        
        if (variants.length === 0) {
            console.log('   ℹ️  Aucune variante');
        } else {
            console.log(`   🎨 ${variants.length} variante(s):`);
            
            for (const variant of variants) {
                const status = variant.isAvailable ? '✅' : '❌';
                const hasImage = variant.imageBase64 ? '🖼️ ' : '   ';
                console.log(`      ${status} ${hasImage}${variant.name} (Stock: ${variant.stock})`);
            }
        }
    }
    
    console.log('\n');
}

// Exécuter le script
main().catch(error => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
});

