package fi.otavanopisto.muikku.rest.test.plugins.announcer;

import fi.otavanopisto.muikku.AbstractRESTTest;

public class AbstractAnnouncerRESTTestsIT extends AbstractRESTTest {

  protected void permanentDeleteAnnouncements() {
    asAdmin().delete("/test/announcements");
  }
  
}
