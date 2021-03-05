package fi.otavanopisto.muikku.wcag.records;

import org.junit.Test;

import fi.otavanopisto.muikku.wcag.AbstractWCAGTest;

public class RecordsAT extends AbstractWCAGTest{
  
  @Test
  public void recordsTest() throws Exception {
    login(getTestStudent(), getTestStudentPassword(), true);
    navigate("/records", true);
    waitForPresent(".application-sub-panel__card-highlight--summary-activity");
    testAccessibility("Records summary view");
    navigate("/records#hops", true);
    waitForPresent(".form-element__radio-option-container #goalMatriculationExamyes");
    testAccessibility("Records view HOPS");
    navigate("/records#records", true);
    waitForPresent(".application-list__header-primary");
    testAccessibility("Records records view");
    waitAndClick(".course--studies:first-child");
    waitForPresent(".workspace-assessment__literal");
    waitForPresent(".application-list__item.assignment:first-child");
    testAccessibility("Records single course view");   
  }
}