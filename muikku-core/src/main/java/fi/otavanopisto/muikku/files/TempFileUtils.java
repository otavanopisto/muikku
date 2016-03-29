package fi.otavanopisto.muikku.files;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.io.IOUtils;

public class TempFileUtils {

  public static File getTempFile(String fileId) {
    return new File(getTempDirectory(), fileId);
  }

  public static byte[] getTempFileData(String fileId) throws IOException {
    File tempFile = TempFileUtils.getTempFile(fileId);
    if (tempFile.exists()) {
      FileInputStream inputStream = new FileInputStream(tempFile);
      try {
        return IOUtils.toByteArray(inputStream);
      } finally {
        inputStream.close();
      }
    }

    return null;
  }

  public static File createTempFile() throws IOException {
    File tempFile = new File(getTempDirectory(), generateUniqueFileId());
    if (tempFile.createNewFile()) {
      return tempFile;
    }
    
    throw new IOException("Could not create temp file");
  }

  public static void deleteTempFile(String fileId) {
    File tempFile = new File(getTempDirectory(), fileId);
    if (tempFile.exists()) {
      tempFile.delete();
    }
  }
  
  private static File getTempDirectory() {
    return new File(System.getProperty("java.io.tmpdir"));
  }

  private static String generateUniqueFileId() {
    File tempDirectory = getTempDirectory();
    File file;
    String fileName = null;
    int counter = 0;
    
    do {
      fileName = DigestUtils.md5Hex(new StringBuilder()
        .append(Thread.currentThread().getId())
        .append('-')
        .append(System.currentTimeMillis())
        .append('-')
        .append(counter)
        .toString());
      file = new File(tempDirectory, fileName);
      counter++;
    } while (file.exists());
    
    return fileName;
  }

}
