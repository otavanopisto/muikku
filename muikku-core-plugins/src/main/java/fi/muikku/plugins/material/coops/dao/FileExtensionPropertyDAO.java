package fi.muikku.plugins.material.coops.dao;

import fi.muikku.plugin.PluginDAO;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.plugins.material.coops.model.File;
import fi.muikku.plugins.material.coops.model.FileExtensionProperty;
import fi.muikku.plugins.material.coops.model.FileExtensionProperty_;

public class FileExtensionPropertyDAO extends PluginDAO<FileExtensionProperty> {

  private static final long serialVersionUID = -8715223954604734705L;

  public FileExtensionProperty create(File file, String key, String value) {
    FileExtensionProperty fileExtensionProperty = new FileExtensionProperty();

    fileExtensionProperty.setFile(file);
    fileExtensionProperty.setKey(key);
    fileExtensionProperty.setValue(value);

    return persist(fileExtensionProperty);
  }

  public FileExtensionProperty findByFileAndKey(File file, String key) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<FileExtensionProperty> criteria = criteriaBuilder.createQuery(FileExtensionProperty.class);
    Root<FileExtensionProperty> root = criteria.from(FileExtensionProperty.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(FileExtensionProperty_.file), file),
        criteriaBuilder.equal(root.get(FileExtensionProperty_.key), key)
      )
    );

    return getSingleResult(entityManager.createQuery(criteria));
  }

  public List<FileExtensionProperty> listByFile(File file) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<FileExtensionProperty> criteria = criteriaBuilder.createQuery(FileExtensionProperty.class);
    Root<FileExtensionProperty> root = criteria.from(FileExtensionProperty.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.equal(root.get(FileExtensionProperty_.file), file)
    );

    return entityManager.createQuery(criteria).getResultList();
  }

  public FileExtensionProperty updateValue(FileExtensionProperty fileExtensionProperty, String value) {
    fileExtensionProperty.setValue(value);
    return persist(fileExtensionProperty);
  }

}
