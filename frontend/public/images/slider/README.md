# Background Slider Images

Place your background slider images in this folder.

## How to Use

1. Add your images to this folder (e.g., `image1.jpg`, `image2.jpg`, etc.)
2. Update the `sliderImages` array in `frontend/src/pages/Home.jsx`
3. Reference local images using: `/images/slider/your-image-name.jpg`

## Example

```javascript
const sliderImages = [
  '/images/slider/image1.jpg',
  '/images/slider/image2.jpg',
  '/images/slider/image3.jpg',
];
```

## Recommended Image Specifications

- **Format**: JPG, PNG, or WebP
- **Resolution**: 1920x1080 or higher (for best quality)
- **Aspect Ratio**: 16:9 (landscape)
- **File Size**: Optimize images to keep file sizes reasonable (< 500KB per image recommended)

## Notes

- Images will automatically cycle through every 5 seconds
- The slider includes a dark overlay (40% opacity) to ensure text readability
- All images should be related to nutrition, healthy food, or wellness for best visual consistency


