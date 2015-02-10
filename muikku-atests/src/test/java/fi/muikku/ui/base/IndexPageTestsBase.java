package fi.muikku.ui.base;

import static org.junit.Assert.assertTrue;
import static com.github.tomakehurst.wiremock.client.WireMock.*;

import java.io.IOException;

import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;

import fi.muikkku.ui.AbstractUITest;
import fi.muikku.SqlAfter;
import fi.muikku.SqlBefore;

public class IndexPageTestsBase extends AbstractUITest {

  @Before
  @SqlBefore("loginSetup.sql")
  @SqlAfter("loginTeardown.sql")
  public void requiredPyramusMocks() {
//    stubFor(get(urlPathEqualTo("/users/authorize.page"))
//        .withQueryParam("client_id", matching(".*"))
//        .withQueryParam("response_type", matching(".*"))
//        .withQueryParam("redirect_uri", matching(".*"))
//        //        .withHeader("Accept", equalTo("text/json"))
//        .willReturn(aResponse()
//          .withStatus(200)
//          .withHeader("Content-Type", "text/html")
//          .withHeader("Location", "https://dev.muikku.fi:8443/login?_stg=rsp&code=322322323232332")));

    stubFor(get(urlEqualTo("/oauth/token"))
        .willReturn(aResponse()
          .withBody("{\"expires_in\":3600,\"refresh_token\":\"322322323232332\",\"access_token\":\"322322323232332\"}")
          .withStatus(200)));

    stubFor(get(urlEqualTo("/whoami"))
        .willReturn(aResponse()
          .withHeader("Content-Type", "text/json")
          .withBody("{\"id\":1,\"firstName\":\"Test\",\"lastName\":\"User\",\"emails\":[\"testuser@made.up\"]}")
          .withStatus(200)));
    
  }

  @Test
  public void IndexPageTest() throws IOException {
    getWebDriver().get(getAppUrl());
    boolean elementExists = getWebDriver().findElements(By.className("index")).size() > 0;
    assertTrue(elementExists);
  }

}
