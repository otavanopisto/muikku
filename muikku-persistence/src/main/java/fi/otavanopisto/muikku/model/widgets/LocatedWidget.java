package fi.otavanopisto.muikku.model.widgets;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.ManyToOne;

@Entity
@Inheritance (strategy = InheritanceType.JOINED)
public class LocatedWidget {
  
  public Long getId() {
    return id;
  }
  
  public Widget getWidget() {
    return widget;
  }
  
  public void setWidget(Widget widget) {
    this.widget = widget;
  }
  
  public WidgetSpace getWidgetSpace() {
		return widgetSpace;
	}
  
  public void setWidgetSpace(WidgetSpace widgetSpace) {
		this.widgetSpace = widgetSpace;
	}

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private Widget widget;

  @ManyToOne
  private WidgetSpace widgetSpace;

}
