package fi.otavanopisto.muikku.wcag;

import java.net.URL;

import org.junit.After;
import org.junit.Before;

import fi.otavanopisto.muikku.ui.AbstractUITest;

public class AbstractWCAGTest extends AbstractUITest {
  
  @Before
  public void setUp() {
    setWebDriver(createLocalDriver());
  }
  
  @After
  public void report() {
    reportWCAG();
  }

}
