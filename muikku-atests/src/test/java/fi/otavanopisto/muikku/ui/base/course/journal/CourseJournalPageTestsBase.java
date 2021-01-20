package fi.otavanopisto.muikku.ui.base.course.journal;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;
import static org.junit.Assert.assertTrue;

import org.apache.commons.lang3.math.NumberUtils;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import org.junit.Test;

import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.atests.Workspace;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockCourseStudent;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.mock.model.MockStudent;
import fi.otavanopisto.muikku.ui.AbstractUITest;
import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.UserRole;

public class CourseJournalPageTestsBase extends AbstractUITest {

  @Test
  public void courseJournalToolsForTeacher() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      login();
      Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
      try {
        navigate(String.format("/workspace/%s/journal", workspace.getUrlName()), false);
        waitForPresent(".application-panel--workspace-journal select.form-element__select");
        assertVisible(".application-panel--workspace-journal select.form-element__select");
      } finally {
        deleteWorkspace(workspace.getId());
      }
    }
    finally {
      mockBuilder.wiremockReset();
    }
  }

  @Test
  public void courseJournalEntry() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      login();
      Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);

      Long courseId = NumberUtils.createLong(workspace.getIdentifier()); 
      MockCourseStudent courseStudent = new MockCourseStudent(1l, courseId, student.getId());
      mockBuilder.addCourseStudent(courseId, courseStudent).build();
      
      logout();
      mockBuilder.mockLogin(student);
      login();
      try {
        navigate(String.format("/workspace/%s/journal", workspace.getUrlName()), false);
        selectFinnishLocale();
        waitAndClick(".application-panel--workspace-journal .button--primary-function");
        addTextToCKEditor("content");
        sendKeys(".env-dialog__input--new-edit-journal-title", "title");
        click(".button--dialog-execute");
        waitForPresent(".application-list__item-header-main-content--journal-entry-title");
        assertText(".application-list__item-header-main-content--journal-entry-title", "title");
        waitForPresent(".application-list__item-content-body--journal-entry>p");
        assertText(".application-list__item-content-body--journal-entry>p", "content");
        waitForVisibleXPath("//span[@class='link link--application-list-item-footer' and contains(text(),'Muokkaa')]");
        waitForVisibleXPath("//span[@class='link link--application-list-item-footer' and contains(text(),'Poista')]");
      } finally {
        deleteWorkspace(workspace.getId());
      }
    } finally {
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void deleteCourseJournalEntry() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      login();
      Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);

      Long courseId = NumberUtils.createLong(workspace.getIdentifier()); 
      MockCourseStudent courseStudent = new MockCourseStudent(1l, courseId, student.getId());
      mockBuilder.addCourseStudent(courseId, courseStudent).build();
      
      logout();
      mockBuilder.mockLogin(student);
      login();
      try {
        navigate(String.format("/workspace/%s/journal", workspace.getUrlName()), false);
        selectFinnishLocale();
        waitAndClick(".application-panel--workspace-journal .button--primary-function");
        addTextToCKEditor("content");
        sendKeys(".env-dialog__input--new-edit-journal-title", "title");
        click(".button--dialog-execute");
        waitForPresent(".application-list__item-header-main-content--journal-entry-title");
        assertText(".application-list__item-header-main-content--journal-entry-title", "title");
        waitForPresent(".application-list__item-content-body--journal-entry>p");
        assertText(".application-list__item-content-body--journal-entry>p", "content");
        waitAndClickXPath("//span[@class='link link--application-list-item-footer' and contains(text(),'Poista')]");
        waitForVisible(".dialog--delete-journal");
        waitAndClick(".dialog--delete-journal .button--standard-ok");
        waitForNotVisible(".dialog--delete-journal");
        assertTrue("Element found even though it shouldn't be there", isElementPresent(".application-list__item-content-body--journal-entry>p") == false);
      } finally {
        deleteWorkspace(workspace.getId());
      }
    } finally {
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void editCourseJournalEntry() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      login();
      Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);

      Long courseId = NumberUtils.createLong(workspace.getIdentifier()); 
      MockCourseStudent courseStudent = new MockCourseStudent(1l, courseId, student.getId());
      mockBuilder.addCourseStudent(courseId, courseStudent).build();
      
      logout();
      mockBuilder.mockLogin(student);
      login();
      try {
        navigate(String.format("/workspace/%s/journal", workspace.getUrlName()), false);
        selectFinnishLocale();
        waitAndClick(".application-panel--workspace-journal .button--primary-function");
        addTextToCKEditor("content");
        sendKeys(".env-dialog__input--new-edit-journal-title", "title");
        click(".button--dialog-execute");
        waitForPresent(".application-list__item-header-main-content--journal-entry-title");
        assertText(".application-list__item-header-main-content--journal-entry-title", "title");
        waitForPresent(".application-list__item-content-body--journal-entry>p");
        assertText(".application-list__item-content-body--journal-entry>p", "content");
        waitAndClickXPath("//span[@class='link link--application-list-item-footer' and contains(text(),'Muokkaa')]");
        addToEndCKEditor(" More text.");
        click(".button--dialog-execute");
        waitForNotVisible(".env-dialog__wrapper");
        waitForPresent(".application-list__item-content-body--journal-entry>p");
        assertText(".application-list__item-content-body--journal-entry>p", "content More text.");
      } finally {
        deleteWorkspace(workspace.getId());
      }
    } finally {
      mockBuilder.wiremockReset();
    }
  }
  
}