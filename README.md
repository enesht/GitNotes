# GitNotes

Git ile güçlendirilmiş basit, modern ve minimalist blog platformu. Markdown dosyalarınızı Git repository'nize yükleyin, GitHub Pages otomatik olarak güzel bir blog'a dönüştürsün!

## Özellikler

- 📝 **Markdown Desteği** - Yazılarınızı markdown formatında yazın
- 🎨 **Modern Tasarım** - Temiz ve minimalist arayüz
- 🚀 **Hızlı ve Hafif** - Vite ile optimize edilmiş performans
- 📱 **Responsive** - Tüm cihazlarda mükemmel görünüm
- 🔤 **İnter Font** - Okunabilir ve modern tipografi
- ⚡ **GitHub Pages** - Otomatik deployment

## Kurulum

```bash
# Repository'yi klonlayın
git clone https://github.com/kullaniciadi/GitNotes.git
cd GitNotes

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

## Kullanım

### Yeni Blog Yazısı Ekleme

1. `posts/` klasörüne yeni bir `.md` dosyası ekleyin
2. Front matter ile yazı meta bilgilerini ekleyin:

```markdown
---
title: Yazı Başlığınız
date: 2025-11-27
author: Adınız
tags: [tag1, tag2, tag3]
---

# Yazınızın İçeriği

Buraya yazınızı yazın...
```

3. Dosyayı kaydedin ve commit edin:

```bash
git add posts/yeni-yazi.md
git commit -m "Yeni yazı eklendi: Yazı Başlığınız"
git push
```

4. GitHub Actions otomatik olarak sitenizi güncelleyecek!

### posts/ ve public/posts/ Senkronizasyonu

Yeni markdown dosyaları ekledikten sonra, public klasörünü güncelleyin:

```bash
cp posts/*.md public/posts/
```

### main.js'de Yeni Yazıları Kaydetme

`src/main.js` dosyasında `BlogManager.loadPosts()` metodundaki `postFiles` dizisine yeni dosyanızı ekleyin:

```javascript
const postFiles = [
  'welcome.md',
  'markdown-guide.md',
  'yeni-yazi.md'  // Yeni eklenen
]
```

## Deployment

GitHub Pages üzerinde otomatik deployment için:

1. Repository Settings > Pages bölümüne gidin
2. Source olarak "GitHub Actions" seçin
3. `main` branch'ine push yaptığınızda otomatik deploy olacak

## Geliştirme Komutları

```bash
# Geliştirme sunucusu
npm run dev

# Production build
npm run build

# Build önizleme
npm run preview
```

## Proje Yapısı

```
GitNotes/
├── posts/              # Markdown blog yazıları
├── public/
│   └── posts/         # Public markdown dosyaları (Vite tarafından sunulur)
├── src/
│   ├── main.js        # Ana uygulama kodu
│   └── style.css      # Stiller
├── .github/
│   └── workflows/
│       └── deploy.yml # GitHub Actions deployment
├── index.html         # Ana HTML dosyası
├── vite.config.js     # Vite yapılandırması
└── package.json       # Proje bağımlılıkları
```

## Teknolojiler

- [Vite](https://vitejs.dev/) - Build tool
- [Marked](https://marked.js.org/) - Markdown parser
- [Gray Matter](https://github.com/jonschlinkert/gray-matter) - Front matter parser
- [Inter Font](https://fonts.google.com/specimen/Inter) - Tipografi
- Vanilla JavaScript - Framework yok, saf JS!

## Özelleştirme

### Renk Teması

`src/style.css` dosyasında `:root` değişkenlerini düzenleyerek renkleri değiştirebilirsiniz:

```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #1a1a1a;
  --accent-color: #0066cc;
  /* ... */
}
```

### Site Başlığı

`index.html` ve `src/main.js` dosyalarında "GitNotes" yazısını kendi blog adınızla değiştirin.

### Domain Bağlama

1. Repository Settings > Pages > Custom domain bölümünden domain ekleyin
2. DNS ayarlarınızda CNAME kaydı oluşturun
3. `public/` klasörüne `CNAME` dosyası ekleyin:

```bash
echo "yourdomain.com" > public/CNAME
```

## Lisans

MIT License - Dilediğiniz gibi kullanabilirsiniz!

## Katkıda Bulunma

Pull request'ler memnuniyetle karşılanır! Büyük değişiklikler için lütfen önce bir issue açın.

---

**GitNotes** ile bloglamak çok kolay! 🚀
