export async function convertPngToIco(pngUrl, fileName) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = pngUrl;

  await new Promise((resolve) => {
    img.onload = resolve;
  });

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(img, 0, 0, 256, 256);

  const pngData = ctx.getImageData(0, 0, 256, 256);
  const icoBlob = createIcoFromImageData(pngData);

  const link = document.createElement("a");
  link.href = URL.createObjectURL(icoBlob);
  link.download = `${fileName}.ico`;
  link.click();
}

function createIcoFromImageData(imageData) {
  const { width, height, data } = imageData;

  const headerSize = 40;
  const pixelDataSize = width * height * 4;
  const fileSize = 6 + 16 + headerSize + pixelDataSize;

  const buffer = new ArrayBuffer(fileSize);
  const dv = new DataView(buffer);
  let offset = 0;

  dv.setUint16(offset, 0, true); offset += 2;
  dv.setUint16(offset, 1, true); offset += 2;
  dv.setUint16(offset, 1, true); offset += 2;

  dv.setUint8(offset, width); offset += 1;
  dv.setUint8(offset, height); offset += 1;
  dv.setUint8(offset, 0); offset += 1;
  dv.setUint8(offset, 0); offset += 1;
  dv.setUint16(offset, 1, true); offset += 2;
  dv.setUint16(offset, 32, true); offset += 2;
  dv.setUint32(offset, headerSize + pixelDataSize, true); offset += 4;
  dv.setUint32(offset, 6 + 16, true); offset += 4;

  dv.setUint32(offset, headerSize, true); offset += 4;
  dv.setInt32(offset, width, true); offset += 4;
  dv.setInt32(offset, height * 2, true); offset += 4;
  dv.setUint16(offset, 1, true); offset += 2;
  dv.setUint16(offset, 32, true); offset += 2;
  dv.setUint32(offset, 0, true); offset += 4;
  dv.setUint32(offset, pixelDataSize, true); offset += 4;
  dv.setInt32(offset, 0, true); offset += 4;
  dv.setInt32(offset, 0, true); offset += 4;
  dv.setUint32(offset, 0, true); offset += 4;
  dv.setUint32(offset, 0, true); offset += 4;

  const pixelOffset = offset;
  const rowSize = width * 4;

  for (let y = 0; y < height; y++) {
    const srcRow = (height - 1 - y) * rowSize;
    const dstRow = pixelOffset + y * rowSize;
    for (let x = 0; x < rowSize; x += 4) {
      const r = data[srcRow + x];
      const g = data[srcRow + x + 1];
      const b = data[srcRow + x + 2];
      const a = data[srcRow + x + 3];

      dv.setUint8(dstRow + x, b);
      dv.setUint8(dstRow + x + 1, g);
      dv.setUint8(dstRow + x + 2, r);
      dv.setUint8(dstRow + x + 3, a);
    }
  }

  return new Blob([buffer], { type: "image/x-icon" });
}
