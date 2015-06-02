package fi.muikku.ui.base;

import static org.junit.Assert.assertTrue;

import java.io.IOException;

import org.junit.Test;
import org.openqa.selenium.By;

import com.github.tomakehurst.wiremock.client.WireMock;

import fi.muikkku.ui.AbstractUITest;
import fi.muikkku.ui.PyramusMocks;

public class IndexPageTestsBase extends AbstractUITest {

  @Test
  public void IndexPageTest() throws IOException {
    getWebDriver().get(getAppUrl());
    boolean elementExists = getWebDriver().findElements(By.className("index")).size() > 0;
    assertTrue(elementExists);
  }
  
  @Test
  public void studentLoginTest() throws IOException {
    PyramusMocks.student1LoginMock();
    PyramusMocks.personsPyramusMocks();
    getWebDriver().get(getAppUrl() + "/login?authSourceId=1");
    boolean elementExists = getWebDriver().findElements(By.className("index")).size() > 0;
    takeScreenshot();
    WireMock.reset();
    assertTrue(elementExists);
  }
  
  @Test
  public void adminLoginTest() throws IOException {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    getWebDriver().get(getAppUrl() + "/login?authSourceId=1");
    boolean elementExists = getWebDriver().findElements(By.className("index")).size() > 0;
    takeScreenshot();
    WireMock.reset();
    assertTrue(elementExists);
  }
}
