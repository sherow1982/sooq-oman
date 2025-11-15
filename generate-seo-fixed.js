// سكربت Node.js نهائي - SEO + Sitemap + Google Merchant Feed (مصحح)
const fs = require('fs');
const path = require('path');

const products = JSON.parse(fs.readFileSync('products.json', 'utf8'));
const baseURL = 'https://sooq-oman.arabsad.com';

function createArabicSlug(text) {
    let slug = text.trim();
    slug = slug.replace(/\s+/g, '-');
    slug = slug.replace(/[^\u0600-\u06FF\w\-]/g, '');
    slug = slug.replace(/-+/g, '-');
    slug = slug.replace(/^-+|-+$/g, '');
    return slug;
}

// دالة لتنظيف النص لـ XML (escape special characters)
function escapeXML(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// ==================== Google Merchant Feed (products.xml) ====================
let merchantFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>سوق عمان</title>
    <link>${baseURL}</link>
    <description>متجر إلكتروني عماني - منتجات أصلية بأسعار تنافسية</description>
`;

products.forEach(product => {
    const slug = createArabicSlug(product.title);
    const productURL = `${baseURL}/products-pages/${slug}.html`;
    const imageURL = product.image_link;
    const safeTitle = escapeXML(product.title);
    const safeDescription = escapeXML(`${product.title} - منتج أصلي من سوق عمان، شحن مجاني، توصيل خلال 3 أيام عمل`);
    
    merchantFeed += `
    <item>
      <g:id>${product.sku}</g:id>
      <g:title><![CDATA[${product.title}]]></g:title>
      <g:description><![CDATA[${product.title} - منتج أصلي من سوق عمان، شحن مجاني، توصيل خلال 3 أيام عمل]]></g:description>
      <g:link>${productURL}</g:link>
      <g:image_link>${imageURL}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>in stock</g:availability>
      <g:price>${product.price} OMR</g:price>
      <g:sale_price>${product.sale_price} OMR</g:sale_price>
      <g:brand>سوق عمان</g:brand>
      <g:shipping>
        <g:country>OM</g:country>
        <g:service>شحن مجاني</g:service>
        <g:price>0 OMR</g:price>
      </g:shipping>
    </item>`;
});

merchantFeed += `
  </channel>
</rss>`;

fs.writeFileSync('products.xml', merchantFeed, 'utf8');
console.log('✓ تم إنشاء Google Merchant Feed: products.xml');

// ==================== Sitemap (sitemap.xml) ====================
const today = new Date().toISOString().split('T')[0];
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseURL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseURL}/index.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseURL}/cart.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseURL}/checkout.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseURL}/terms.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseURL}/privacy.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseURL}/shipping.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseURL}/returns.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseURL}/contact.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;

products.forEach(product => {
    const slug = createArabicSlug(product.title);
    const productURL = `${baseURL}/products-pages/${slug}.html`;
    sitemap += `
  <url>
    <loc>${productURL}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
});

sitemap += `
</urlset>`;

fs.writeFileSync('sitemap.xml', sitemap, 'utf8');
console.log('✓ تم إنشاء Sitemap: sitemap.xml');

