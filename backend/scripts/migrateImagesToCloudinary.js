import 'dotenv/config';
import cloudinary from '../middleware/upload.js';
import db from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ASSETS_PATH = path.join(__dirname, '../../frontend/public/assets');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function migrateImages() {
    console.log('\n=== Cloudinary Image Migration Script ===\n');

    try {
        // Get all local image paths from database
        const [rows] = await db.query(`
            SELECT id, product_id, image_url
            FROM product_images
            WHERE image_url LIKE '/assets/%' OR image_url LIKE 'assets/%'
        `);

        if (rows.length === 0) {
            console.log('✓ No images to migrate. All images already use external URLs.');
            rl.close();
            return;
        }

        console.log(`Found ${rows.length} images to migrate:\n`);

        // Show sample
        rows.slice(0, 5).forEach(row => {
            console.log(`  - ID ${row.id}: ${row.image_url}`);
        });
        if (rows.length > 5) {
            console.log(`  ... and ${rows.length - 5} more`);
        }

        console.log('\nThis will:');
        console.log('  1. Upload each image to Cloudinary');
        console.log('  2. Update database with new Cloudinary URLs');
        console.log('  3. Create migration-log.json with results');
        console.log('\nOriginal images in frontend/public/assets/ will NOT be deleted.\n');

        const answer = await question('Proceed with migration? (Y/N): ');

        if (answer.toUpperCase() !== 'Y') {
            console.log('\n✗ Migration cancelled by user.');
            rl.close();
            return;
        }

        console.log('\n--- Starting Migration ---\n');

        const migrationLog = [];
        let successCount = 0;

        // Process each image
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const imageUrl = row.image_url;
            const filename = imageUrl.replace(/^\/?(assets\/)?/, '');
            const localPath = path.join(ASSETS_PATH, filename);

            console.log(`[${i + 1}/${rows.length}] Processing: ${filename}`);

            try {
                // Check file exists
                if (!fs.existsSync(localPath)) {
                    throw new Error(`File not found: ${localPath}`);
                }

                // Upload to Cloudinary
                console.log(`  → Uploading to Cloudinary...`);
                const result = await cloudinary.uploader.upload(localPath, {
                    folder: 'ezshop-products',
                    public_id: path.parse(filename).name,
                    overwrite: false,
                    resource_type: 'image'
                });

                const cloudinaryUrl = result.secure_url;
                console.log(`  ✓ Uploaded: ${cloudinaryUrl}`);

                // Update database
                console.log(`  → Updating database...`);
                await db.query(
                    'UPDATE product_images SET image_url = ? WHERE id = ?',
                    [cloudinaryUrl, row.id]
                );
                console.log(`  ✓ Database updated\n`);

                migrationLog.push({
                    id: row.id,
                    product_id: row.product_id,
                    old_url: imageUrl,
                    new_url: cloudinaryUrl,
                    status: 'success',
                    timestamp: new Date().toISOString()
                });

                successCount++;

            } catch (error) {
                console.error(`  ✗ ERROR: ${error.message}\n`);

                migrationLog.push({
                    id: row.id,
                    product_id: row.product_id,
                    old_url: imageUrl,
                    new_url: null,
                    status: 'error',
                    error: error.message,
                    timestamp: new Date().toISOString()
                });

                // Stop immediately on error
                console.log('\n✗ Migration stopped due to error.');
                console.log('Fix the issue and run the script again.\n');
                break;
            }
        }

        // Save log
        const logPath = path.join(__dirname, '../migration-log.json');
        fs.writeFileSync(logPath, JSON.stringify(migrationLog, null, 2));
        console.log(`\n--- Migration Log: ${logPath} ---\n`);

        // Summary
        console.log('=== Migration Summary ===');
        console.log(`✓ Successful: ${successCount}`);
        console.log(`✗ Failed: ${rows.length - successCount}`);
        console.log(`Total: ${rows.length}\n`);

        if (successCount === rows.length) {
            console.log('✓ All images migrated successfully!\n');
        }

    } catch (error) {
        console.error('\n✗ Migration failed:', error.message);
        console.error(error.stack);
    } finally {
        rl.close();
        process.exit(0);
    }
}

migrateImages();
