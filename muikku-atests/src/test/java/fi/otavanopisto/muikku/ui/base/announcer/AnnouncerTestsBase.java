package fi.otavanopisto.muikku.ui.base.announcer;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;
import static org.junit.Assert.assertTrue;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

import org.junit.Test;

import com.fasterxml.jackson.core.JsonProcessingException;

import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.mock.model.MockStudent;
import fi.otavanopisto.muikku.ui.AbstractUITest;
import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.UserRole;

public class AnnouncerTestsBase extends AbstractUITest {

  @Test
  public void createAnnouncementTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    try{
      try{
        login();
        navigate("/announcer", false);
        waitAndClick(".application-panel__actions-aside  > a.button--primary-function");
        waitForPresent(".cke_contents");
        waitForPresent(".env-dialog__input--date-picker");
        click(".env-dialog__input--date-picker");
        waitForPresent(".react-datepicker-popper");
        waitAndClick(".env-dialog__header");
        waitForNotVisible(".react-datepicker-popper");
        sleep(500);
        sendKeys(".env-dialog__form-element-container--title>input", "Test title");
        sleep(500);
        addTextToCKEditor("Announcer test announcement");
        waitAndClick(".button--dialog-execute");
        waitForNotVisible(".env-dialog");
        waitForPresent(".application-list__item-content-header");
        assertTextIgnoreCase(".application-list__item-content-header", "Test title");
      }finally{
        deleteAnnouncements();
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void deleteAnnouncementTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    try{
      try{
        login();
        createAnnouncement(admin.getId(), "Test title", "Announcer test announcement", date(115, 10, 12), date(135, 10, 12), false, true, null, null);
        navigate("/announcer", false);
        waitForPresent(".application-list__item-content-header");
        waitAndClick(".application-list__item-content-aside .form-element--item-selection-container input");
        waitAndClick("span.button-pill__icon.icon-trash");
        waitForVisible(".dialog a.button--standard-ok");
        sleep(500);
        waitAndClick("a.button--standard-ok");
        waitForNotVisible(".dialog.dialog--delete-announcement.dialog--visible");
        waitForNotVisible(".application-list__item-content-header");
        reloadCurrentPage();
        waitForPresent(".application-panel__content-main");
        assertTrue("Element found even though it shouldn't be there", isElementPresent(".application-list__item-content-header") == false);
        navigate("/", false);
        navigate("/announcer#archived", false);
        waitForPresent(".application-list__item-content-header");
        assertTextIgnoreCase(".application-list__item-content-header", "Test title");
      }finally{
        deleteAnnouncements();
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void announcementVisibleInFrontpageWidgetTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      login();
      try{
        createAnnouncement(admin.getId(), "Test title", "Announcer test announcement", date(115, 10, 12), date(135, 10, 12), false, true, null, null);
        logout();
        mockBuilder.mockLogin(student);
        login();
        waitForVisible(".item-list__item--announcements .item-list__announcement-caption");
        assertTextIgnoreCase(".item-list__item--announcements .item-list__announcement-caption", "Test title");
        
        waitForVisible(".item-list__item--announcements .item-list__announcement-date");
        assertTextIgnoreCase(".item-list__item--announcements .item-list__announcement-date", "12.11.2015");
      }finally{
        archiveUserByEmail(student.getEmail());
        deleteAnnouncements();
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }

  @Test
  public void announcementListTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      login();
      try{
        createAnnouncement(admin.getId(), "Test title", "<p>Announcer test announcement</p>", date(115, 10, 12), date(135, 10, 12), false, true, null, null);
        logout();
        mockBuilder.mockLogin(student);
        login();

        waitForVisible(".item-list__item--announcements .item-list__announcement-caption");
        assertTextIgnoreCase(".item-list__item--announcements .item-list__announcement-caption", "Test title");
        waitAndClick(".item-list__item--announcements .item-list__announcement-caption");
        
        waitForPresent(".reading-panel__main-container header.article__header");
        assertTextIgnoreCase(".reading-panel__main-container header.article__header", "Test title");
        assertTextIgnoreCase(".reading-panel__main-container header.article__header + div", "12.11.2015");
        assertTextIgnoreCase(".reading-panel__main-container .article__body p", "Announcer test announcement");
      }finally{
        archiveUserByEmail(student.getEmail());
        deleteAnnouncements();
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }

  @Test
  public void userGroupAnnouncementVisibleTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStaffMember(admin).addStudent(student).addStudentGroup(2l, 1l, "Test group", "Test group for users", 1l, false, false).mockLogin(admin).build();
      login();
      mockBuilder.addStudentToStudentGroup(2l, student).addStaffMemberToStudentGroup(2l, admin).mockPersons().mockStudents().mockStudyProgrammes().mockStudentGroups();
      try{
        List<Long> userGroups = new ArrayList<>();
        userGroups.add(2l);
        createAnnouncement(admin.getId(), "Test title", "Announcer test announcement", date(115, 10, 12), date(135, 10, 12), false, false, userGroups, null);
        logout();
        mockBuilder.mockLogin(student);
        login();

        waitForVisible(".item-list__item--announcements .item-list__announcement-caption");
        assertTextIgnoreCase(".item-list__item--announcements .item-list__announcement-caption", "Test title");
        
        waitForVisible(".item-list__item--announcements .item-list__announcement-date");
        assertTextIgnoreCase(".item-list__item--announcements .item-list__announcement-date", "12.11.2015");
      }finally{
        deleteAnnouncements();
        deleteUserGroupUsers();
        archiveUserByEmail(student.getEmail());
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void userGroupAnnouncementNotVisibleTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).addStudent(student).addStudentGroup(2l, 1l, "Test group", "Test group for users", 1l, false, false).mockLogin(admin).build();
      login();
      mockBuilder.addStaffMemberToStudentGroup(2l, admin).mockPersons().mockStudents().mockStudyProgrammes().mockStudentGroups();
      try{
        List<Long> userGroups = new ArrayList<>();
        userGroups.add(2l);
        createAnnouncement(admin.getId(), "Test title", "Announcer test announcement", date(115, 10, 12), date(135, 10, 12), false, false, userGroups, null);
        logout();
        mockBuilder.mockLogin(student);
        login();
        waitForVisible(".panel--announcements");
        
        assertTrue("Element found even though it shouldn't be there", isElementPresent(".item-list__item--announcements .item-list__announcement-caption") == false);
      }finally{
        deleteAnnouncements();
        deleteUserGroupUsers();
        archiveUserByEmail(student.getEmail());
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void pastAnnnouncementsListTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);

    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    login();    
    createAnnouncement(admin.getId(), "Test title", "Announcer test announcement", date(115, 10, 12), date(115, 10, 15), false, true, null, null);
    try {
      navigate("/announcer", false);
      waitForPresent(".application-panel__content-main.loader-empty");
      navigate("/", false);
      navigate("/announcer#expired", false);
      waitForPresent(".application-list__item-content-header");
      assertTextIgnoreCase(".application-list__item-content-header", "Test title");
      navigate("/", false);
      waitForVisible(".panel--announcements");
      assertTrue("Element found even though it shouldn't be there", isElementPresent(".item-list__item--announcements .item-list__announcement-caption") == false);
    }finally{
      deleteAnnouncements();
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void myAnnnouncementsListTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    MockStaffMember another = new MockStaffMember(3l, 3l, 1l, "Another", "User", UserRole.ADMINISTRATOR, "121212-1234", "blaablaa@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStaffMember(another).addStudent(student).mockLogin(admin).build();
    login();    
    createAnnouncement(admin.getId(), "Test title", "Announcer test announcement", date(115, 10, 12), new java.util.Date(), false, true, null, null);
    createAnnouncement(another.getId(), "Another test title", "Another announcer test announcement", date(115, 10, 12), new java.util.Date(), false, true, null, null);
    try {
      navigate("/announcer", false);
      waitForPresent(".application-list__item-content-header");
      assertCount(".application-list__item-content-header" ,2);
      navigate("/", false);
      navigate("/announcer#own", false);
      waitForPresent(".application-list__item-content-header");
      assertTextIgnoreCase(".application-list__item-content-header ", "Test title");
      assertCount(".application-list__item-content-header" ,1);
    }finally{
      deleteAnnouncements();
      archiveUserByEmail(student.getEmail());
      mockBuilder.wiremockReset();
    }
  }
  
}
