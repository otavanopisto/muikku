package fi.muikku.ui.base.course.users;

import org.junit.Test;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.joda.JodaModule;

import fi.muikku.TestUtilities;
import fi.muikku.atests.Workspace;
import fi.muikku.ui.AbstractUITest;
import fi.muikku.ui.PyramusMocks;
import fi.pyramus.webhooks.WebhookStudentCreatePayload;
import fi.pyramus.webhooks.WebhookStudentUpdatePayload;

public class CourseUsersTestsBase extends AbstractUITest {

  @Test
  public void courseUsersListTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    PyramusMocks.personsPyramusMocks();
    try {
      navigate(String.format("/workspace/%s/users", workspace.getUrlName()), true);
      waitForPresent(".workspace-students-listing-wrapper .workspace-users-name");
      assertText(".workspace-students-listing-wrapper .workspace-users-name", "User, Test");
      waitForPresent(".workspace-teachers-listing-wrapper .workspace-users-name");
      assertText(".workspace-teachers-listing-wrapper .workspace-users-name", "Administrator, Test");
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }
  
  @Test
  public void courseArchiveStudentTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    PyramusMocks.personsPyramusMocks();
    try {
      navigate(String.format("/workspace/%s/users", workspace.getUrlName()), true);
      waitForPresent(".workspace-students-listing-wrapper .workspace-users-name");
      waitAndClick("div[data-user-id='PYRAMUS-STUDENT-3']>div.workspace-users-archive");
      waitAndClick(".archive-button");
      waitForClickable(".workspace-students-list");
      ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
      String payload = objectMapper.writeValueAsString(new WebhookStudentUpdatePayload(1l));
      TestUtilities.webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
      reloadCurrentPage();
      waitForPresent(".workspace-students-list");
      assertNotPresent("div[data-user-id='PYRAMUS-STUDENT-3']");
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }
  
  @Test
  public void courseUnarchiveStudentTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    PyramusMocks.personsPyramusMocks();
    try {
      navigate(String.format("/workspace/%s/users", workspace.getUrlName()), true);
      waitForPresent(".workspace-students-listing-wrapper .workspace-users-name");
      waitAndClick("div[data-user-id='PYRAMUS-STUDENT-3']>div.workspace-users-archive");
      waitAndClick(".archive-button");
      waitForClickable(".workspace-students-list");
      waitAndClick(".workspace-students-inactive");
      waitAndClick("div[data-user-id='PYRAMUS-STUDENT-3']>div.workspace-users-unarchive");
      waitAndClick(".unarchive-button");
      waitForClickable(".workspace-students-list");
      ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
      String payload = objectMapper.writeValueAsString(new WebhookStudentUpdatePayload(1l));
      TestUtilities.webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
      reloadCurrentPage();
      waitForPresent(".workspace-students-list");
      waitAndClick(".workspace-students-active");
      waitForPresent(".workspace-students-list");
      assertPresent("div[data-user-id='PYRAMUS-STUDENT-3']");      
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }
  
}
