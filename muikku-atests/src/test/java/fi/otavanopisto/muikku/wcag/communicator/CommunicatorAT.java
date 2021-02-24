package fi.otavanopisto.muikku.wcag.communicator;

import org.junit.Test;

import fi.otavanopisto.muikku.wcag.AbstractWCAGTest;

public class CommunicatorAT extends AbstractWCAGTest{
  
  @Test
  public void communicatorViewsTest() throws Exception {
    login(getTestStudent(), getTestStudentPassword(), true);
    navigate("/communicator", false);
    waitAndClick("a.button.button--primary-function");
    waitForVisible(".env-dialog__input--new-message-title");
    testAccessibility("Communicator create message view");
    waitAndClick(".button--dialog-cancel");

    navigate("/communicator#sent", false);
    waitForPresent(".application-list__item-body--communicator-message .application-list__header-item-body");
    testAccessibility("Communicator sent view");
    
    waitAndClick(".message:first-child");
    waitForPresent(".application-list__item-content-header");
    testAccessibility("Communicator message reading view");
    
    navigate("/communicator", false);        
    waitAndClick(".application-panel__toolbar .button-pill--label");
    waitForVisible(".dropdown--communicator-labels");        
    testAccessibility("Communicator inbox view");
  }
}
