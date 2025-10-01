import { Group, Text, Loader, Title } from "@mantine/core";
import { NavbarSubLink } from "~/src/components";
import { currentStudentAtom } from "~/src/atoms/guider";
import { useAtomValue } from "jotai";

/**
 * StudentNavigationContentProps - Props for student navigation content
 */
interface StudentNavigationContentProps {
  parentRoute: string;
}

/**
 * StudentNavigationContent - Dynamic content component for student-specific navigation
 * @param props - StudentNavigationContentProps
 * @returns StudentNavigationContent component
 */
export function StudentNavigationContent({
  parentRoute,
}: StudentNavigationContentProps) {
  const currentStudent = useAtomValue(currentStudentAtom);
  //const location = useLocation();

  // Extract student ID from current route
  /* const studentId = useMemo(() => {
    const match = location.pathname.match(/\/guider\/([^\/]+)/);
    return match?.[1];
  }, [location.pathname]); */

  // Mock function to load student data - replace with actual API call
  /* const loadStudentData = async (id: string): Promise<Student> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      id,
      name: `Student ${id}`, // Replace with actual student name
    };
  }; */

  // Load student data when studentId changes
  /* useEffect(() => {
    if (studentId) {
      setLoading(true);
      loadStudentData(studentId)
        .then((student) => {
          setSelectedStudent(student);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setSelectedStudent(null);
    }
  }, [studentId]); */

  // Don't render anything if no student selected
  //if (!studentId) return null;

  if (currentStudent.currentStudentState === "loading") {
    return (
      <Group
        gap="sm"
        align="center"
        p="xs"
        style={{ marginLeft: "var(--mantine-spacing-md)" }}
      >
        <Loader size={14} />
        <Text size="sm">Ladataan...</Text>
      </Group>
    );
  }

  //if (!currentStudent.currentStudent) return null;

  const currentStudentData = {
    name: "Testi Studentti",
    id: "PYRAMUS-XX",
  };

  return (
    <>
      {/* Student name as a sub-link */}
      {/* <NavbarSubLink
        label={selectedStudent.name}
        link={`/guider/${selectedStudent.id}`}
        parentRoute={parentRoute}
      /> */}

      <Title order={4}>{currentStudentData.name}</Title>

      {/* Student-specific sub-links */}
      <NavbarSubLink
        label="Perustiedot | Tilanne"
        link={`/guider/${currentStudentData.id}/`}
        parentRoute={parentRoute}
      />
      <NavbarSubLink
        label="Aktiivisuus"
        link={`/guider/${currentStudentData.id}/activity`}
        parentRoute={parentRoute}
      />
      <NavbarSubLink
        label="Opiskelusuunnitelma (HOPS)"
        link={`/guider/${currentStudentData.id}/hops`}
        parentRoute={parentRoute}
      />
      <NavbarSubLink
        label="Oppimisen tuki"
        link={`/guider/${currentStudentData.id}/pedagogy-support`}
        parentRoute={parentRoute}
      />
      <NavbarSubLink
        label="Ohjaussuhde"
        link={`/guider/${currentStudentData.id}/guidance-relationship`}
        parentRoute={parentRoute}
      />
      <NavbarSubLink
        label="Opintohistoria"
        link={`/guider/${currentStudentData.id}/study-history`}
        parentRoute={parentRoute}
      />
      <NavbarSubLink
        label="Tiedostot"
        link={`/guider/${currentStudentData.id}/files`}
        parentRoute={parentRoute}
      />
    </>
  );
}
