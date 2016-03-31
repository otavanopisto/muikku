package fi.otavanopisto.muikku.dao.base;

import fi.otavanopisto.muikku.model.base.SchoolDataSource_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

public class SchoolDataSourceDAO extends CoreDAO<SchoolDataSource> {

  private static final long serialVersionUID = 7953980911123413195L;

  public SchoolDataSource create(String identifier) {
    SchoolDataSource dataSource = new SchoolDataSource();

    dataSource.setIdentifier(identifier);

    getEntityManager().persist(dataSource);

    return dataSource;
  }

  public SchoolDataSource findByIdentifier(String identifier) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<SchoolDataSource> criteria = criteriaBuilder.createQuery(SchoolDataSource.class);
    Root<SchoolDataSource> root = criteria.from(SchoolDataSource.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(SchoolDataSource_.identifier), identifier)
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

}
