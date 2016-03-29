package fi.otavanopisto.muikku.plugins.material;

import java.awt.Graphics2D;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import javax.imageio.ImageIO;

import static java.lang.Math.min;

public class ImageResizer {
  public void resizeImageFile(File inFile,
                              File outFile,
                              int maxWidth,
                              int maxHeight,
                              String format) throws IOException {
    BufferedImage img = ImageIO.read(inFile);
    int width = img.getWidth();
    int height = img.getHeight();
    
    double factor = 1.0;
    if (width > maxWidth) {
      factor = (double)width / (double)maxWidth;
    } else if (height > maxHeight) {
      factor = min(factor, (double)height / (double)maxHeight);
    }
      
    width *= factor;
    height *= factor;
    BufferedImage result = new BufferedImage(img.getType(), width, height);
    Graphics2D graphics = result.createGraphics();
    AffineTransform affineTransform = AffineTransform.getScaleInstance(factor, factor);
    graphics.drawRenderedImage(img, affineTransform);
    
    ImageIO.write(img, format, outFile);
  }
}
