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
//  TODO: Create/edit etc. views
}
