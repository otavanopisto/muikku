package fi.otavanopisto.muikku.ui.local.evaluation;

import org.junit.Before;

import fi.otavanopisto.muikku.ui.base.evaluation.EvaluationTestsBase;

public class EvaluationTestsIT extends EvaluationTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(createLocalDriver());
  }

}
