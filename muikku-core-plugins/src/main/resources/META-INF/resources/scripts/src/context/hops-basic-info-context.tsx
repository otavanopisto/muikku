import React, { createContext, useContext, ReactNode } from "react";

export type UseCase = "STUDENT" | "GUARDIAN" | "GUIDER";

/**
 * Interface representing the basic information of a student
 * @interface StudentBasicInfo
 */
interface StudentBasicInfo {
  /** Unique identifier for the student */
  identifier: string;
  /** Student's study start date */
  studyStartDate: Date;
}

/**
 * Context type definition for student basic information
 * @interface HopsBasicInfoContextType
 */
interface HopsBasicInfoContextType {
  useCase: UseCase;
  /** Current student information */
  studentInfo: StudentBasicInfo | null;
}

/**
 * Context for managing student basic information state
 */
const HopsBasicInfoContext = createContext<
  HopsBasicInfoContextType | undefined
>(undefined);

/**
 * Props for the StudentBasicInfoProvider component
 * @interface StudentBasicInfoProviderProps
 */
interface HopsBasicInfoProviderProps {
  /** Use case */
  useCase: UseCase;
  /** Student information */
  studentInfo: StudentBasicInfo | null;
  /** Child components that will have access to the context */
  children: ReactNode;
}

/**
 * Provider component for student basic information context
 * Manages the state of student information and provides it to child components
 * @param props props
 *
 * @example
 * ```tsx
 * <StudentBasicInfoProvider>
 *   <App />
 * </StudentBasicInfoProvider>
 * ```
 */
export function HopsBasicInfoProvider(props: HopsBasicInfoProviderProps) {
  const { children, studentInfo, useCase } = props;

  return (
    <HopsBasicInfoContext.Provider value={{ studentInfo, useCase }}>
      {children}
    </HopsBasicInfoContext.Provider>
  );
}

/**
 * Custom hook to access the student basic information context
 * @throws If used outside of StudentBasicInfoProvider
 * @returns  The student context value and setter
 *
 * @example
 * ```tsx
 * function StudentProfile() {
 *   const { studentInfo, setStudentInfo } = useHopsBasicInfo();
 *   // Use studentInfo and setStudentInfo as needed
 * }
 * ```
 */
export function useHopsBasicInfo(): HopsBasicInfoContextType {
  const context = useContext(HopsBasicInfoContext);
  if (context === undefined) {
    throw new Error(
      "useHopsBasicInfo must be used within a HopsBasicInfoProvider"
    );
  }
  return context;
}
