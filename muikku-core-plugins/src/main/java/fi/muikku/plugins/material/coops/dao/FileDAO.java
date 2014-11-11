package fi.muikku.plugins.material.coops.dao;

import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.material.coops.model.File;

public class FileDAO extends CorePluginsDAO<File> {

  private static final long serialVersionUID = -8715223954604734705L;

  public File create(Long revisionNumber, String contentType, String data) {
    File file = new File();

    file.setContentType(contentType);
    file.setData(data);
    file.setRevisionNumber(revisionNumber);

    return persist(file);
  }

  public File updateData(fi.muikku.plugins.material.coops.model.File file, String data) {
    file.setData(data);
    return persist(file);
  }

  public File updateRevisionNumber(fi.muikku.plugins.material.coops.model.File file, Long revisionNumber) {
    file.setRevisionNumber(revisionNumber);
    return persist(file);
  }

}
