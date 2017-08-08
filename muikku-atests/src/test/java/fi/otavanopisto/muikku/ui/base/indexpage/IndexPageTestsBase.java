package fi.otavanopisto.muikku.ui.base.indexpage;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;

import java.io.IOException;

import org.junit.Test;

import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.mock.model.MockStudent;
import fi.otavanopisto.muikku.ui.AbstractUITest;
import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.UserRole;

public class IndexPageTestsBase extends AbstractUITest {

  @Test
  public void indexPageTest() throws IOException {
    navigate("", true);
    waitForPresent(".of-header-wrapper");
    assertVisible(".of-header-wrapper");
    waitForPresent("#studying");
    assertVisible("#studying");
    waitForPresent("#videos");
    assertVisible("#videos");
    waitForPresent("#news");
    assertVisible("#news");
    waitForPresent("#organization");
    assertVisible("#organization");
    
  }
  
  @Test
  public void studentLoginTest() throws Exception {
    MockStudent student = new MockStudent(2l, 2l, "Second", "User", "teststudent@example.com", 1l, TestUtilities.toDate(1990, 1, 1), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    mockBuilder.addStudent(student).mockLogin(student).build();
    try{
      login();
      assertVisible("#loggedUser");      
    }finally {
      mockBuilder.wiremockReset();
    }

  }
  
  @Test
  public void adminLoginTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    try{
      login();
      assertVisible("#loggedUser");      
    }finally {
      mockBuilder.wiremockReset();
    }
  }
}
