package fi.otavanopisto.muikku.rest.test.plugins.forum;

import fi.otavanopisto.muikku.AbstractRESTTest;

public class AbstractForumRESTTestsIT extends AbstractRESTTest {

  protected void permanentDeleteArea(Long forumAreaId) {
    // Uses atests-plugin to delete the forum area permanently
    asAdmin().delete("/test_forum/areas/{ID}", forumAreaId);
  }
  
  protected void permanentDeleteThread(Long areaGroupId, Long threadId) {
    // Uses atests-plugin to delete the thread permanently
    asAdmin().delete("/test_forum/areas/{ID}/threads/{TID}", areaGroupId, threadId);
  }
  
  protected void permanentDeleteThreadReply(Long areaGroupId, Long threadId, Long replyId) {
    // Uses atests-plugin to delete the thread reply permanently
    asAdmin().delete("/test_forum/areas/{ID}/threads/{TID}/replies/{RID}", areaGroupId, threadId, replyId);
  }
 
  protected void permanentDeleteAreaGroup(Long areaGroupId) {
    // Uses atests-plugin to delete the group permanently
    asAdmin().delete("/test/discussiongroups/{ID}", areaGroupId);
  }
  
}
