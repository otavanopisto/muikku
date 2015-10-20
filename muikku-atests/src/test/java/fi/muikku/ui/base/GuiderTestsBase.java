package fi.muikku.ui.base;

import org.junit.Test;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.joda.JodaModule;

import fi.muikkku.ui.AbstractUITest;
import fi.muikku.atests.Workspace;
import fi.pyramus.webhooks.WebhookPersonCreatePayload;
import fi.pyramus.webhooks.WebhookStudentCreatePayload;

public class GuiderTestsBase extends AbstractUITest {

  @Test
  public void filterByNameTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    String payload = objectMapper.writeValueAsString(new WebhookStudentCreatePayload((long) 1));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    payload = objectMapper.writeValueAsString(new WebhookPersonCreatePayload((long) 1));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    payload = objectMapper.writeValueAsString(new WebhookStudentCreatePayload((long) 5));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    payload = objectMapper.writeValueAsString(new WebhookPersonCreatePayload((long) 5));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    try {  
      navigate("/guider", true);
      sendKeys(".gt-search .search", "Second User");
      assertText(".gt-user .gt-user-meta-topic>span", "Second User");
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }
  
  @Test
  public void filterByWorkspaceTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    createWorkspace("diffentcourse", "Second test course", "2", Boolean.TRUE);
    try {  
      navigate("/guider", true);
      sendKeys(".gt-search .search", "different");
      assertText(".gt-user .gt-user-meta-topic>span", "Second User");
      sendKeys(".gt-search .search", "test");
      assertText(".gt-user .gt-user-meta-topic>span", "Test User");
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }
  
}