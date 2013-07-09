package fi.muikku.plugins.forum.dao;

import fi.muikku.dao.DAO;
import fi.muikku.model.security.ResourceRights;
import fi.muikku.model.users.UserEntity;
import fi.muikku.plugin.PluginDAO;
import fi.muikku.plugins.forum.model.EnvironmentForumArea;

@DAO
public class EnvironmentForumAreaDAO extends PluginDAO<EnvironmentForumArea> {

	private static final long serialVersionUID = 2917574952932278029L;

	public EnvironmentForumArea create(String name, Boolean archived, UserEntity owner, ResourceRights rights) {
		EnvironmentForumArea environmentForumArea = new EnvironmentForumArea();

		environmentForumArea.setName(name);
		environmentForumArea.setArchived(archived);
		environmentForumArea.setOwner(owner.getId());
		environmentForumArea.setRights(rights.getId());

		getEntityManager().persist(environmentForumArea);

		return environmentForumArea;
	}

}
