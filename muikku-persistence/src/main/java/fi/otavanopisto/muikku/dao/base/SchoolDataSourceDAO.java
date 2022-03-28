package fi.otavanopisto.muikku.dao.base;

import fi.otavanopisto.muikku.model.base.SchoolDataSource_;
import fi.otavanopisto.muikku.dao.CoreDAO;
import fi.otavanopisto.muikku.dao.MuikkuInjectionMonitor;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.enterprise.inject.spi.InjectionPoint;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

public class SchoolDataSourceDAO extends CoreDAO<SchoolDataSource> {

  private static final long serialVersionUID = 7953980911123413195L;

  @Inject private InjectionPoint injectionPoint;
  @Inject private MuikkuInjectionMonitor imon;
  
  @PostConstruct
  public void postConstruct() {
    String cln = injectionPoint != null ? injectionPoint.getMember().getDeclaringClass().getSimpleName() : "NO IP";
    imon.add(getClass().getSimpleName());
    imon.add(getClass().getSimpleName(), cln);
    System.out.println(String.format("%s.postConstruct %s", getClass().getSimpleName(), cln));
  }
  
  @PreDestroy
  public void preDestroy() {
    String cln = injectionPoint != null ? injectionPoint.getMember().getDeclaringClass().getSimpleName() : "NO IP";
    System.out.println(String.format("%s.preDestroy %s", getClass().getSimpleName(), cln));
  }

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
