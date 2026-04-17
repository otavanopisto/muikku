package fi.otavanopisto.muikku.ui.local.languageprofile;

import org.junit.Before;

import fi.otavanopisto.muikku.ui.base.guider.GuiderTestsBase;
import fi.otavanopisto.muikku.ui.base.languageprofile.LanguageProfileTestsBase;

public class LanguageProfileTestsIT extends LanguageProfileTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(createLocalDriver());
  }

}
