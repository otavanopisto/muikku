package fi.otavanopisto.muikku.plugins.exam.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.exam.model.ExamSettings;
import fi.otavanopisto.muikku.plugins.exam.model.ExamSettings_;

public class ExamSettingsDAO extends CorePluginsDAO<ExamSettings> {

  private static final long serialVersionUID = -8807476686994502077L;
  
  public ExamSettings findByWorkspaceFolderId(Long workspaceFolderId) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ExamSettings> criteria = criteriaBuilder.createQuery(ExamSettings.class);
    Root<ExamSettings> root = criteria.from(ExamSettings.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(ExamSettings_.workspaceFolderId), workspaceFolderId)
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

}
