package fi.otavanopisto.muikku.plugins.forum.dao;


import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.forum.model.ForumArea;



public class ForumAreaDAO extends CorePluginsDAO<ForumArea> {

	private static final long serialVersionUID = 7656394805163829718L;
  
  @Override
  public void delete(ForumArea forumArea) {
    super.delete(forumArea);
  }
  
  public ForumArea updateArchived(ForumArea forumArea, Boolean archived) {
    forumArea.setArchived(archived);
    return persist(forumArea);
  }
  
  public ForumArea updateForumArea(ForumArea forumArea, String name) {
    forumArea.setName(name);
    return persist(forumArea);
  }
}
