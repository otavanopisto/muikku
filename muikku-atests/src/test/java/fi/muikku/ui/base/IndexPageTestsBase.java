package fi.muikku.ui.base;

import static com.github.tomakehurst.wiremock.client.WireMock.getRequestedFor;
import static com.github.tomakehurst.wiremock.client.WireMock.postRequestedFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;
import static com.github.tomakehurst.wiremock.client.WireMock.verify;
import static org.junit.Assert.assertTrue;

import java.io.IOException;

import org.junit.Test;
import org.openqa.selenium.By;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.joda.JodaModule;
import com.github.tomakehurst.wiremock.client.WireMock;

import fi.muikkku.ui.AbstractUITest;
import fi.muikkku.ui.PyramusMocks;
import fi.pyramus.webhooks.WebhookStaffMemberCreatePayload;
import fi.pyramus.webhooks.WebhookStudentCreatePayload;

public class IndexPageTestsBase extends AbstractUITest {

  @Test
  public void indexPageTest() throws IOException {
    getWebDriver().get(getAppUrl());
    boolean elementExists = getWebDriver().findElements(By.className("index")).size() > 0;;
    assertTrue(elementExists);
  }
  
  @Test
  public void studentLoginTest() throws Exception {
    PyramusMocks.student1LoginMock();
    PyramusMocks.personsPyramusMocks();
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    String payload = objectMapper.writeValueAsString(new WebhookStudentCreatePayload((long) 1));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);

    verify(1, getRequestedFor(urlEqualTo("/users/authorize.*")));
    verify(1, postRequestedFor(urlEqualTo("/1/oauth/token")));
    verify(1, getRequestedFor(urlEqualTo("/1/system/whoami")));
    
    getWebDriver().get(getAppUrl() + "/login?authSourceId=1");
    boolean elementExists = getWebDriver().findElements(By.className("index")).size() > 0;
    takeScreenshot();
    WireMock.reset();
    assertTrue(elementExists);
  }
  
  @Test
  public void adminLoginTest() throws Exception {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    String payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    
    getWebDriver().get(getAppUrl() + "/login?authSourceId=1");
    boolean elementExists = getWebDriver().findElements(By.className("index")).size() > 0;
    takeScreenshot();
    WireMock.reset();
    assertTrue(elementExists);
  }
}
