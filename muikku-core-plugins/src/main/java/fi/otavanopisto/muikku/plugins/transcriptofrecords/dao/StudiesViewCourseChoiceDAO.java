package fi.otavanopisto.muikku.plugins.transcriptofrecords.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.model.StudiesViewCourseChoice;
import fi.otavanopisto.muikku.plugins.transcriptofrecords.model.StudiesViewCourseChoice_;

public class StudiesViewCourseChoiceDAO extends CorePluginsDAO<StudiesViewCourseChoice> {

  private static final long serialVersionUID = 9186709136813L;
  
  public StudiesViewCourseChoice create(
      String subjectSchoolDataIdentifier,
      int courseNumber,
      String studentSchoolDataIdentifier
  ) {
    EntityManager entityManager = getEntityManager();
    StudiesViewCourseChoice studiesViewCourseChoice = new StudiesViewCourseChoice(
        subjectSchoolDataIdentifier,
        courseNumber,
        studentSchoolDataIdentifier
    );
    entityManager.persist(studiesViewCourseChoice);
    return studiesViewCourseChoice;
  }
  
  public StudiesViewCourseChoice find(
      String subjectSchoolDataIdentifier,
      int courseNumber,
      String studentSchoolDataIdentifier
  ) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<StudiesViewCourseChoice> criteria = criteriaBuilder.createQuery(StudiesViewCourseChoice.class);
    Root<StudiesViewCourseChoice> root = criteria.from(StudiesViewCourseChoice.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(
            root.get(StudiesViewCourseChoice_.subjectSchoolDataIdentifier),
            subjectSchoolDataIdentifier),
        criteriaBuilder.equal(
            root.get(StudiesViewCourseChoice_.courseNumber),
            courseNumber),
        criteriaBuilder.equal(
            root.get(StudiesViewCourseChoice_.studentSchoolDataIdentifier),
            studentSchoolDataIdentifier)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }
  
  @Override
  public void delete(StudiesViewCourseChoice e) {
    super.delete(e);
  }
}
