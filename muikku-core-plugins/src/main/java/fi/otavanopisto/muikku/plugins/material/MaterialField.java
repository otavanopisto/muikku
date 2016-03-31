package fi.otavanopisto.muikku.plugins.material;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.builder.HashCodeBuilder;

public class MaterialField {
  
  public MaterialField(String name, String type, String content) {
    setName(name);
    setType(type);
    setContent(content);
  }

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }
  
  public String getType() {
    return type;
  }
  
  public void setType(String type) {
    this.type = type;
  }
  
  public String getName() {
    return name;
  }
  
  public void setName(String name) {
    this.name = name;
  }
  
  public boolean equals(Object obj) {
    if (obj != null && obj instanceof MaterialField) {
      MaterialField field = (MaterialField) obj;
      return StringUtils.equals(name, field.getName()) && StringUtils.equals(type, field.getType()) && StringUtils.equals(content, field.getContent()); 
    }
    return super.equals(obj);
  }
  
  @Override
  public int hashCode() {
    return new HashCodeBuilder()
      .append(name)
      .append(type)
      .append(content)
      .toHashCode();
  }

  private String name;
  private String type;
  private String content;
  
}
