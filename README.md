# Family Mystery Hub - Fixed GitHub Pages Version

موقع ألعاب عائلية وتحقيقات عربي جاهز للرفع على GitHub Pages.

## طريقة الرفع الصحيحة

1. فك ضغط الملف.
2. افتح المجلد الناتج.
3. ارفع محتويات المجلد نفسها، وليس المجلد بالكامل.
4. تأكد أن `index.html` ظاهر في الصفحة الرئيسية للـ Repository.
5. من Settings > Pages اختر:
   - Branch: `main`
   - Folder: `/root`
6. افتح الرابط بعد دقيقة.

## مهم

لا ترفع ملف ZIP كما هو. لا تضع الملفات داخل فولدر إضافي. الشكل الصحيح:

```txt
case/
├── index.html
├── cases.html
├── case.html
├── games.html
├── guide.html
├── 404.html
├── css/
├── js/
└── assets/
```

## المميزات

- 8 قضايا تحقيق.
- 5 ألعاب عائلية.
- تصميم Semi-Dark.
- لا توجد مكتبات خارجية.
- مسارات Relative متوافقة مع GitHub Pages project sites.
- حفظ تقدم في LocalStorage.
