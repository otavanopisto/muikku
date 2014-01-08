package fi.muikku.plugins.materialfields.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class QueryTextField extends QueryField{
	
  public String getPlaceholderText() {
		return placeholderText;
	}
	public void setPlaceholderText(String text) {
		this.placeholderText = text;
	}

	@Column
	private String placeholderText;
	
}
