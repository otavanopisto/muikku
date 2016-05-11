package fi.otavanopisto.muikku.ui.base.course.picker;

import static org.junit.Assert.assertTrue;

import org.junit.Test;
import org.openqa.selenium.By;

import com.github.tomakehurst.wiremock.client.WireMock;

import fi.otavanopisto.muikku.atests.Workspace;
import fi.otavanopisto.muikku.ui.AbstractUITest;
import fi.otavanopisto.muikku.ui.PyramusMocks;

public class CoursePickerTestsBase extends AbstractUITest {
  
  @Test
  public void coursePickerExistsTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    PyramusMocks.personsPyramusMocks();
    try {
      getWebDriver().get(getAppUrl(true) + "/coursepicker");
      waitForElementToBePresent(By.id("coursesList"));
      boolean elementExists = getWebDriver().findElements(By.id("coursesList")).size() > 0;
      WireMock.reset();
      assertTrue(elementExists);
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }
 
}
