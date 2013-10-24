package fi.muikku.plugins.courselist;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
public class CourseListSelection {

  public Long getId() {
    return id;
  }

  public Long getUser() {
    return user;
  }

  public void setUser(Long user) {
    this.user = user;
  }

  public String getContext() {
    return context;
  }

  public void setContext(String context) {
    this.context = context;
  }

  public CourseListSelectionEnum getSelection() {
    return selection;
  }

  public void setSelection(CourseListSelectionEnum selection) {
    this.selection = selection;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @Column (name = "user_id")
  private Long user;
  
  @Column (nullable = false)
  @NotEmpty
  @NotNull
  private String context;
  
  private CourseListSelectionEnum selection;
}
