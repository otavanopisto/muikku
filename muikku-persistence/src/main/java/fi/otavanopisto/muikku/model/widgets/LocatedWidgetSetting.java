package fi.otavanopisto.muikku.model.widgets;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
public class LocatedWidgetSetting {
  
  public Long getId() {
    return id;
  }
  
  public LocatedWidget getLocatedWidget() {
    return locatedWidget;
  }
  
  public void setLocatedWidget(LocatedWidget locatedWidget) {
    this.locatedWidget = locatedWidget;
  }
  
  public String getValue() {
    return value;
  }
  
  public void setValue(String value) {
    this.value = value;
  }
  
  
  public WidgetSetting getWidgetSetting() {
    return widgetSetting;
  }
  
  public void setWidgetSetting(WidgetSetting widgetSetting) {
    this.widgetSetting = widgetSetting;
  }
  
  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  private String value;
  
  @ManyToOne
  private LocatedWidget locatedWidget;

  @ManyToOne
  private WidgetSetting widgetSetting;
}