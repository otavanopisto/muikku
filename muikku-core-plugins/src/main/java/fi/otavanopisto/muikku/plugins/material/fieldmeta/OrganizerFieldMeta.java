package fi.otavanopisto.muikku.plugins.material.fieldmeta;

 import java.util.List;

import org.codehaus.jackson.annotate.JsonIgnore;

public class OrganizerFieldMeta extends FieldMeta {
  
  public OrganizerFieldMeta() {
  }

  public OrganizerFieldMeta(String name, String termTitle, List<OrganizerFieldTermMeta> terms, List<OrganizerFieldCategoryMeta> categories, List<OrganizerFieldCategoryTermsMeta> categoryTerms) {
    super(name);
    setTermTitle(termTitle);
    setTerms(terms);
    setCategories(categories);
    setCategoryTerms(categoryTerms);
  }
  
  @Override
  @JsonIgnore
  public String getType() {
    return "application/vnd.muikku.field.organizer";
  }

  public String getTermTitle() {
    return termTitle;
  }

  public void setTermTitle(String termTitle) {
    this.termTitle = termTitle;
  }

  public List<OrganizerFieldTermMeta> getTerms() {
    return terms;
  }

  public void setTerms(List<OrganizerFieldTermMeta> terms) {
    this.terms = terms;
  }

  public List<OrganizerFieldCategoryMeta> getCategories() {
    return categories;
  }

  public void setCategories(List<OrganizerFieldCategoryMeta> categories) {
    this.categories = categories;
  }

  public List<OrganizerFieldCategoryTermsMeta> getCategoryTerms() {
    return categoryTerms;
  }

  public void setCategoryTerms(List<OrganizerFieldCategoryTermsMeta> categoryTerms) {
    this.categoryTerms = categoryTerms;
  }
  
  @JsonIgnore
  public boolean hasCategoryWithId(String categoryId) {
    for (OrganizerFieldCategoryMeta category : categories) {
      if (categoryId.equals(category.getId())) {
        return true;
      }
    }
    return false;
  }

  @JsonIgnore
  public boolean hasTermWithId(String termId) {
    for (OrganizerFieldTermMeta term : terms) {
      if (termId.equals(term.getId())) {
        return true;
      }
    }
    return false;
  }

  private String termTitle;
  private List<OrganizerFieldTermMeta> terms;
  private List<OrganizerFieldCategoryMeta> categories;
  private List<OrganizerFieldCategoryTermsMeta> categoryTerms;

}
