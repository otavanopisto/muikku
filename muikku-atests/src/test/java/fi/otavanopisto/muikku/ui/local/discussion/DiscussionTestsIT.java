package fi.otavanopisto.muikku.ui.local.discussion;

import org.junit.Before;

import fi.otavanopisto.muikku.ui.base.discussion.DiscussionTestsBase;

public class DiscussionTestsIT extends DiscussionTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(createLocalDriver());
  }
  
}
