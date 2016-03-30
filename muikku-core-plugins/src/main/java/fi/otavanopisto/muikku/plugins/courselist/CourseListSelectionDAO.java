package fi.otavanopisto.muikku.plugins.courselist;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.courselist.CourseListSelection_;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.courselist.CourseListSelection;
import fi.otavanopisto.muikku.plugins.courselist.CourseListSelectionEnum;

public class CourseListSelectionDAO extends CorePluginsDAO<CourseListSelection> {

  private static final long serialVersionUID = 4895596425024979837L;

  public CourseListSelection create(UserEntity user, String context, CourseListSelectionEnum selection) {
    CourseListSelection courseListSelection = new CourseListSelection();

    courseListSelection.setContext(context);
    courseListSelection.setUser(user.getId());
    courseListSelection.setSelection(selection);

    getEntityManager().persist(courseListSelection);

    return courseListSelection;
  }

  public CourseListSelection findByUserAndContext(UserEntity user, String context) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CourseListSelection> criteria = criteriaBuilder.createQuery(CourseListSelection.class);
    Root<CourseListSelection> root = criteria.from(CourseListSelection.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(CourseListSelection_.user), user.getId()),
        criteriaBuilder.equal(root.get(CourseListSelection_.context), context)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public CourseListSelection updateSelection(CourseListSelection selection, CourseListSelectionEnum newValue) {
    selection.setSelection(newValue);
    getEntityManager().persist(selection);
    return selection;
  }

}
