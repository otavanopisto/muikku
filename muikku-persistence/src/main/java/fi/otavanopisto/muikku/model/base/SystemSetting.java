package fi.otavanopisto.muikku.model.base;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Lob;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import javax.validation.constraints.NotEmpty;

@Entity
@Table (
    indexes = {
      @Index(columnList = "settingKey", unique = true)
    }
  )

public class SystemSetting {

  public Long getId() {
    return id;
  }

  public String getKey() {
    return key;
  }

  public void setKey(String key) {
    this.key = key;
  }

  public String getValue() {
    return value;
  }

  public void setValue(String value) {
    this.value = value;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;

  @Column (nullable = false, unique = true, name = "settingKey")
  @NotNull
  @NotEmpty
  private String key;

  @Column (nullable = false, name = "settingValue")
  @NotNull
  @Lob
  private String value;
}
