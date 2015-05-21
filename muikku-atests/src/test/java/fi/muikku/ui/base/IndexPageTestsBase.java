package fi.muikku.ui.base;

import static org.junit.Assert.assertTrue;

import java.io.IOException;

import org.junit.Test;
import org.openqa.selenium.By;

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
  public void loginTest() throws IOException {
    PyramusMocks.personsPyramusMocks();
    getWebDriver().get(getAppUrl() + "/login?authSourceId=1");
    boolean elementExists = getWebDriver().findElements(By.className("index")).size() > 0;
    assertTrue(elementExists);

  }
}
