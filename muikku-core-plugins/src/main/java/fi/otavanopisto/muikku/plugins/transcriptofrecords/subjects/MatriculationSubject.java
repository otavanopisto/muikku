package fi.otavanopisto.muikku.plugins.transcriptofrecords.subjects;

/**
 * Matriculation subject model
 * 
 * @author Antti Leppä <antti.leppa@metatavu.fi>
 * @author Heikki Kurhinen <heikki.kurhinen@metatavu.fi>
 */
public class MatriculationSubject {

  private String name;
  private String value;
  
  /**
   * Returns name of the subject
   * 
   * @return name of the subject
   */
  public String getName() {
    return name;
  }
  
  /**
   * Sets the name of the subject
   * 
   * @param name name of the subject
   */
  public void setName(String name) {
    this.name = name;
  }
  
  /**
   * Returns value of the subject
   * 
   * @return value of the subject
   */
  public String getValue() {
    return value;
  }
  
  /**
   * Sets the value of the subject
   * 
   * @param name value of the subject
   */
  public void setValue(String value) {
    this.value = value;
  }
  
}


