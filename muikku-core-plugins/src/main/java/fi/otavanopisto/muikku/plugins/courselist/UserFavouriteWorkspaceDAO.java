package fi.otavanopisto.muikku.plugins.courselist;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.courselist.UserFavouriteWorkspace_;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.courselist.UserFavouriteWorkspace;

public class UserFavouriteWorkspaceDAO extends CorePluginsDAO<UserFavouriteWorkspace> {

  private static final long serialVersionUID = 4895596425024979837L;

  public UserFavouriteWorkspace create(UserEntity user, WorkspaceEntity workspace) {
    UserFavouriteWorkspace favouriteWorkspace = new UserFavouriteWorkspace();

    favouriteWorkspace.setUser(user.getId());
    favouriteWorkspace.setWorkspaceEntity(workspace.getId());

    getEntityManager().persist(favouriteWorkspace);

    return favouriteWorkspace;
  }

  public List<UserFavouriteWorkspace> listByUser(UserEntity user) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<UserFavouriteWorkspace> criteria = criteriaBuilder.createQuery(UserFavouriteWorkspace.class);
    Root<UserFavouriteWorkspace> root = criteria.from(UserFavouriteWorkspace.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(UserFavouriteWorkspace_.user), user.getId())
    );

    return entityManager.createQuery(criteria).getResultList();
  }

}
