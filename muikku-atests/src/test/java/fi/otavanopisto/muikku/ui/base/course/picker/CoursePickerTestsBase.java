package fi.otavanopisto.muikku.ui.base.course.picker;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;
import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.List;

import org.joda.time.DateTime;
import org.junit.Test;
import org.openqa.selenium.By;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.joda.JodaModule;
import com.github.tomakehurst.wiremock.client.WireMock;

import fi.otavanopisto.muikku.SqlAfter;
import fi.otavanopisto.muikku.SqlBefore;
import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.atests.Workspace;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.mock.model.MockStudent;
import fi.otavanopisto.muikku.ui.AbstractUITest;
import fi.otavanopisto.muikku.ui.PyramusMocks;
import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.UserRole;
import fi.otavanopisto.pyramus.webhooks.WebhookStaffMemberCreatePayload;

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
  public void coursePickerLoadMoreTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      login();
      List<Workspace> workspaces = new ArrayList<>();
      for(Long i = (long) 0; i < 30; i++)
        workspaces.add(createWorkspace("testcourse", "test course for testing " + i.toString(), i.toString(), Boolean.TRUE));
      try {
        getWebDriver().get(getAppUrl(true) + "/coursepicker");
        waitForPresent("#coursesList");
        assertCount(".cp-course", 25);
        waitAndClick(".mf-paging-tool");
        waitForMoreThanSize(".cp-course", 25);
        assertCount(".cp-course", 30);
      } finally {
        for(Workspace w : workspaces) {
          deleteWorkspace(w.getId());        
        }
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }
  
}
