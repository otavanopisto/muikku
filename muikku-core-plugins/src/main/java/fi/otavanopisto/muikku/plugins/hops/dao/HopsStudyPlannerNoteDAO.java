package fi.otavanopisto.muikku.plugins.hops.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.hops.model.HopsStudyPlannerNote;
import fi.otavanopisto.muikku.plugins.hops.model.HopsStudyPlannerNote_;

public class HopsStudyPlannerNoteDAO extends CorePluginsDAO<HopsStudyPlannerNote> {
  
  private static final long serialVersionUID = 2084591520223990597L;
  
  public HopsStudyPlannerNote create(Long userEntityId, String title, String content, Date startDate) {
    HopsStudyPlannerNote note = new HopsStudyPlannerNote();
    note.setUserEntityId(userEntityId);
    note.setTitle(title);
    note.setContent(content);
    note.setStartDate(startDate);
    return persist(note);
  }

  public HopsStudyPlannerNote update(HopsStudyPlannerNote note, String title, String content, Date startDate) {
    note.setTitle(title);
    note.setContent(content);
    note.setStartDate(startDate);
    return persist(note);
  }

  public List<HopsStudyPlannerNote> listByUserEntityId(Long userEntityId) {
    EntityManager entityManager = getEntityManager();
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<HopsStudyPlannerNote> criteria = criteriaBuilder.createQuery(HopsStudyPlannerNote.class);
    Root<HopsStudyPlannerNote> root = criteria.from(HopsStudyPlannerNote.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(HopsStudyPlannerNote_.userEntityId), userEntityId)
    );
    return entityManager.createQuery(criteria).getResultList();
  }

  @Override
  public void delete(HopsStudyPlannerNote note) {
    super.delete(note);
  }

}
