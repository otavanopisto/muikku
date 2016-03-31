package fi.otavanopisto.muikku.model.util;

/**
 * Interface that defines common methods for archivable entities.
 *  
 * @author antti.viljakainen
 */
public interface ArchivableEntity {

  Boolean getArchived();
  
  void setArchived(Boolean archived);
}
