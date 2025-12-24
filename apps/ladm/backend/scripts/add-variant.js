/**
 * Script pour ajouter une variante à un produit
 * 
 * Usage:
 *   node scripts/add-variant.js <productId> <variantName> <imagePath> <stock>
 * 
 * Exemple:
 *   node scripts/add-variant.js "uuid-du-produit" "Coloris Bleu" "./images/bleu.jpg" 20
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Configuration
const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';

/**
 * Convertit une image en base64
 */
function imageToBase64(imagePath) {
    try {
        const absolutePath = path.resolve(imagePath);
        const bitmap = fs.readFileSync(absolutePath);
        const ext = path.extname(imagePath).toLowerCase();
        
        // Déterminer le MIME type
        let mimeType = 'image/jpeg';
        if (ext === '.png') mimeType = 'image/png';
        if (ext === '.gif') mimeType = 'image/gif';
        if (ext === '.webp') mimeType = 'image/webp';
        
        const base64 = Buffer.from(bitmap).toString('base64');
        return `data:${mimeType};base64,${base64}`;
    } catch (error) {
        console.error('Erreur lors de la lecture de l\'image:', error.message);
        process.exit(1);
    }
}

/**
 * Crée une variante via l'API
 */
async function createVariant(productId, variantData) {
    try {
        const url = `${API_BASE_URL}/products/${productId}/variants`;
        console.log(`Envoi de la requête à: ${url}`);
        
        const response = await axios.post(url, variantData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Erreur API:', error.response.status, error.response.data);
        } else {
            console.error('Erreur:', error.message);
        }
        process.exit(1);
    }
}

/**
 * Fonction principale
 */
async function main() {
    // Vérifier les arguments
    const args = process.argv.slice(2);
    
    if (args.length < 4) {
        console.error(`
Usage: node scripts/add-variant.js <productId> <variantName> <imagePath> <stock>

Arguments:
  productId    - UUID du produit
  variantName  - Nom de la variante (ex: "Coloris Bleu Marine")
  imagePath    - Chemin vers l'image (ex: "./images/bleu.jpg")
  stock        - Nombre d'unités en stock (ex: 20)

Exemple:
  node scripts/add-variant.js "d696bc88-eb90-4f2b-b086-fe50ea38a3d0" "Coloris Bleu" "./images/bleu.jpg" 20
        `);
        process.exit(1);
    }
    
    const [productId, variantName, imagePath, stock] = args;
    
    console.log('\n🎨 Création d\'une nouvelle variante');
    console.log('═══════════════════════════════════\n');
    console.log(`Produit ID:   ${productId}`);
    console.log(`Nom:          ${variantName}`);
    console.log(`Image:        ${imagePath}`);
    console.log(`Stock:        ${stock}\n`);
    
    // Vérifier que l'image existe
    if (!fs.existsSync(imagePath)) {
        console.error(`❌ Erreur: L'image "${imagePath}" n'existe pas`);
        process.exit(1);
    }
    
    // Obtenir la taille du fichier
    const stats = fs.statSync(imagePath);
    const fileSizeInMB = stats.size / (1024 * 1024);
    console.log(`📁 Taille de l'image: ${fileSizeInMB.toFixed(2)} MB`);
    
    if (fileSizeInMB > 2) {
        console.warn(`⚠️  Attention: L'image est volumineuse (> 2MB). Considérez la compression.`);
    }
    
    // Convertir l'image en base64
    console.log('🔄 Conversion de l\'image en base64...');
    const imageBase64 = imageToBase64(imagePath);
    const base64SizeInMB = (imageBase64.length * 0.75) / (1024 * 1024); // Approximation
    console.log(`📦 Taille base64: ${base64SizeInMB.toFixed(2)} MB\n`);
    
    // Créer la variante
    const variantData = {
        name: variantName,
        imageBase64: imageBase64,
        stock: parseInt(stock, 10),
        isAvailable: true
    };
    
    console.log('🚀 Envoi de la variante au serveur...');
    const result = await createVariant(productId, variantData);
    
    console.log('\n✅ Variante créée avec succès!\n');
    console.log('Détails:');
    console.log('────────');
    console.log(`ID:           ${result.id}`);
    console.log(`Nom:          ${result.name}`);
    console.log(`Stock:        ${result.stock}`);
    console.log(`Disponible:   ${result.isAvailable ? 'Oui' : 'Non'}`);
    console.log(`Créée le:     ${new Date(result.createdAt).toLocaleString('fr-FR')}\n`);
}

// Exécuter le script
main().catch(error => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
});

