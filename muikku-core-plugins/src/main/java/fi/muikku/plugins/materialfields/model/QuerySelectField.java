package fi.muikku.plugins.materialfields.model;

import java.io.Serializable;
import java.util.ArrayList;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class QuerySelectField extends QueryField{
	
	public static class Option implements Serializable {
		
	    public Option(String name, Double points, String optText) {
	        this.name = name;
	        this.optText = optText;
	    }
	    
	    public String getOptText() {
			return optText;
		}
		public void setOptText(String optText) {
			this.optText = optText;
		}
		public String getName() {
			return name;
		}
		public void setName(String name) {
			this.name = name;
		}

		private static final long serialVersionUID = -7908385182285507614L;
	    
		private String optText;
		private String name;
	}
	
	public ArrayList<Option> getOptions() {
		return options;
	}

	public void setOptions(ArrayList<Option> options) {
		this.options = options;
	}
	
	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	private ArrayList<Option> options = new ArrayList<Option>();
	
	@NotEmpty
	@NotNull
	@Column (nullable = false)
	private String text;
}
