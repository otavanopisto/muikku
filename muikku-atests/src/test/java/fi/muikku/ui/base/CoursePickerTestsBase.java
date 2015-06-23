package fi.muikku.ui.base;

import static org.junit.Assert.assertTrue;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import net.sourceforge.htmlunit.corejs.javascript.ast.CatchClause;

import org.apache.commons.codec.digest.DigestUtils;
import org.junit.Test;
import org.openqa.selenium.By;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.joda.JodaModule;
import com.github.tomakehurst.wiremock.client.WireMock;

import fi.muikkku.ui.AbstractUITest;
import fi.muikkku.ui.PyramusMocks;
import fi.muikku.SqlAfter;
import fi.muikku.SqlBefore;
import fi.muikku.plugins.schooldatapyramus.webhook.PyramusWebhookPayload;
import fi.muikku.webhooks.WebhookCourseCreatePayload;
import fi.muikku.webhooks.WebhookPayload;
import fi.muikku.webhooks.WebhookType;
import fi.muikku.webhooks.data.WebhookCourseData;

public class CoursePickerTestsBase extends AbstractUITest {
  
  @Test
//  @SqlBefore("sql/workspace1Setup.sql")
//  @SqlAfter("sql/workspace1Delete.sql")
  public void coursePickerExistsTest() throws IOException {
    PyramusMocks.student1LoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();
//    asAdmin().get("/test/reindex");
//    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).enable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

//    String payload = objectMapper.writeValueAsString(new WebhookCourseCreatePayload((long) 1));
    anotherPOST(new WebhookCourseCreatePayload((long) 1));
//    System.out.println("--- Webhook payload: " + payload + " ---");
    sleep(3000);
//    System.out.println("--- Response to webhook request: " + line + " ---");
    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
    
    waitForElementToBePresent(By.className("index"));
    getWebDriver().get(getAppUrl(true) + "/coursepicker/");
    waitForElementToBePresent(By.className("bt-mainFunction-content"));
    takeScreenshot();
    boolean elementExists = getWebDriver().findElements(By.id("coursesList")).size() > 0;
    WireMock.reset();
    assertTrue(elementExists);
  }
  
  private synchronized String webhookPOST (String urlString, String payload) {
    try {
      String secret = "38c6cbd28bf165070d070980dd1fb595";
        URL url = new URL(urlString);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setDoOutput(true);
        conn.setRequestProperty("X-Pyramus-Signature", secret);
        
        try( OutputStreamWriter writer = new OutputStreamWriter(conn.getOutputStream())) {
          writer.write(payload);
          writer.flush();
          writer.close();
        }        


        String line;
        BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        while ((line = reader.readLine()) != null) {
          System.out.println(line);
        }
        
        reader.close();
        return line;
    } catch (MalformedURLException e) {
        e.printStackTrace();
        return e.getMessage();
    }
    catch (IOException e) {
        e.printStackTrace();
        return e.getMessage();
    } 
}
  private synchronized void anotherPOST(WebhookPayload<WebhookCourseData> payload) {
    try {
    String secret = "38c6cbd28bf165070d070980dd1fb595";
    String request        = "http://dev.muikku.fi:8080/pyramus/webhook";
    URL    url            = new URL( request );
    HttpURLConnection conn= (HttpURLConnection) url.openConnection();           
    conn.setDoOutput( true );
    conn.setInstanceFollowRedirects( false );
    conn.setRequestMethod( "POST" );
    conn.setRequestProperty( "Content-Type", "application/x-www-form-urlencoded"); 
    conn.setRequestProperty( "charset", "utf-8");
//    conn.setRequestProperty( "Content-Length", Integer.toString( postDataLength ));
    conn.setRequestProperty( "X-Pyramus-Signature", secret )  ;
    conn.setUseCaches( false );
    conn.connect();
    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.writeValue(conn.getOutputStream(), payload);
    
//    try( DataOutputStream wr = new DataOutputStream( conn.getOutputStream())) {
//       wr.write( postData );
//       wr.flush();
//       wr.close();
//    }  
  }catch(Exception e){
    e.printStackTrace();
  }
  }
}
