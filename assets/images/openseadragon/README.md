# OpenSeadragon Images

This directory should contain the OpenSeadragon UI images (navigation buttons, etc.).

## Option 1: Download from OpenSeadragon

Download the images from the OpenSeadragon releases:
https://github.com/openseadragon/openseadragon/releases

Extract the `images/` folder from the release and place the contents here.

## Option 2: Use CDN

In the chapter layout, configure OpenSeadragon to use CDN images:

```javascript
OpenSeadragon({
  prefixUrl: "https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.1.0/images/",
  // ...
});
```

For minimal computing and offline usage, Option 1 is recommended.
