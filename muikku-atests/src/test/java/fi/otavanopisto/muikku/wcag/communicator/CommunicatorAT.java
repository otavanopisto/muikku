package fi.otavanopisto.muikku.wcag.communicator;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import org.junit.Test;

import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.mock.model.MockStudent;
import fi.otavanopisto.muikku.wcag.AbstractWCAGTest;
import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.UserRole;

public class CommunicatorAT extends AbstractWCAGTest{
  
  @Test
  public void communicatorViewsTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
    try{
      try{
        login();
        navigate("/communicator", false);
        waitAndClick("a.button.button--primary-function");
        waitForVisible(".env-dialog__input--new-message-title");
        testAccessibility("Communicator create message view");
        waitAndClick(".button--dialog-cancel");
        long sender = getUserIdByEmail("admin@example.com");
        long recipient = getUserIdByEmail("student@example.com");
        for(int i = 0; i < 5; i++)
          createCommunicatorMesssage("Test " + i, "Test content " + i, sender, recipient);
        
        navigate("/communicator#sent", false);
        waitForPresent(".application-list__item-body--communicator-message .application-list__header-item-body");
        testAccessibility("Communicator sent view");
        logout();
        mockBuilder.mockLogin(student);
        login();
        navigate("/communicator", false);
        testAccessibility("Communicator inbox view");
        waitAndClick(".message:first-child");
        waitForPresent(".application-list__item-content-header");
        testAccessibility("Communicator message reading view");
        navigate("/communicator", false);        
        waitAndClick(".application-panel__toolbar .button-pill--label");
        waitForVisible(".dropdown--communicator-labels");
        testAccessibility("Communicator inbox labels dialog");
      }finally{
        deleteCommunicatorMessages();
      }
    }finally {
      mockBuilder.wiremockReset();
    } 
  }
}
