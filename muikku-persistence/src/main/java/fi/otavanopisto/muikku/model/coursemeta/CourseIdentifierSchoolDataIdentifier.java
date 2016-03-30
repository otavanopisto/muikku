package fi.otavanopisto.muikku.model.coursemeta;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

import fi.otavanopisto.muikku.model.base.SchoolDataSource;

@Entity
public class CourseIdentifierSchoolDataIdentifier {

	public Long getId() {
		return id;
	}

	public SchoolDataSource getDataSource() {
		return dataSource;
	}

	public void setDataSource(SchoolDataSource dataSource) {
		this.dataSource = dataSource;
	}

	public CourseIdentifierEntity getCourseIdentifierEntity() {
		return courseIdentifierEntity;
	}
	
	public void setCourseIdentifierEntity(CourseIdentifierEntity courseIdentifierEntity) {
		this.courseIdentifierEntity = courseIdentifierEntity;
	}
	
	public String getIdentifier() {
		return identifier;
	}

	public void setIdentifier(String identifier) {
		this.identifier = identifier;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotEmpty
	@NotNull
	@Column(nullable = false)
	private String identifier;

	@ManyToOne
	private SchoolDataSource dataSource;

	@ManyToOne
	private CourseIdentifierEntity courseIdentifierEntity;
}