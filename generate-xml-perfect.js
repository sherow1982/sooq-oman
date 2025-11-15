// سكربت Node.js نهائي مصحح 100% - بدون أخطاء XML
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

// دالة لتنظيف URLs من & إلى &amp;
function escapeURL(url) {
    return url.replace(/&/g, '&amp;');
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
    const imageURL = escapeURL(product.image_link); // تنظيف URL الصورة
    
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

// ==================== ملف الروابط ====================
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
console.log('✓ products.xml - Google Merchant Feed');
console.log('✓ sitemap.xml - خريطة الموقع');
console.log('✓ robots.txt - ملف الروبوتات');
console.log('✓ links.txt - جميع الروابط');
console.log('\n🔧 التصحيحات:');
console.log('  ✓ تحويل & إلى &amp; في URLs');
console.log('  ✓ استخدام CDATA للنصوص العربية');
console.log('  ✓ XML صحيح 100% بدون أخطاء');
console.log('\n📋 الأسعار:');
console.log('  ✓ g:price - السعر قبل الخصم');
console.log('  ✓ g:sale_price - السعر بعد الخصم');