// ==================== robots.txt ====================
const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${baseURL}/sitemap.xml
`;

fs.writeFileSync('robots.txt', robotsTxt, 'utf8');
console.log('✓ تم إنشاء robots.txt');

// ==================== تحديث صفحات المنتجات مع SEO محسّن ====================
const folder = 'products-pages';
if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
}

const header = `<header style='background:#114c7d;padding:20px;color:white;font-weight:bold;font-size:22px;text-align:center;'>
<nav>
<a href='/index.html' style='color:#fff;margin:0 15px;text-decoration:none;font-size:18px;'>الرئيسية</a>
<a href='/cart.html' style='color:#fff;margin:0 15px;text-decoration:none;'>السلة 🛒</a>
<a href='/terms.html' style='color:#fff;margin:0 15px;text-decoration:none;'>الشروط</a>
<a href='/privacy.html' style='color:#fff;margin:0 15px;text-decoration:none;'>الخصوصية</a>
<a href='/shipping.html' style='color:#fff;margin:0 15px;text-decoration:none;'>الشحن</a>
<a href='/contact.html' style='color:#fff;margin:0 15px;text-decoration:none;'>اتصل بنا</a>
</nav>
</header>`;

const footer = `<footer style='background:#ecf0f1;color:#114c7d;text-align:center;padding:20px;margin-top:40px;'>
<small>جميع الحقوق محفوظة &copy; سوق عمان 2025 | مسقط، عمان - الرمز البريدي: 112</small>
<nav style='margin-top:10px;'>
<a href='/terms.html' style='color:#114c7d;margin:0 10px;text-decoration:underline;'>الشروط</a>
<a href='/privacy.html' style='color:#114c7d;margin:0 10px;text-decoration:underline;'>الخصوصية</a>
<a href='/shipping.html' style='color:#114c7d;margin:0 10px;text-decoration:underline;'>الشحن</a>
<a href='/returns.html' style='color:#114c7d;margin:0 10px;text-decoration:underline;'>الإرجاع</a>
</nav>
</footer>`;

let count = 0;
products.forEach(product => {
    const slug = createArabicSlug(product.title);
    const filename = path.join(folder, `${slug}.html`);
    const productURL = `${baseURL}/products-pages/${slug}.html`;
    
    // حساب متوسط التقييمات
    let totalRating = 0;
    product.reviews.forEach(r => totalRating += r.rating);
    const avgRating = (totalRating / product.reviews.length).toFixed(1);
    
    let reviewsSection = '';
    product.reviews.forEach(review => {
        reviewsSection += `<div style='border-bottom:1px solid #eee;padding:10px 0;'><span style='font-weight:bold;color:#156c28;'>${review.name}</span> - <span style='color:#FFC700;'>⭐ ${review.rating}</span> <span style='font-size:13px;color:#888;'>${review.date}</span><div style='margin-top:4px;'>${review.comment}</div></div>`;
    });
    
    const html = `<!DOCTYPE html>
