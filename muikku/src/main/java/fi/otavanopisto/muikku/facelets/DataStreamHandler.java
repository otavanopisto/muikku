package fi.otavanopisto.muikku.facelets;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLStreamHandler;

import org.apache.commons.codec.binary.Base64;

public class DataStreamHandler extends URLStreamHandler {
  
  private static class DataURLConnection extends URLConnection {
    
    @Override
    public InputStream getInputStream() throws IOException {
      return new ByteArrayInputStream(this.content.getBytes());
    }

    private static String PREFIX = "data://text/plain;base64,";
    private static int PREFIX_LEN = PREFIX.length();
    
    protected DataURLConnection(URL url) {
      super(url);
      this.url = url;
      
      String encoded = this.url.toString().substring(PREFIX_LEN);
      this.content = new String(Base64.decodeBase64(encoded));
    }

    @Override
    public void connect() throws IOException {
      // Do nothing
    }
    
    private URL url;
    private String content;
  }

  @Override
  protected URLConnection openConnection(URL url) throws IOException {
    return new DataURLConnection(url);
  }
}
