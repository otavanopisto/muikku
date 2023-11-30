package fi.otavanopisto.muikku.wcag;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.junit.After;
import org.junit.Before;

import fi.otavanopisto.muikku.ui.AbstractUITest;

public class AbstractWCAGTest extends AbstractUITest {
  
  @Before
  public void setUp() {
    Path path = Paths.get("target/WCAG/");
    try {
      Files.createDirectories(path);
    } catch (IOException e) {
    }
    setWebDriver(createLocalDriver());
  }
  
  @After
  public void report() {
    reportWCAG();
  }

  @Override
  public void setupRestAssured() {
    
  }
  
  @Override
  public void flushCaches() {

  }
  
}
