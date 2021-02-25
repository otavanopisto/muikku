package fi.otavanopisto.muikku.wcag.course;

import java.io.FileNotFoundException;

import org.junit.Test;

import fi.otavanopisto.muikku.wcag.AbstractWCAGTest;

public class CourseAT extends AbstractWCAGTest{
  
  @Test
  public void courseFrontpageAndMaterialsTests() throws FileNotFoundException {
    login(getTestStudent(), getTestStudentPassword(), true);
    waitAndClick(".item-list__item--workspaces");
    waitForVisible(".hero__workspace-title");
    testAccessibility("Workspace frontpage.");
    
    waitAndClick(".item-list__item--teacher:first-child .button--contact-teacher");
    waitForVisible(".env-dialog__body .env-dialog__row--ckeditor");
    testAccessibility("Contact course teacher");
    
    waitAndClick(".navbar__item--materials a");
    waitForVisible(".material-page");
    testAccessibility("Workspace materials view");
  }
  
  @Test
  public void journalTests() throws FileNotFoundException {
    login(getTestStudent(), getTestStudentPassword(), true);
    waitAndClick(".item-list__item--workspaces");
    waitAndClick(".navbar__item--journal a");
    waitForVisible(".application-list__item-header-main--journal-entry");
    testAccessibility("Workspace journal view:");
    
    waitAndClick(".application-list__item-footer--journal-entry span:nth-child(2)");
    waitForVisible(".dialog__window--delete-journal");
    testAccessibility("Workspace journal delete dialog:");
    waitAndClick(".dialog__close");
    
    waitAndClick(".application-panel--workspace-journal .button--primary-function");
    waitForVisible(".env-dialog--new-edit-journal");
    testAccessibility("Worspace journal create view:");
  }

  @Test
  public void assesmentRequestDialogTest() throws FileNotFoundException {
    login(getTestStudent(), getTestStudentPassword(), true);
    waitAndClick(".item-list__item--workspaces");
    waitAndClick(".navbar__item--assessment-request");
    waitForVisible(".dialog--evaluation-request-dialog");
    testAccessibility("Assesment request dialog");
  }

}
