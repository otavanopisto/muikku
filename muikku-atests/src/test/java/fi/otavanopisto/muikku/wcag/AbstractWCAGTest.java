package fi.otavanopisto.muikku.wcag;

import java.net.URL;

import org.junit.Before;

import fi.otavanopisto.muikku.ui.AbstractUITest;

public class AbstractWCAGTest extends AbstractUITest {

  protected static final URL scriptUrl = AbstractWCAGTest.class.getResource("/axe.min.js");

  @Before
  public void setUp() {
    // ChromeDriver needed to test for Shadow DOM testing support
    setWebDriver(createLocalDriver());
  }
    
}
