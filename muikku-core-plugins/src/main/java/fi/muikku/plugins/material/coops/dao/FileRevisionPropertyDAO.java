package fi.muikku.plugins.material.coops.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.material.coops.model.FileRevisionProperty;
import fi.muikku.plugins.material.coops.model.FileRevisionProperty_;
import fi.muikku.plugins.material.coops.model.FileRevision;

public class FileRevisionPropertyDAO extends CorePluginsDAO<FileRevisionProperty> {

  private static final long serialVersionUID = -8715223954604734705L;

  public FileRevisionProperty create(FileRevision fileRevision, String key, String value) {
    FileRevisionProperty fileRevisionProperty = new FileRevisionProperty();

    fileRevisionProperty.setFileRevision(fileRevision);
    fileRevisionProperty.setValue(value);
    fileRevisionProperty.setKey(key);

    return persist(fileRevisionProperty);
  }

  public List<FileRevisionProperty> listByFileRevision(FileRevision fileRevision) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<FileRevisionProperty> criteria = criteriaBuilder.createQuery(FileRevisionProperty.class);
    Root<FileRevisionProperty> root = criteria.from(FileRevisionProperty.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(FileRevisionProperty_.fileRevision), fileRevision)
    );

    return entityManager.createQuery(criteria).getResultList();
  }

}
