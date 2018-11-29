package fi.otavanopisto.muikku.plugins.transcriptofrecords.subjects;

/**
 * Matriculation subject model
 * 
 * @author Antti Leppä <antti.leppa@metatavu.fi>
 * @author Heikki Kurhinen <heikki.kurhinen@metatavu.fi>
 */
public class MatriculationSubject {

  private String code;
  
  /**
   * Returns code of the subject
   * 
   * @return code of the subject
   */
  public String getCode() {
    return code;
  }
  
  /**
   * Sets the code of the subject
   * 
   * @param code code of the subject
   */
  public void setCode(String code) {
    this.code = code;
  }
  
}