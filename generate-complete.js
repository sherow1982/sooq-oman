// سكربت Node.js شامل - متجر سوق عمان الكامل
const fs = require('fs');
const path = require('path');

const products = JSON.parse(fs.readFileSync('products.json', 'utf8'));
const folder = 'products-pages';
if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
}

function createArabicSlug(text) {
    let slug = text.trim();
    slug = slug.replace(/\s+/g, '-');
    slug = slug.replace(/[^\u0600-\u06FF\w\-]/g, '');
    slug = slug.replace(/-+/g, '-');
    slug = slug.replace(/^-+|-+$/g, '');
    return slug;
}

let count = 0;
const header = `<header style='background:#114c7d;padding:20px;color:white;font-weight:bold;font-size:22px;text-align:center;'>
<nav>
<a href='/index.html' style='color:#fff;margin:0 15px;text-decoration:none;font-size:18px;'>الرئيسية</a>
<a href='/terms.html' style='color:#fff;margin:0 15px;text-decoration:none;'>الشروط والأحكام</a>
<a href='/privacy.html' style='color:#fff;margin:0 15px;text-decoration:none;'>سياسة الخصوصية</a>
<a href='/shipping.html' style='color:#fff;margin:0 15px;text-decoration:none;'>سياسة الشحن</a>
<a href='/returns.html' style='color:#fff;margin:0 15px;text-decoration:none;'>سياسة الإرجاع</a>
<a href='/contact.html' style='color:#fff;margin:0 15px;text-decoration:none;'>اتصل بنا</a>
</nav>
</header>`;

const footer = `<footer style='background:#ecf0f1;color:#114c7d;text-align:center;padding:20px;margin-top:40px;'>
<small>جميع الحقوق محفوظة &copy; سوق عمان 2025 | مسقط، عمان - الرمز البريدي: 112</small>
<nav style='margin-top:10px;'>
<a href='/terms.html' style='color:#114c7d;margin:0 10px;text-decoration:underline;'>الشروط والأحكام</a>
<a href='/privacy.html' style='color:#114c7d;margin:0 10px;text-decoration:underline;'>الخصوصية</a>
<a href='/shipping.html' style='color:#114c7d;margin:0 10px;text-decoration:underline;'>الشحن</a>
<a href='/returns.html' style='color:#114c7d;margin:0 10px;text-decoration:underline;'>الإرجاع</a>
</nav>
</footer>`;

products.forEach(product => {
    const slug = createArabicSlug(product.title);
    const filename = path.join(folder, `${slug}.html`);
    const productURL = `https://sooq-oman.arabsad.com/products-pages/${slug}.html`;
    
    let reviewsSection = '';
    product.reviews.forEach(review => {
        reviewsSection += `<div style='border-bottom:1px solid #eee;padding:10px 0;'><span style='font-weight:bold;color:#156c28;'>${review.name}</span> - <span style='color:#FFC700;'>⭐ ${review.rating}</span> <span style='font-size:13px;color:#888;'>${review.date}</span><div style='margin-top:4px;'>${review.comment}</div></div>`;
    });
    
    const html = `<!DOCTYPE html>
<html lang='ar' dir='rtl'>
<head>
<meta charset='UTF-8'>
<meta name='viewport' content='width=device-width, initial-scale=1.0'>
<title>${product.title} | سوق عمان</title>
<meta name='description' content='اشترِ ${product.title} بسعر ${product.sale_price} ريال عماني فقط - متجر سوق عمان'>
<script>
function addToCart(title, price, sku) {
    let cart = JSON.parse(localStorage.getItem('sooqoman-cart') || '[]');
    cart.push({ title, price, sku });
    localStorage.setItem('sooqoman-cart', JSON.stringify(cart));
    alert('تمت الإضافة للسلة بنجاح! ✓');
    window.location.href = '/cart.html';
}
function whatsappOrder() {
    const title = "${product.title}";
    const sku = "${product.sku}";
    const price = "${product.sale_price}";
    const url = window.location.href;
    
    const name = prompt('ادخل اسمك الكامل:');
    if (!name) return;
    
    const phone = prompt('ادخل رقم هاتفك:');
    if (!phone) return;
    
    const address = prompt('ادخل عنوانك الكامل (المنطقة، الشارع، رقم المنزل):');
    if (!address) return;
    
    const message = \`*طلب منتج من سوق عمان*%0a%0a\` +
                   \`*بيانات العميل:*%0a\` +
                   \`الاسم: \${name}%0a\` +
                   \`الهاتف: \${phone}%0a\` +
                   \`العنوان: \${address}%0a%0a\` +
                   \`*تفاصيل المنتج:*%0a\` +
                   \`اسم المنتج: \${title}%0a\` +
                   \`رمز المنتج (SKU): \${sku}%0a\` +
                   \`السعر: \${price} ر.ع%0a\` +
                   \`رابط المنتج: \${url}%0a%0a\` +
                   \`*الشحن: مجاني*\`;
    
    window.open('https://wa.me/201110760081?text=' + message, '_blank');
}
</script>
<style>
body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:#f5f5f5;direction:rtl;margin:0;padding:0;}
.container{max-width:1200px;margin:0 auto;padding:20px;}
.product-card{background:white;border-radius:12px;padding:30px;box-shadow:0 2px 10px rgba(0,0,0,0.06);}
.product-image{width:100%;max-width:500px;border-radius:8px;margin-bottom:20px;display:block;}
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
.reviews-section{background:#f6f6fc;border-radius:8px;margin-top:26px;padding:18px;box-shadow:0px 1px 6px rgba(0,0,0,0.08);}
@media (max-width: 768px) {
    .container{padding:10px;}
    .product-card{padding:20px;}
    h1{font-size:22px;}
    .sale-price{font-size:26px;}
    .btn{padding:11px 25px;font-size:14px;}
}
</style>
</head>
<body>
${header}
<div class='container'>
<div class='product-card'>
<img src='${product.image_link}' alt='${product.title}' class='product-image' onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22%3E%3Crect fill=%22%23ddd%22 width=%22400%22 height=%22400%22/%3E%3Ctext fill=%22%23999%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3Eصورة المنتج%3C/text%3E%3C/svg%3E'">
<h1>${product.title}</h1>
<div class='sku'>رمز المنتج: ${product.sku}</div>
<div class='price-section'><span class='sale-price'>${product.sale_price} ر.ع</span> <span class='original-price'>${product.price} ر.ع</span></div>
<div class='cta-buttons'>
<button class='btn btn-cart' onclick="addToCart('${product.title}', '${product.sale_price}', '${product.sku}')">إضافة إلى السلة</button>
<button class='btn btn-whatsapp' onclick="whatsappOrder()">اطلب عبر واتساب</button>
</div>
<div class='shipping-info'>
<p>✓ شحن مجاني لجميع أنحاء عمان</p>
<p>✓ التوصيل خلال 3 أيام عمل</p>
<p>✓ إرجاع خلال 14 يوم في حالة عيوب التصنيع</p>
</div>
<div class='reviews-section'>
<b style='font-size:18px;'>تقييمات العملاء العمانيين</b>
${reviewsSection}
</div>
</div>
</div>
${footer}
</body>
</html>`;
    
    fs.writeFileSync(filename, html, 'utf8');
    count++;
});

