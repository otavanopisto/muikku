package fi.otavanopisto.muikku.wcag.records;

import org.junit.Test;

import fi.otavanopisto.muikku.wcag.AbstractWCAGTest;

public class RecordsAT extends AbstractWCAGTest{
  
  @Test
  public void recordsTest() throws Exception {
    login(getTestStudent(), getTestStudentPassword(), true);
    navigate("/records", true);
    waitForVisible(".application-sub-panel__card-highlight--summary-activity");
    waitForVisible(".notes__item");
    testAccessibility("Records summary view");
    
    navigate("/records#records", true);
    refresh();
    waitForVisible(".application-list__content .application-list__header-primary-meta--records");
    testAccessibility("Records records view");
    
    waitAndClick(".application-list__item:nth-child(2)");
    waitForVisible(".workspace-assessment__grade-data");
    testAccessibility("Records with course opened");
    
    waitAndClick(".application-list__item:nth-child(2) .button--assignments-and-exercises");
    waitForVisible(".application-list__content");
    waitAndClick(".application-sub-panel__header--studies-assignments .link--studies-open-close:first-child");
    waitForVisible(".application-list__content .material-page__content");
    testAccessibility("Evaluated exercises opened");
  
    navigate("/records#hops", true);
    refresh();
    waitForVisible("#goalSecondarySchoolDegreeyes");
    waitForVisible("#additionalInfo");
    testAccessibility("Records view HOPS");
    
    navigate("/records#yo", true);
    refresh();
    waitForVisible(".application-sub-panel--yo-status-container");
    testAccessibility("Records yo view");
  }
}