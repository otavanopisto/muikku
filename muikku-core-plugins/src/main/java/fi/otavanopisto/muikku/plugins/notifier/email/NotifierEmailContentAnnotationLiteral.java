package fi.otavanopisto.muikku.plugins.notifier.email;

import javax.enterprise.util.AnnotationLiteral;

public class NotifierEmailContentAnnotationLiteral extends AnnotationLiteral<NotifierEmailContent> implements NotifierEmailContent {

  private static final long serialVersionUID = -3437646402089065590L;

  public NotifierEmailContentAnnotationLiteral(String value) {
    this.value = value;
  }

  @Override
  public String value() {
    return value;
  }

  private final String value;
}
