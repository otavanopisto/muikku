package fi.otavanopisto.muikku.ui.local.newevaluation;

import org.junit.Before;

import fi.otavanopisto.muikku.ui.base.newevaluation.NewEvaluationTestsBase;

public class NewEvaluationTestsIT extends NewEvaluationTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(createLocalDriver());
  }

}
