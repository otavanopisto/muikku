package fi.muikku.ui.local.evaluation;

import org.junit.After;
import org.junit.Before;

import fi.muikku.ui.base.evaluation.EvaluationTestsBase;

public class EvaluationTestsIT extends EvaluationTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(createLocalDriver());
  }

}
