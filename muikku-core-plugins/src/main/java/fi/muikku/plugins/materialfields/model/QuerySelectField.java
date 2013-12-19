package fi.muikku.plugins.materialfields.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class QuerySelectField extends QueryField{
	
	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}
	
  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
	
	@NotEmpty
	@NotNull
	@Column (nullable = false)
	private String text;
}
