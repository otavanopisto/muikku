package fi.otavanopisto.muikku.plugins.hops.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.hops.model.HopsPlannedCourse;
import fi.otavanopisto.muikku.plugins.hops.model.HopsPlannedCourse_;

public class HopsPlannedCourseDAO extends CorePluginsDAO<HopsPlannedCourse> {

  private static final long serialVersionUID = -7149518989897915263L;
  
  public HopsPlannedCourse create(Long userEntityId, String category, String name, Integer courseNumber, Integer length, String lengthSymbol,
      String subjectCode, Boolean mandatory, Date startDate, Long duration, Long workspaceEntityId) {
    HopsPlannedCourse hopsPlannedCourse = new HopsPlannedCourse();
    hopsPlannedCourse.setUserEntityId(userEntityId);
    hopsPlannedCourse.setCategory(category);
    hopsPlannedCourse.setName(name);
    hopsPlannedCourse.setCourseNumber(courseNumber);
    hopsPlannedCourse.setLength(length);
    hopsPlannedCourse.setLengthSymbol(lengthSymbol);
    hopsPlannedCourse.setSubjectCode(subjectCode);
    hopsPlannedCourse.setMandatory(mandatory);
    hopsPlannedCourse.setStartDate(startDate);
    hopsPlannedCourse.setDuration(duration);
    hopsPlannedCourse.setWorkspaceEntityId(workspaceEntityId);
    return persist(hopsPlannedCourse);
  }

  public List<HopsPlannedCourse> listByUserEntityIdAndCategory(Long userEntityId, String category) {
    EntityManager entityManager = getEntityManager();
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<HopsPlannedCourse> criteria = criteriaBuilder.createQuery(HopsPlannedCourse.class);
    Root<HopsPlannedCourse> root = criteria.from(HopsPlannedCourse.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(HopsPlannedCourse_.userEntityId), userEntityId),
        criteriaBuilder.equal(root.get(HopsPlannedCourse_.category), category)
      )
    );
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public HopsPlannedCourse update(HopsPlannedCourse hopsPlannedCourse, String name, Integer courseNumber, Integer length, String lengthSymbol,
      String subjectCode, Boolean mandatory, Date startDate, Long duration, Long workspaceEntityId) {
    hopsPlannedCourse.setName(name);
    hopsPlannedCourse.setCourseNumber(courseNumber);
    hopsPlannedCourse.setLength(length);
    hopsPlannedCourse.setLengthSymbol(lengthSymbol);
    hopsPlannedCourse.setSubjectCode(subjectCode);
    hopsPlannedCourse.setMandatory(mandatory);
    hopsPlannedCourse.setStartDate(startDate);
    hopsPlannedCourse.setDuration(duration);
    hopsPlannedCourse.setWorkspaceEntityId(workspaceEntityId);
    return persist(hopsPlannedCourse);
  }

  @Override
  public void delete(HopsPlannedCourse hopsPlannedCourse) {
    super.delete(hopsPlannedCourse);
  }

}