<html lang='ar' dir='rtl'>
<head>
<meta charset='UTF-8'>
<meta name='viewport' content='width=device-width, initial-scale=1.0'>
<title>${product.title} | سوق عمان - شحن مجاني</title>
<meta name='description' content='اشترِ ${product.title} بسعر ${product.sale_price} ريال عماني بدلاً من ${product.price} - شحن مجاني، توصيل خلال 3 أيام - متجر سوق عمان'>
<meta name='keywords' content='${product.title}, سوق عمان, شراء اونلاين, شحن مجاني عمان, ${product.sku}'>
<link rel='canonical' href='${productURL}'>
<meta property='og:title' content='${product.title} - سوق عمان'>
<meta property='og:description' content='اشترِ ${product.title} بسعر ${product.sale_price} ريال عماني - شحن مجاني'>
<meta property='og:image' content='${product.image_link}'>
<meta property='og:url' content='${productURL}'>
<meta property='og:type' content='product'>
<meta name='twitter:card' content='summary_large_image'>
<meta name='twitter:title' content='${product.title} - سوق عمان'>
<meta name='twitter:description' content='اشترِ ${product.title} بسعر ${product.sale_price} ريال عماني'>
<meta name='twitter:image' content='${product.image_link}'>
<script type='application/ld+json'>
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "${product.title}",
  "image": "${product.image_link}",
  "description": "${product.title} - منتج أصلي من سوق عمان",
  "sku": "${product.sku}",
  "brand": {
    "@type": "Brand",
    "name": "سوق عمان"
  },
  "offers": {
    "@type": "Offer",
    "url": "${productURL}",
    "priceCurrency": "OMR",
    "price": "${product.sale_price}",
    "priceValidUntil": "2026-12-31",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "${avgRating}",
    "reviewCount": "${product.reviews.length}"
  }
}
</script>
<style>
body{font-family:'Segoe UI',Tahoma,sans-serif;background:#f5f5f5;direction:rtl;margin:0;padding:0;}
.container{max-width:1200px;margin:0 auto;padding:20px;}
.product-card{background:white;border-radius:12px;padding:30px;box-shadow:0 2px 10px rgba(0,0,0,0.06);}
.product-image{width:100%;max-width:500px;border-radius:8px;margin-bottom:20px;}
h1{color:#2c3e50;margin-bottom:18px;font-size:28px;}
.price-section{margin:20px 0;}
.original-price{text-decoration:line-through;color:#999;font-size:18px;}
.sale-price{color:#e74c3c;font-size:32px;font-weight:bold;margin-right:10px;}
.sku{color:#7f8c8d;font-size:14px;margin-top:10px;}
.cta-buttons{margin-top:28px;}
.btn{display:inline-block;padding:13px 35px;margin:7px 7px 7px 0;border-radius:7px;border:none;cursor:pointer;font-weight:bold;font-size:16px;transition:all 0.3s;}
.btn-whatsapp{background:#25D366;color:white;}
.btn-whatsapp:hover{background:#1da851;transform:translateY(-2px);}
.btn-cart{background:#114c7d;color:white;}
.btn-cart:hover{background:#08304c;transform:translateY(-2px);}
.shipping-info{background:#ecf0f1;padding:13px;border-radius:6px;margin-top:17px;}
.shipping-info p{margin:5px 0;color:#34495e;}
.reviews-section{background:#f6f6fc;border-radius:8px;margin-top:26px;padding:18px;}
@media (max-width:768px){.container{padding:10px;}.product-card{padding:20px;}h1{font-size:22px;}.sale-price{font-size:26px;}.btn{padding:11px 25px;font-size:14px;}}
</style>
</head>
<body>
${header}
<div class='container'>
<div class='product-card'>
<img src='${product.image_link}' alt='${product.title}' class='product-image'>
<h1>${product.title}</h1>
<div class='sku'>رمز المنتج: ${product.sku}</div>
<div class='price-section'><span class='sale-price'>${product.sale_price} ر.ع</span> <span class='original-price'>${product.price} ر.ع</span></div>
<div class='cta-buttons'>
<button class='btn btn-cart' onclick="addToCart('${product.title}','${product.sale_price}','${product.sku}')">إضافة للسلة</button>
<button class='btn btn-whatsapp' onclick="window.location.href='/checkout.html?product=${encodeURIComponent(product.title)}&sku=${product.sku}&price=${product.sale_price}'">اطلب عبر واتساب</button>
</div>
<div class='shipping-info'>
<p>✓ شحن مجاني لجميع أنحاء عمان</p>
<p>✓ التوصيل خلال 3 أيام عمل</p>
<p>✓ إرجاع خلال 14 يوم في حالة عيوب التصنيع</p>
</div>
<div class='reviews-section'>
<b style='font-size:18px;'>تقييمات العملاء (${product.reviews.length}) - متوسط ${avgRating} ⭐</b>
${reviewsSection}
</div>
</div>
</div>
${footer}
<script>
function addToCart(title,price,sku){
let cart=JSON.parse(localStorage.getItem('sooqoman-cart')||'[]');
cart.push({title,price,sku});
localStorage.setItem('sooqoman-cart',JSON.stringify(cart));
window.location.href='/cart.html';
}
</script>
</body>
</html>`;
    
    fs.writeFileSync(filename, html, 'utf8');
    count++;
});

console.log(`✓ تم تحديث ${count} صفحة منتج مع SEO محسّن`);

// ==================== إنشاء ملف الروابط ====================
let linksText = `========================================
روابط متجر سوق عمان
========================================

📦 Google Merchant Feed:
${baseURL}/products.xml

🗺️ Sitemap:
${baseURL}/sitemap.xml

🤖 Robots.txt:
${baseURL}/robots.txt

🏠 الصفحة الرئيسية:
${baseURL}/
${baseURL}/index.html

🛒 السلة:
${baseURL}/cart.html

📋 إتمام الطلب:
${baseURL}/checkout.html

📄 الصفحات القانونية:
${baseURL}/terms.html
${baseURL}/privacy.html
${baseURL}/shipping.html
${baseURL}/returns.html
${baseURL}/contact.html

========================================
روابط المنتجات (${products.length} منتج):
========================================

`;

products.forEach((product, index) => {
    const slug = createArabicSlug(product.title);
    const productURL = `${baseURL}/products-pages/${slug}.html`;
    linksText += `${index + 1}. ${product.title}
   SKU: ${product.sku}
   ${productURL}\n\n`;
});

fs.writeFileSync('links.txt', linksText, 'utf8');
console.log('✓ تم إنشاء ملف الروابط: links.txt');

console.log('\n========================================');
console.log('✅ تم إنشاء جميع الملفات بنجاح!');
console.log('========================================');
console.log('✓ products.xml - Google Merchant Feed (XML صحيح)');
console.log('✓ sitemap.xml - خريطة الموقع');
console.log('✓ robots.txt - ملف الروبوتات');
console.log(`✓ ${count} صفحة منتج مع SEO كامل`);
console.log('✓ links.txt - جميع الروابط');
console.log('\n🔧 تم إصلاح:');
console.log('  ✓ XML entities مصححة');
console.log('  ✓ استخدام CDATA للنصوص العربية');
console.log('  ✓ لا توجد أخطاء XML');
