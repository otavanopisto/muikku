package fi.muikku.plugins.material.queryfields.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class QueryTextField extends QueryField{
	
    public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public boolean isCaseSensitive() {
		return caseSensitive;
	}
	public void setCaseSensitive(boolean caseSensitive) {
		this.caseSensitive = caseSensitive;
	}
	@NotEmpty
	@NotNull
	@Column (nullable = false)
	private String text;
	
}
