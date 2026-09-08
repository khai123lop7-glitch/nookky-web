# Nook Ký media

Binary media is intentionally separated from the migration code. Upload the contents of the approved `public/media/` pack here without changing folder names.

Expected structure:

- `brand/logo-symbol-light.png`
- `brand/logo-symbol-dark.png`
- `brand/wordmark-light.png`
- `brand/wordmark-dark.png`
- `editorial/hero-hanoi.jpg`
- `editorial/hero-mobile.webp`
- `editorial/real-hoi-an.webp`
- `editorial/real-ha-noi.webp`
- `editorial/real-da-lat.webp`
- `editorial/real-mien-tay.webp`
- `editorial/brand-close.webp`
- `products/01-pho-vua-len-den-hoi-an/{cover,detail,lifestyle}.webp`
- `products/02-mua-qua-san-gach-hue/{cover,detail,lifestyle}.webp`
- `products/03-sang-tren-pho-cu-ha-noi/{cover,detail,lifestyle}.webp`
- `products/04-hem-con-sang-den-sai-gon/{cover,detail,lifestyle}.webp`
- `products/05-den-am-tren-doc-da-lat/{cover,detail,lifestyle}.webp`
- `products/06-song-vua-thuc-giac-mien-tay/{cover,detail,lifestyle}.webp`

## Font asset policy

Ortland is a required Nook Ký Brand asset, but it is **not part of the media-only pack above**.

The migration audit expects the approved Brand font at:

- `public/fonts/1FTV-Ortland.ttf`

The previous WordPress V2 handoff packaged this file under `assets/fonts/1FTV-Ortland.ttf`, but the current Next.js branch does not contain `public/fonts/` yet.

Because this GitHub repository is public, do not upload a licensed font binary blindly. First confirm that the font license permits the intended web/self-hosted use and repository exposure. If repository redistribution is not permitted, use an approved private build/deployment asset pipeline or make the relevant source repository private before integrating the font.

Do not commit API keys, secrets, `.env`, or WordPress export folders.
