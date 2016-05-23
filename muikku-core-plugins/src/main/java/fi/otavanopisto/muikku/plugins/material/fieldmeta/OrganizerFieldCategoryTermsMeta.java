package fi.otavanopisto.muikku.plugins.material.fieldmeta;

import java.util.List;

 
public class OrganizerFieldCategoryTermsMeta {
  
  public OrganizerFieldCategoryTermsMeta() {
  }

  public OrganizerFieldCategoryTermsMeta(String category, List<String> terms) {
  }

  public String getCategory() {
    return category;
  }

  public void setCategory(String category) {
    this.category = category;
  }

  public List<String> getTerms() {
    return terms;
  }

  public void setTerms(List<String> terms) {
    this.terms = terms;
  }

  private String category;
  private List<String> terms;

}
