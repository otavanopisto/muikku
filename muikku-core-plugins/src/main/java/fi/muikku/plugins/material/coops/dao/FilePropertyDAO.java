package fi.muikku.plugins.material.coops.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.material.coops.model.File;
import fi.muikku.plugins.material.coops.model.FileProperty;
import fi.muikku.plugins.material.coops.model.FileProperty_;

public class FilePropertyDAO extends CorePluginsDAO<FileProperty> {

  private static final long serialVersionUID = -8715223954604734705L;

  public FileProperty create(File file, String key, String value) {
    FileProperty fileProperty = new FileProperty();

    fileProperty.setFile(file);
    fileProperty.setKey(key);
    fileProperty.setValue(value);

    return persist(fileProperty);
  }

  public FileProperty findByFileAndKey(File file, String key) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<FileProperty> criteria = criteriaBuilder.createQuery(FileProperty.class);
    Root<FileProperty> root = criteria.from(FileProperty.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(FileProperty_.file), file),
        criteriaBuilder.equal(root.get(FileProperty_.key), key)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public List<FileProperty> listByFile(File file) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<FileProperty> criteria = criteriaBuilder.createQuery(FileProperty.class);
    Root<FileProperty> root = criteria.from(FileProperty.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(FileProperty_.file), file)
    );

    return entityManager.createQuery(criteria).getResultList();
  }

  public FileProperty updateValue(FileProperty fileProperty, String value) {
    fileProperty.setValue(value);
    return persist(fileProperty);
  }

}
