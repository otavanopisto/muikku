package fi.otavanopisto.muikku.ui.local.discussions;

import org.junit.Before;

import fi.otavanopisto.muikku.ui.base.discussions.DiscussionTestsBase;

public class DiscussionTestsIT extends DiscussionTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(createLocalDriver());
  }
  
}
