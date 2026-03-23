package fi.otavanopisto.muikku.plugins.exam.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.exam.model.ExamAttendance;
import fi.otavanopisto.muikku.plugins.exam.model.ExamAttendance_;

public class ExamAttendanceDAO extends CorePluginsDAO<ExamAttendance> {

  private static final long serialVersionUID = 8315904028267869957L;
  
  public ExamAttendance create(Long workspaceFolderId, Long userEntityId) {
    ExamAttendance attendance = new ExamAttendance();
    attendance.setWorkspaceFolderId(workspaceFolderId);
    attendance.setUserEntityId(userEntityId);
    return persist(attendance);
  }
  
  public ExamAttendance updateExtraMinutes(ExamAttendance attendance, Integer extraMinutes) {
    attendance.setExtraMinutes(extraMinutes);
    return persist(attendance);
  }
  
  public ExamAttendance updateStarted(ExamAttendance attendance, Date started) {
    attendance.setStarted(started);
    return persist(attendance);
  }

  public ExamAttendance updateArchived(ExamAttendance attendance, boolean archived) {
    attendance.setArchived(archived);
    return persist(attendance);
  }

  public ExamAttendance updateEnded(ExamAttendance attendance, Date ended) {
    attendance.setEnded(ended);
    return persist(attendance);
  }
  
  public ExamAttendance updateWorkspaceMaterialIds(ExamAttendance attendance, String workspaceMaterialIds) {
    attendance.setWorkspaceMaterialIds(workspaceMaterialIds);
    return persist(attendance);
  }
  
  public List<ExamAttendance> listByWorkspaceFolderId(Long workspaceFolderId) {
    EntityManager entityManager = getEntityManager();
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ExamAttendance> criteria = criteriaBuilder.createQuery(ExamAttendance.class);
    Root<ExamAttendance> root = criteria.from(ExamAttendance.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(ExamAttendance_.workspaceFolderId), workspaceFolderId)
    );
    return entityManager.createQuery(criteria).getResultList();
  }

  public List<ExamAttendance> listByWorkspaceFolderIdAndArchived(Long workspaceFolderId, boolean archived) {
    EntityManager entityManager = getEntityManager();
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ExamAttendance> criteria = criteriaBuilder.createQuery(ExamAttendance.class);
    Root<ExamAttendance> root = criteria.from(ExamAttendance.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(          
        criteriaBuilder.equal(root.get(ExamAttendance_.workspaceFolderId), workspaceFolderId),
        criteriaBuilder.equal(root.get(ExamAttendance_.archived), archived)
      )
    );
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public ExamAttendance findByWorkspaceFolderIdAndUserEntityId(Long workspaceFolderId, Long userEntityId) {
    EntityManager entityManager = getEntityManager();
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ExamAttendance> criteria = criteriaBuilder.createQuery(ExamAttendance.class);
    Root<ExamAttendance> root = criteria.from(ExamAttendance.class);
    criteria.select(root);
    criteria.where(
       criteriaBuilder.and(          
         criteriaBuilder.equal(root.get(ExamAttendance_.workspaceFolderId), workspaceFolderId),
         criteriaBuilder.equal(root.get(ExamAttendance_.userEntityId), userEntityId)
       )
    );
    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  public void delete(ExamAttendance attendance) {
    super.delete(attendance);
  }

}
