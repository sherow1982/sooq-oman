// سكربت Node.js - حقن Google Analytics & Tag Manager في كل صفحات الموقع
const fs = require('fs');
const path = require('path');

// أكواد Google Analytics و Tag Manager
const gtmHead = `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PT2GKW9R');</script>
<!-- End Google Tag Manager -->

<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-TXD1YR1BSG"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-TXD1YR1BSG');
</script>`;

const gtmBody = `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PT2GKW9R"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;

// دالة لحقن الأكواد في ملف HTML
function injectAnalytics(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️ الملف غير موجود: ${filePath}`);
        return false;
    }
    
    let html = fs.readFileSync(filePath, 'utf8');
    
    // التحقق إذا كان الكود موجود بالفعل
    if (html.includes('GTM-PT2GKW9R')) {
        console.log(`✓ الملف يحتوي بالفعل على الكود: ${filePath}`);
        return false;
    }
    
    // حقن GTM في <head>
    html = html.replace('</head>', `${gtmHead}\n</head>`);
    
    // حقن GTM (noscript) بعد <body>
    html = html.replace(/<body[^>]*>/, `$&\n${gtmBody}`);
    
    fs.writeFileSync(filePath, html, 'utf8');
    return true;
}

// قائمة الصفحات الرئيسية
const mainPages = [
    'index.html',
    'cart.html',
    'checkout.html',
    'terms.html',
    'privacy.html',
    'shipping.html',
    'returns.html',
    'contact.html'
];

console.log('========================================');
console.log('🚀 حقن Google Analytics & Tag Manager');
console.log('========================================\n');

let injected = 0;
let skipped = 0;

// حقن الأكواد في الصفحات الرئيسية
console.log('📄 الصفحات الرئيسية:');
mainPages.forEach(page => {
    if (injectAnalytics(page)) {
        console.log(`  ✓ ${page}`);
        injected++;
    } else {
        skipped++;
    }
});

// حقن الأكواد في صفحات المنتجات
const productsFolder = 'products-pages';
if (fs.existsSync(productsFolder)) {
    console.log('\n📦 صفحات المنتجات:');
    const productFiles = fs.readdirSync(productsFolder).filter(f => f.endsWith('.html'));
    
    productFiles.forEach(file => {
        const filePath = path.join(productsFolder, file);
        if (injectAnalytics(filePath)) {
            injected++;
        } else {
            skipped++;
        }
    });
    console.log(`  ✓ تم حقن ${injected} صفحة منتج`);
}

console.log('\n========================================');
console.log('✅ اكتمل الحقن!');
console.log('========================================');
console.log(`✓ تم الحقن: ${injected} صفحة`);
console.log(`⊘ تم التجاوز: ${skipped} صفحة`);
console.log('\n📊 الأكواد المحقونة:');
console.log('  • Google Tag Manager (GTM-PT2GKW9R)');
console.log('  • Google Analytics (G-TXD1YR1BSG)');
console.log('\n🎯 الموقع الآن يتتبع:');
console.log('  • الزيارات');
console.log('  • سلوك المستخدمين');
console.log('  • التحويلات');
console.log('  • أداء الصفحات');
