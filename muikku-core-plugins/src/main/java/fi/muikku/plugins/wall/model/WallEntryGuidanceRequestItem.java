package fi.muikku.plugins.wall.model;

import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class WallEntryGuidanceRequestItem extends WallEntryItem {

  @Transient
  public WallEntryItemType getType() {
    return WallEntryItemType.GUIDANCE_REQUEST;
  }
  
  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }

  @NotNull
  @NotEmpty
  private String text;
}
