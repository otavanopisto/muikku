package fi.otavanopisto.muikku.plugins.forum.dao;


import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.forum.model.ForumAreaGroup;


public class ForumAreaGroupDAO extends CorePluginsDAO<ForumAreaGroup> {

	private static final long serialVersionUID = -8797157252142681349L;

  public ForumAreaGroup create(String name, Boolean archived) {
	  ForumAreaGroup forumAreaGroup = new ForumAreaGroup();

	  forumAreaGroup.setName(name);
		forumAreaGroup.setArchived(archived);

		getEntityManager().persist(forumAreaGroup);

		return forumAreaGroup;
	}
  
  @Override
  public void delete(ForumAreaGroup forumAreaGroup) {
    super.delete(forumAreaGroup);
  }
  
}
