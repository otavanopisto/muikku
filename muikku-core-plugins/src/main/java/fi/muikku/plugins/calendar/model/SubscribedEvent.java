package fi.muikku.plugins.calendar.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class SubscribedEvent extends Event {

	public String getUid() {
		return uid;
	}
	
	public void setUid(String uid) {
		this.uid = uid;
	}
	
	@NotNull
	@NotEmpty
	@Column (nullable = false, unique = true)
	private String uid;
}
