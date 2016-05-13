package fi.otavanopisto.muikku.ui.base.course.picker;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;
import static org.junit.Assert.assertTrue;

import org.junit.Test;
import org.openqa.selenium.By;

import com.github.tomakehurst.wiremock.client.WireMock;

import fi.otavanopisto.muikku.atests.Workspace;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.ui.AbstractUITest;
import fi.otavanopisto.muikku.ui.PyramusMocks;
import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.UserRole;

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

  @Test
  public void coursePickerSearchTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      login();
      Workspace workspace1 = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
      Workspace workspace2 = createWorkspace("wiener course", "wiener course for testing", "2", Boolean.TRUE);
      Workspace workspace3 = createWorkspace("potato course", "potato course for testing", "3", Boolean.TRUE);
      try {
        navigate("/coursepicker", true);
        waitForPresent("#coursesList");
        waitAndSendKeys(".cp-search-field input.search", "potato");

        waitForPresent(".cp-course-long-name");
        assertTextIgnoreCase(".cp-course-long-name", "potato course");
      } finally {
        deleteWorkspace(workspace1.getId());
        deleteWorkspace(workspace2.getId());
        deleteWorkspace(workspace3.getId());
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void coursePickerSearchTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      login();
      Workspace workspace1 = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
      Workspace workspace2 = createWorkspace("wiener course", "wiener course for testing", "2", Boolean.TRUE);
      Workspace workspace3 = createWorkspace("potato course", "potato course for testing", "3", Boolean.TRUE);
      try {
        navigate("/coursepicker", true);
        waitForPresent("#coursesList");
        waitAndSendKeys(".cp-search-field input.search", "potato");
        waitUntilElementCount(".cp-course-long-name", 1);
        assertTextIgnoreCase(".cp-course-long-name", "potato course");
      } finally {
        deleteWorkspace(workspace1.getId());
        deleteWorkspace(workspace2.getId());
        deleteWorkspace(workspace3.getId());
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }
  
}
