#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const PRODUCTS_DIR = './products-pages';

// Check if directory exists
if (!fs.existsSync(PRODUCTS_DIR)) {
    console.error(`❌ Error: Directory not found: ${PRODUCTS_DIR}`);
    process.exit(1);
}

const files = fs.readdirSync(PRODUCTS_DIR).filter(f => f.endsWith('.html'));
console.log(`📊 Found ${files.length} product pages to update`);

if (files.length === 0) {
    console.error('❌ No HTML files found in products-pages/');
    process.exit(1);
}

let updated = 0;
let errors = 0;

files.forEach((file, index) => {
    try {
        const filePath = path.join(PRODUCTS_DIR, file);
        const oldContent = fs.readFileSync(filePath, 'utf8');
        
        // Extract existing product data
        const titleMatch = oldContent.match(/<title>([^|]+)/i);
        const priceMatch = oldContent.match(/([0-9.]+)\s*ر\.ع/i);
        const imageMatch = oldContent.match(/src=["']([^"']+)["']/i);
        
        const title = titleMatch ? titleMatch[1].trim().replace(/ \|.*/, '') : 'المنتج';
        const price = priceMatch ? priceMatch[1] : '0';
        const image = imageMatch ? imageMatch[1] : 'https://firebasestorage.googleapis.com/v0/b/ashyaatcrm.appspot.com/o/images%2FashyaatKiNjrD8C.jpg?alt=media';
        
        // Generate new template
        const newHTML = generateTemplate(title, price, image);
        fs.writeFileSync(filePath, newHTML, 'utf8');
        
        console.log(`✅ [${index + 1}/${files.length}] Updated: ${file}`);
        updated++;
    } catch (err) {
        console.error(`❌ Error updating ${file}: ${err.message}`);
        errors++;
    }
});

console.log(`\n📈 Summary:\n✅ Updated: ${updated}\n❌ Errors: ${errors}\n📊 Total: ${files.length}`);

function generateTemplate(title, price, image) {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | سوق عمان</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            color: #34495e;
            line-height: 1.6;
        }
        .container {
            max-width: 1200px;
            margin: 30px auto;
            padding: 0 20px;
        }
        .product-section {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 8px 30px rgba(0,0,0,0.08);
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            padding: 40px;
        }
        .gallery { display: flex; flex-direction: column; gap: 15px; }
        .main-image-container {
            position: relative;
            overflow: hidden;
            border-radius: 12px;
            background: #ecf0f1;
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .main-image { width: 100%; height: 100%; object-fit: contain; }
        .badge {
            position: absolute;
            top: 15px;
            right: 15px;
            background: #e74c3c;
            color: white;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
        }
        h1 { color: #2c3e50; font-size: 28px; margin: 15px 0; }
        .pricing-section {
            background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%);
            padding: 25px;
            border-radius: 12px;
            margin: 25px 0;
            border-right: 4px solid #e74c3c;
        }
        .sale-price { font-size: 42px; color: #e74c3c; font-weight: bold; }
        .action-buttons {
            display: flex;
            gap: 12px;
            margin: 30px 0;
        }
        .btn {
            flex: 1;
            padding: 14px 20px;
            border: none;
            border-radius: 10px;
            font-weight: 600;
            font-size: 15px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .btn-primary {
            background: linear-gradient(135deg, #114c7d 0%, #0a3a5c 100%);
            color: white;
        }
        .btn-primary:hover { transform: translateY(-3px); }
        .btn-whatsapp {
            background: linear-gradient(135deg, #25D366 0%, #1da851 100%);
            color: white;
        }
        @media (max-width: 768px) {
            .product-section { grid-template-columns: 1fr; gap: 25px; padding: 20px; }
            h1 { font-size: 22px; }
            .sale-price { font-size: 32px; }
            .action-buttons { flex-direction: column; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="product-section">
            <div class="gallery">
                <div class="main-image-container">
                    <div class="badge">خصم 18%</div>
                    <img src="${image}" alt="${title}" class="main-image">
                </div>
            </div>
            <div class="product-info">
                <h1>${title}</h1>
                <div class="pricing-section">
                    <span class="sale-price">${price} ر.ع</span>
                </div>
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="alert('تمت إضافة المنتج للسلة')">🛒 أضف للسلة</button>
                    <button class="btn btn-whatsapp" onclick="window.open('https://wa.me/968XXXXXXXX')">💬 اطلب عبر واتس</button>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
}
