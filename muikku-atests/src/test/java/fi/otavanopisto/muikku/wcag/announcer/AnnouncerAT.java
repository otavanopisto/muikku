package fi.otavanopisto.muikku.wcag.announcer;

import java.io.FileNotFoundException;

import org.junit.Test;

import fi.otavanopisto.muikku.wcag.AbstractWCAGTest;

public class AnnouncerAT extends AbstractWCAGTest {
  
  @Test
  public void announcementListTest() throws FileNotFoundException {
    login(getTestStudent(), getTestStudentPassword(), true);
    waitAndClick(".item-list__item--announcements .item-list__announcement-caption");    
    waitForPresent(".reading-panel__main-container header.article__header");
    testAccessibility("Announcements list");
  }

  @Test
  public void announcerTests() throws FileNotFoundException {
    login(getTestAdmin(), getTestAdminPassword(), true);
    navigate("/announcer", true);
    waitForPresent(".item-list__announcement-workspaces");
    testAccessibility("Announcer");
    waitAndClick(".button--primary-function");
    waitForVisible(".env-dialog__body .cke_wysiwyg_div");
    testAccessibility("Create announcement dialog");
    waitAndClick(".button--dialog-cancel");
    waitAndClick(".application-list .application-list__item:first-child .application-list__item-content-header");
    waitForPresent(".application-panel__toolbar-actions-main .button-pill--edit");
    testAccessibility("Single announcement in announcer");
    waitAndClick(".application-panel__toolbar-actions-main .button-pill--edit");
    waitForVisible(".env-dialog__body .cke_wysiwyg_div");
    testAccessibility("Edit view");
    navigate("/announcer", true);
    waitAndClick(".application-list .application-list__item:first-child .application-list__item-content-header");
    waitAndClick(".application-panel__toolbar-actions-main .button-pill--delete");
    waitForVisible(".dialog--delete-announcement.dialog--visible .dialog__content");
    testAccessibility("Delete dialog");
    waitAndClick(".button--standard-cancel");
    navigate("/announcer#archived", true);
    waitForPresent(".application-list .application-list__item:first-child .application-list__item-content-header");
    testAccessibility("Archived");
    waitAndClick(".application-list .application-list__item:first-child .application-list__item-content-header");
    waitForPresent(".button-pill__icon.icon-undo");
    testAccessibility("Archived announcement");
  }
}