console.log(`✓ تم إنشاء ${count} صفحة منتج احترافية مع زر واتساب محدث في ${folder}`);

// الصفحات القانونية
const pages = {
    'index.html': '<h1 style="color:#114c7d;">سوق عمان</h1><p style="font-size:18px;line-height:1.8;">تسوق منتجات عمانية أصلية، شحن مجاني وتوصيل في 3 أيام، دفع وتواصل عبر واتساب.</p>',
    'terms.html': '<h1 style="color:#114c7d;">الشروط والأحكام</h1><p style="line-height:1.8;">المتجر يلتزم بسياسات قانونية حديثة وفق متطلبات Google Merchant Center، أي استخدام للشراء أو الطلب يعتبر موافقة صريحة على بنود وشروط الخدمة المعتمدة لدينا.</p>',
    'privacy.html': '<h1 style="color:#114c7d;">سياسة الخصوصية</h1><p style="line-height:1.8;">بيانات العملاء سرية تماماً وتستخدم فقط لمعالجة الطلبات والتواصل للتوصيل، لا يتم مشاركتها مع أي طرف ثالث بدون إذن واضح.</p>',
    'shipping.html': '<h1 style="color:#114c7d;">سياسة الشحن</h1><p style="line-height:1.8;">جميع المنتجات تشحن مجاناً داخل سلطنة عمان خلال 3 أيام عمل من تاريخ الطلب، يتم إعلام العميل بأي تأخير طارئ ويحق له الإلغاء المجاني قبل الشحن.</p>',
    'returns.html': '<h1 style="color:#114c7d;">سياسة الإرجاع</h1><p style="line-height:1.8;">يحق للعميل إرجاع أي منتج في غضون 14 يوم في حالة وجود عيب تصنيعي فقط ولا توجد سياسة استبدال حالياً.</p>',
    'contact.html': '<h1 style="color:#114c7d;">اتصل بنا</h1><p style="line-height:1.8;">البريد الإلكتروني: <a href="mailto:sooqoman6@gmail.com">sooqoman6@gmail.com</a><br>واتساب: <a href="https://wa.me/201110760081">201110760081</a><br>العنوان: مسقط، سلطنة عمان - الرمز البريدي: 112</p>'
};

Object.keys(pages).forEach(page => {
    if (page === 'index.html') return; // skip index, it's created separately
    const content = `<!DOCTYPE html><html lang='ar' dir='rtl'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><title>${page.replace('.html', '')} | سوق عمان</title><style>body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:#f5f5f5;margin:0;padding:0;}.container{max-width:1000px;margin:0 auto;padding:30px;background:white;border-radius:10px;margin-top:20px;box-shadow:0 2px 8px rgba(0,0,0,0.05);}</style></head><body>${header}<div class='container'>${pages[page]}</div>${footer}</body></html>`;
    fs.writeFileSync(page, content, 'utf8');
});

console.log('✓ تم إنشاء جميع الصفحات القانونية بنجاح');
console.log('\n📱 زر واتساب الآن يسحب:');
console.log('  ✓ اسم المنتج');
console.log('  ✓ رمز المنتج (SKU)');
console.log('  ✓ السعر');
console.log('  ✓ رابط المنتج الكامل');
console.log('  ✓ اسم العميل');
console.log('  ✓ رقم هاتف العميل');
console.log('  ✓ عنوان العميل الكامل');
