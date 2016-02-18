package fi.muikku.ui.base.indexpage;

import static fi.muikku.mock.PyramusMock.mocker;
import static org.junit.Assert.assertTrue;

import java.io.IOException;

import org.joda.time.DateTime;
import org.junit.Test;
import org.openqa.selenium.By;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.joda.JodaModule;
import com.github.tomakehurst.wiremock.client.WireMock;

import fi.muikku.mock.PyramusMock.Builder;
import fi.muikku.mock.model.MockStaffMember;
import fi.muikku.mock.model.MockStudent;
import fi.muikku.ui.AbstractUITest;
import fi.muikku.ui.PyramusMocks;
import fi.muikku.TestUtilities;
import fi.pyramus.rest.model.Sex;
import fi.pyramus.rest.model.UserRole;
import fi.pyramus.webhooks.WebhookStaffMemberCreatePayload;
import fi.pyramus.webhooks.WebhookStudentCreatePayload;

public class IndexPageTestsBase extends AbstractUITest {

  @Test
  public void indexPageTest() throws IOException {
    navigate("", true);
    assertVisible("main.content");
  }
  
  @Test
  public void studentLoginTest() throws Exception {
    MockStudent student = new MockStudent(2l, 2l, "Second", "User", "teststudent@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE);
    Builder mockBuilder = mocker();
    mockBuilder.addStudent(student).mockLogin(student).build();
    login();
    assertVisible("#loggedUser");
  }
  
  @Test
  public void adminLoginTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    mocker().addStaffMember(admin).mockLogin(admin).build();
    login();
    assertVisible("#loggedUser");
  }
}
