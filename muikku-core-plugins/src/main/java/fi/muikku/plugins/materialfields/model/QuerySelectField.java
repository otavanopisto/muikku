package fi.muikku.plugins.materialfields.model;

import java.io.Serializable;
import java.util.ArrayList;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class QuerySelectField extends QueryField{
	
	public ArrayList<SelectFieldOption> getOptions() {
		return options;
	}

	public void setOptions(ArrayList<SelectFieldOption> options) {
		this.options = options;
	}
	
	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}
	
	@OneToMany
	@JoinColumn (name = "option_id")
	private ArrayList<SelectFieldOption> options = new ArrayList<SelectFieldOption>();
	
	@NotEmpty
	@NotNull
	@Column (nullable = false)
	private String text;
}
