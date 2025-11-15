// سكربت Node.js نهائي - متجر سوق عمان الكامل بدون تحذيرات
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

// ==================== صفحات المنتجات ====================
let count = 0;
products.forEach(product => {
    const slug = createArabicSlug(product.title);
    const filename = path.join(folder, `${slug}.html`);
    
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
<meta name='description' content='اشترِ ${product.title} بسعر ${product.sale_price} ريال عماني - متجر سوق عمان'>
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
<b style='font-size:18px;'>تقييمات العملاء العمانيين</b>
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

console.log(`✓ تم إنشاء ${count} صفحة منتج`);

// ==================== صفحة الرئيسية ====================
let productCards = '';
products.forEach(prod => {
    const slug = createArabicSlug(prod.title);
    productCards += `<div class="product-card" onclick="window.location.href='/products-pages/${slug}.html'">
<img src="${prod.image_link}" alt="${prod.title}" class="card-image" loading="lazy">
<h3 class="card-title">${prod.title}</h3>
<div class="price-box">
<span class="sale-price">${prod.sale_price} ر.ع</span>
<span class="original-price">${prod.price} ر.ع</span>
</div>
<a href="/products-pages/${slug}.html" class="btn-details">شاهد التفاصيل</a>
</div>`;
});

const indexHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>سوق عمان - متجر إلكتروني عماني</title>
<meta name="description" content="تسوق من سوق عمان أفضل المنتجات العمانية بأسعار تنافسية، شحن مجاني">
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Segoe UI',Tahoma,sans-serif;background:#f5f5f5;direction:rtl;}
.container{max-width:1400px;margin:0 auto;padding:30px 20px;}
h1{text-align:center;color:#114c7d;margin-bottom:15px;font-size:36px;}
.subtitle{text-align:center;color:#666;margin-bottom:40px;font-size:18px;}
.products-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:25px;}
.product-card{background:white;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08);cursor:pointer;transition:all 0.3s;}
.product-card:hover{transform:translateY(-5px);box-shadow:0 6px 20px rgba(0,0,0,0.15);}
.card-image{width:100%;height:250px;object-fit:cover;border-radius:8px;margin-bottom:15px;}
.card-title{font-size:18px;color:#2c3e50;margin-bottom:12px;min-height:48px;line-height:1.4;}
.price-box{margin:15px 0;}
.sale-price{color:#e74c3c;font-size:24px;font-weight:bold;margin-left:10px;}
.original-price{text-decoration:line-through;color:#999;font-size:16px;}
.btn-details{display:block;background:#114c7d;color:white;text-align:center;padding:12px;border-radius:6px;text-decoration:none;font-weight:bold;margin-top:15px;transition:background 0.3s;}
.btn-details:hover{background:#08304c;}
@media (max-width:768px){.products-grid{grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:15px;}.card-image{height:180px;}.card-title{font-size:15px;min-height:40px;}.sale-price{font-size:20px;}h1{font-size:28px;}}
</style>
</head>
<body>
${header}
<div class="container">
<h1>سوق عمان - متجر إلكتروني عماني</h1>
<p class="subtitle">منتجات أصلية | شحن مجاني | توصيل سريع خلال 3 أيام</p>
<div class="products-grid">
${productCards}
</div>
</div>
${footer}
</body>
</html>`;

fs.writeFileSync('index.html', indexHTML, 'utf8');
console.log('✓ تم إنشاء صفحة index.html');

// ==================== صفحة السلة (بدون تحذيرات) ====================
const cartHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>سلة التسوق | سوق عمان</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Segoe UI',Tahoma,sans-serif;background:#f5f5f5;direction:rtl;}
.container{max-width:1000px;margin:0 auto;padding:30px 20px;}
h1{text-align:center;color:#114c7d;margin-bottom:30px;}
.cart-container{background:white;border-radius:12px;padding:30px;box-shadow:0 2px 10px rgba(0,0,0,0.08);}
.empty-cart{text-align:center;padding:60px 20px;color:#999;}
.cart-item{display:flex;align-items:center;padding:20px;border-bottom:1px solid #eee;gap:20px;}
.item-info{flex:1;}
.item-title{font-size:18px;color:#2c3e50;margin-bottom:8px;font-weight:bold;}
.item-sku{font-size:14px;color:#999;margin-bottom:8px;}
.item-price{font-size:20px;color:#e74c3c;font-weight:bold;}
.remove-btn{background:#e74c3c;color:white;border:none;padding:10px 20px;border-radius:6px;cursor:pointer;font-weight:bold;}
.cart-summary{margin-top:30px;padding:20px;background:#f8f9fa;border-radius:8px;}
.summary-row{display:flex;justify-content:space-between;margin-bottom:15px;font-size:18px;}
.summary-row.total{font-size:24px;font-weight:bold;color:#114c7d;border-top:2px solid #ddd;padding-top:15px;margin-top:15px;}
.checkout-btn{width:100%;background:#25D366;color:white;border:none;padding:18px;border-radius:8px;font-size:18px;font-weight:bold;cursor:pointer;margin-top:20px;transition:all 0.3s;}
.checkout-btn:hover{background:#1da851;transform:translateY(-2px);}
</style>
</head>
<body>
${header}
<div class="container">
<h1>🛒 سلة التسوق</h1>
<div class="cart-container">
<div id="cartContent"></div>
<div id="cartSummary" style="display:none;">
<div class="cart-summary">
<div class="summary-row"><span>المجموع الفرعي:</span><span id="subtotal">0 ر.ع</span></div>
<div class="summary-row"><span>الشحن:</span><span style="color:#27ae60;font-weight:bold;">مجاني</span></div>
<div class="summary-row total"><span>المجموع الكلي:</span><span id="total">0 ر.ع</span></div>
<button class="checkout-btn" onclick="window.location.href='/checkout.html'">إتمام الطلب عبر واتساب</button>
</div>
</div>
<a href="/index.html" style="display:block;text-align:center;margin-top:20px;color:#114c7d;font-weight:bold;text-decoration:none;">← متابعة التسوق</a>
</div>
</div>
${footer}
<script>
function loadCart(){
const cart=JSON.parse(localStorage.getItem('sooqoman-cart')||'[]');
const cartContent=document.getElementById('cartContent');
const cartSummary=document.getElementById('cartSummary');
if(cart.length===0){
cartContent.innerHTML='<div class="empty-cart"><h2>🛒 السلة فارغة</h2><p>لم تقم بإضافة أي منتجات بعد</p><a href="/index.html" style="display:inline-block;margin-top:20px;background:#114c7d;color:white;padding:12px 30px;border-radius:6px;text-decoration:none;font-weight:bold;">تصفح المنتجات</a></div>';
cartSummary.style.display='none';
return;
}
let html='';
let subtotal=0;
cart.forEach((item,index)=>{
const price=parseFloat(item.price);
subtotal+=price;
html+=\`<div class="cart-item"><div class="item-info"><div class="item-title">\${item.title}</div><div class="item-sku">رمز المنتج: \${item.sku}</div><div class="item-price">\${item.price} ر.ع</div></div><button class="remove-btn" onclick="removeItem(\${index})">حذف</button></div>\`;
});
cartContent.innerHTML=html;
document.getElementById('subtotal').textContent=subtotal.toFixed(2)+' ر.ع';
document.getElementById('total').textContent=subtotal.toFixed(2)+' ر.ع';
cartSummary.style.display='block';
}
function removeItem(index){
let cart=JSON.parse(localStorage.getItem('sooqoman-cart')||'[]');
cart.splice(index,1);
localStorage.setItem('sooqoman-cart',JSON.stringify(cart));
loadCart();
}
window.onload=loadCart;
</script>
</body>
</html>`;

fs.writeFileSync('cart.html', cartHTML, 'utf8');
console.log('✓ تم إنشاء صفحة cart.html (بدون تحذيرات)');

// ==================== صفحة Checkout ====================
const checkoutHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>إتمام الطلب | سوق عمان</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Segoe UI',Tahoma,sans-serif;background:#f5f5f5;direction:rtl;}
.container{max-width:900px;margin:0 auto;padding:30px 20px;}
h1{text-align:center;color:#114c7d;margin-bottom:30px;}
.checkout-form{background:white;border-radius:12px;padding:30px;box-shadow:0 2px 10px rgba(0,0,0,0.08);}
.form-group{margin-bottom:20px;}
.form-group label{display:block;margin-bottom:8px;color:#2c3e50;font-weight:bold;}
.form-group input,.form-group textarea{width:100%;padding:12px;border:1px solid #ddd;border-radius:6px;font-size:16px;font-family:inherit;}
.form-group textarea{resize:vertical;min-height:80px;}
.order-summary{background:#f8f9fa;padding:20px;border-radius:8px;margin-bottom:25px;}
.order-item{padding:10px 0;border-bottom:1px solid #ddd;}
.order-item:last-child{border-bottom:none;}
.total-row{display:flex;justify-content:space-between;font-size:20px;font-weight:bold;color:#114c7d;margin-top:15px;padding-top:15px;border-top:2px solid #ddd;}
.submit-btn{width:100%;background:#25D366;color:white;border:none;padding:18px;border-radius:8px;font-size:18px;font-weight:bold;cursor:pointer;transition:all 0.3s;}
.submit-btn:hover{background:#1da851;transform:translateY(-2px);}
</style>
</head>
<body>
${header}
<div class="container">
<h1>📋 إتمام الطلب</h1>
<div class="checkout-form">
<div class="order-summary" id="orderSummary"></div>
<form onsubmit="submitOrder(event)">
<div class="form-group">
<label>الاسم الكامل:</label>
<input type="text" id="customerName" required placeholder="مثال: أحمد محمد البوسعيدي">
</div>
<div class="form-group">
<label>رقم الهاتف:</label>
<input type="tel" id="customerPhone" required placeholder="مثال: 96891234567">
</div>
<div class="form-group">
<label>العنوان الكامل:</label>
<textarea id="customerAddress" required placeholder="مثال: مسقط، الخوير، شارع السلطان قابوس، بناية رقم 123"></textarea>
</div>
<button type="submit" class="submit-btn">إرسال الطلب عبر واتساب 📱</button>
</form>
</div>
</div>
${footer}
<script>
function loadOrderSummary(){
const urlParams=new URLSearchParams(window.location.search);
const singleProduct=urlParams.get('product');
let orderHTML='<h3 style="color:#114c7d;margin-bottom:15px;">ملخص الطلب</h3>';
let total=0;
if(singleProduct){
const sku=urlParams.get('sku');
const price=parseFloat(urlParams.get('price'));
total=price;
orderHTML+=\`<div class="order-item"><strong>\${singleProduct}</strong><br>SKU: \${sku}<br>السعر: \${price} ر.ع</div>\`;
}else{
const cart=JSON.parse(localStorage.getItem('sooqoman-cart')||'[]');
if(cart.length===0){
window.location.href='/index.html';
return;
}
cart.forEach(item=>{
const price=parseFloat(item.price);
total+=price;
orderHTML+=\`<div class="order-item"><strong>\${item.title}</strong><br>SKU: \${item.sku}<br>السعر: \${item.price} ر.ع</div>\`;
});
}
orderHTML+=\`<div class="total-row"><span>المجموع الكلي:</span><span>\${total.toFixed(2)} ر.ع</span></div>\`;
document.getElementById('orderSummary').innerHTML=orderHTML;
}
function submitOrder(e){
e.preventDefault();
const name=document.getElementById('customerName').value;
const phone=document.getElementById('customerPhone').value;
const address=document.getElementById('customerAddress').value;
const urlParams=new URLSearchParams(window.location.search);
const singleProduct=urlParams.get('product');
let message='*طلب جديد من سوق عمان*%0a%0a*بيانات العميل:*%0aالاسم: '+name+'%0aالهاتف: '+phone+'%0aالعنوان: '+address+'%0a%0a*تفاصيل الطلب:*%0a';
let total=0;
if(singleProduct){
const sku=urlParams.get('sku');
const price=urlParams.get('price');
total=parseFloat(price);
message+=\`المنتج: \${singleProduct}%0aSKU: \${sku}%0aالسعر: \${price} ر.ع%0a\`;
}else{
const cart=JSON.parse(localStorage.getItem('sooqoman-cart')||'[]');
cart.forEach((item,i)=>{
total+=parseFloat(item.price);
message+=\`\${i+1}. \${item.title} - \${item.price} ر.ع (SKU: \${item.sku})%0a\`;
});
}
message+=\`%0a*المجموع الكلي: \${total.toFixed(2)} ر.ع*%0a*الشحن: مجاني*\`;
window.location.href='https://wa.me/201110760081?text='+message;
if(!singleProduct){
localStorage.removeItem('sooqoman-cart');
}
}
window.onload=loadOrderSummary;
</script>
</body>
</html>`;

fs.writeFileSync('checkout.html', checkoutHTML, 'utf8');
console.log('✓ تم إنشاء صفحة checkout.html');

// ==================== الصفحات القانونية ====================
const pages = {
    'terms.html': '<h1 style="color:#114c7d;">الشروط والأحكام</h1><p style="line-height:1.8;">المتجر يلتزم بسياسات قانونية حديثة وفق متطلبات Google Merchant Center.</p>',
    'privacy.html': '<h1 style="color:#114c7d;">سياسة الخصوصية</h1><p style="line-height:1.8;">بيانات العملاء سرية تماماً وتستخدم فقط لمعالجة الطلبات.</p>',
    'shipping.html': '<h1 style="color:#114c7d;">سياسة الشحن</h1><p style="line-height:1.8;">شحن مجاني داخل عمان خلال 3 أيام عمل.</p>',
    'returns.html': '<h1 style="color:#114c7d;">سياسة الإرجاع</h1><p style="line-height:1.8;">إرجاع خلال 14 يوم في حالة عيوب التصنيع فقط.</p>',
    'contact.html': '<h1 style="color:#114c7d;">اتصل بنا</h1><p style="line-height:1.8;">البريد: sooqoman6@gmail.com<br>واتساب: 201110760081<br>العنوان: مسقط، عمان - الرمز البريدي: 112</p>'
};

Object.keys(pages).forEach(page => {
    const content = `<!DOCTYPE html><html lang='ar' dir='rtl'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><title>${page.replace('.html', '')} | سوق عمان</title><style>body{font-family:'Segoe UI',Tahoma,sans-serif;background:#f5f5f5;margin:0;padding:0;}.container{max-width:1000px;margin:0 auto;padding:30px;background:white;border-radius:10px;margin-top:20px;box-shadow:0 2px 8px rgba(0,0,0,0.05);}</style></head><body>${header}<div class='container'>${pages[page]}</div>${footer}</body></html>`;
    fs.writeFileSync(page, content, 'utf8');
});

console.log('✓ تم إنشاء جميع الصفحات القانونية');
console.log('\n========================================');
console.log('✅ تم إنشاء الموقع الكامل بنجاح!');
console.log('========================================');
console.log(`✓ ${count} صفحة منتج`);
console.log('✓ صفحة رئيسية');
console.log('✓ صفحة السلة (بدون تحذيرات ❌)');
console.log('✓ صفحة checkout مع واتساب مباشر');
console.log('✓ 5 صفحات قانونية');
console.log('\n🚫 لا توجد تحذيرات alert');
console.log('✅ انتقال مباشر من السلة لصفحة checkout');
console.log('✅ زر واتساب في صفحة checkout');
