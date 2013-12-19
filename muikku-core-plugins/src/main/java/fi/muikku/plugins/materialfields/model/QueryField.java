package fi.muikku.plugins.materialfields.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
@Inheritance(strategy=InheritanceType.JOINED)
public class QueryField {
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getHelp() {
		return help;
	}
	public void setHelp(String help) {
		this.help = help;
	}
	public String getHint() {
		return hint;
	}
	public void setHint(String hint) {
		this.hint = hint;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public boolean isMandatory() {
		return mandatory;
	}
	public void setMandatory(boolean mandatory) {
		this.mandatory = mandatory;
	}
	
	@Id
	@GeneratedValue (strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String name;
	
	@NotEmpty
	@NotNull
	@Column (nullable = false)
	private String help;
	  
	@NotEmpty
	@NotNull
	@Column (nullable = false)
	private String hint;
	  
	@NotEmpty
	@NotNull
	@Column (nullable = false)
	private String type;
	  
	@NotEmpty
	@NotNull
	@Column (nullable = false)
	private boolean mandatory;

}
