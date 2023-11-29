package fi.otavanopisto.muikku.wcag.communicator;

import java.io.FileNotFoundException;

import org.junit.Test;

import fi.otavanopisto.muikku.wcag.AbstractWCAGTest;

public class CommunicatorAT extends AbstractWCAGTest{
  
  @Test
  public void communicatorTest() throws FileNotFoundException {
    login(getTestStudent(), getTestStudentPassword(), true);
    navigate("/communicator", true);
    waitAndClick("a.button.button--primary-function");
    waitForVisible(".env-dialog__input--new-message-title");
    testAccessibility("Communicator create message view");
    waitAndClick(".button--dialog-cancel");

    navigate("/communicator#sent", true);
    waitForPresent(".application-list__item-body--communicator-message .application-list__header-item-body");
    testAccessibility("Communicator sent view");
    
    waitAndClick(".message:first-child");
    waitForPresent(".application-list__item-content-header");
    testAccessibility("Communicator message reading view");
    
    navigate("/communicator", true);
    waitAndClick(".application-panel__toolbar .button-pill--label");
    waitForVisible(".dropdown--communicator-labels");        
    testAccessibility("Communicator inbox view with label dropdown open");
    click(".button-pill--settings");
    waitAndClick(".dropdown--main-functions-settings .link--main-functions-settings-dropdown");
    waitForVisible(".env-dialog__body .cke_wysiwyg_div");
    testAccessibility("Signature dialog");
    
    navigate("/communicator#trash", true);
    waitForPresent(".application-list__item-header--communicator-message .application-list__header-primary");
    testAccessibility("Communicator trash view");
  }
}
