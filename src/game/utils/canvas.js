export function drawImage(
  context,
  sprite,
  sx,
  sy,
  swidth,
  sheight,
  x,
  y,
  width,
  height,
  angle = 0
) {
  context.save();
  context.translate(x + width / 2, y + height / 2);
  context.rotate((angle * Math.PI) / 180);
  context.translate(-x - width / 2, -y - height / 2);
  context.drawImage(sprite, sx, sy, swidth, sheight, x, y, width, height);
  context.restore();
}
