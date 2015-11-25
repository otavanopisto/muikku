package fi.muikku.plugins.forum.dao;


import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.forum.model.ForumArea;



public class ForumAreaDAO extends CorePluginsDAO<ForumArea> {

	private static final long serialVersionUID = 7656394805163829718L;
  
  @Override
  public void delete(ForumArea forumArea) {
    super.delete(forumArea);
  }
  
  public ForumArea updateForumArea(ForumArea forumArea, String name) {
    forumArea.setName(name);
    return persist(forumArea);
  }
}
