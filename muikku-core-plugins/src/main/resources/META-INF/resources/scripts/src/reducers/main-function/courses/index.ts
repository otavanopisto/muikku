import { ActionType } from "~/actions";

export type CoursesBaseFilterType = "ALL_COURSES" | "MY_COURSES" | "AS_TEACHER";

export interface CourseEducationFilterType {
  identifier: string,
  name: string
}

export type CourseEducationFilterListType = Array<CourseEducationFilterType>;

export interface CourseCurriculumFilterType {
  identifier: string,
  name: string
}

export interface CourseOrganizationFilterType {
  identifier: string,
  name: string
}


export interface OrganizationCourseTeacherType {
  firstName: string,
  lastName: string
}

export interface OrganizationType {
  identifier: string,
  name: string
}

export type CourseCurriculumFilterListType = Array<CourseCurriculumFilterType>;
export type CourseOrganizationFilterListType = Array<CourseOrganizationFilterType>;

export type CoursesBaseFilterListType = Array<CoursesBaseFilterType>;

export interface CoursesAvailableFiltersType {
  educationTypes: CourseEducationFilterListType,
  curriculums: CourseCurriculumFilterListType,
  organizations?: CourseOrganizationFilterListType,
  baseFilters?: CoursesBaseFilterListType
}


export type CoursesStateType = "LOADING" | "LOADING_MORE" | "ERROR" | "READY";

export interface CoursesActiveFiltersType {
  educationFilters: Array<string>,
  curriculumFilters: Array<string>,
  publishedFilters?: Array<string>,
  stateFilters?: Array<string>,
  organizationFilters?: Array<string>,
  query: string,
  baseFilter?: CoursesBaseFilterType
}

export interface WorkspaceCourseType {
  id: number,
  urlName: string,
  archived: boolean,
  name: string,
  nameExtension?: string,
  description: string,
  numVisits: number,
  lastVisit: string,
  published: boolean,
  canSignup: boolean,
  isCourseMember: boolean,
  educationTypeName: string,
  hasCustomImage: boolean,
  organization?: Array<OrganizationType>,
  teachers?: Array<OrganizationCourseTeacherType>,
  studentCount? : number,
  feeInfo?: {
    evaluationHasFee: boolean
  }
}

export type WorkspaceCourseListType = Array<WorkspaceCourseType>;

export interface CoursesPatchType {
  availableFilters?: CoursesAvailableFiltersType,
  state?: CoursesStateType,
  activeFilters?: CoursesActiveFiltersType,
  courses?: WorkspaceCourseListType,
  hasMore?: boolean,
  toolbarLock?: boolean
}

export interface CoursesType {
  availableFilters: CoursesAvailableFiltersType,
  state: CoursesStateType,
  activeFilters: CoursesActiveFiltersType,
  courses: WorkspaceCourseListType,
  hasMore: boolean,
  toolbarLock: boolean
}

export default function coursepicker(state:CoursesType = {
  availableFilters: {
    educationTypes: [],
    curriculums: [],
    organizations: [],
    baseFilters: ["ALL_COURSES", "MY_COURSES", "AS_TEACHER"]
  },
  state: "LOADING",
  activeFilters: {
    educationFilters: [],
    curriculumFilters: [],
    organizationFilters: [],
    query: "",
    baseFilter: "ALL_COURSES"
  },
  courses: [],
  hasMore: false,
  toolbarLock: false
}, action: ActionType): CoursesType {
  if (action.type === "UPDATE_COURSES_AVAILABLE_FILTERS_EDUCATION_TYPES"){
    return Object.assign({}, state, {
      availableFilters: Object.assign({}, state.availableFilters, {
        educationTypes: action.payload
      })
    });
  } else if (action.type === "UPDATE_COURSES_AVAILABLE_FILTERS_CURRICULUMS"){
    return Object.assign({}, state, {
      availableFilters: Object.assign({}, state.availableFilters, {
        curriculums: action.payload
      })
    });
  } else if (action.type === "UPDATE_COURSES_AVAILABLE_FILTERS_ORGANIZATIONS"){
    return Object.assign({}, state, {
      availableFilters: Object.assign({}, state.availableFilters, {
        organizations: action.payload
      })
    });
  } else if (action.type === "UPDATE_COURSES_ACTIVE_FILTERS"){
    return Object.assign({}, state, {
      activeFilters: action.payload
    });
  } else if (action.type === "UPDATE_COURSES_ALL_PROPS"){
    return Object.assign({}, state, action.payload);
  } else if (action.type === "UPDATE_COURSES_STATE"){
    return Object.assign({}, state, {
      state: action.payload
    });
  }
  return state;
}

export function organizationCourses(state:CoursesType = {
    availableFilters: {
      educationTypes: [],
      curriculums: []
    },
    state: "LOADING",
    activeFilters: {
      educationFilters: [],
      curriculumFilters: [],
      query: ""
    },
    courses: [],
    hasMore: false,
    toolbarLock: false
  }, action: ActionType): CoursesType {
    if (action.type === "UPDATE_ORGANIZATION_COURSES_AVAILABLE_FILTERS_EDUCATION_TYPES"){
      return Object.assign({}, state, {
        availableFilters: Object.assign({}, state.availableFilters, {
          educationTypes: action.payload
        })
      });
    }
    else if (action.type === "UPDATE_ORGANIZATION_COURSES_AVAILABLE_FILTERS_CURRICULUMS"){
      return Object.assign({}, state, {
        availableFilters: Object.assign({}, state.availableFilters, {
          curriculums: action.payload
        })
      });
    } else if (action.type === "UPDATE_ORGANIZATION_COURSES_ALL_PROPS"){
      return Object.assign({}, state, action.payload);
    } else if (action.type === "UPDATE_ORGANIZATION_COURSES_STATE"){
      return Object.assign({}, state, {
        state: action.payload
      });
    }
    
    
    
    return state;
  }