package fi.muikku;

import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

public class TestUtilities {
  
  public static Boolean webhookCall(String url, String payload) throws Exception {
    String signature = "38c6cbd28bf165070d070980dd1fb595";
    CloseableHttpClient client = HttpClients.createDefault();
    try {
      HttpPost httpPost = new HttpPost(url);
      try {
        StringEntity dataEntity = new StringEntity(payload);
        try {
          httpPost.addHeader("X-Pyramus-Signature", signature);
          httpPost.setEntity(dataEntity);
          client.execute(httpPost);
          return true;
        } finally {
          EntityUtils.consume(dataEntity);
        }
      } finally {
        httpPost.releaseConnection();
      }
    } finally {
      client.close();
    }
  }

}
