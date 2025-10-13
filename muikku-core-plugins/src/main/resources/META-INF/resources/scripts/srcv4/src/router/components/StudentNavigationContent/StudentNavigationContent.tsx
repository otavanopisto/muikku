import { Group, Text, Loader, Title } from "@mantine/core";
import { NavbarSubLink } from "~/src/components";
import { currentStudentAtom } from "~/src/atoms/guider";
import { useAtomValue } from "jotai";

/**
 * StudentNavigationContentProps - Props for student navigation content
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface StudentNavigationContentProps {}

/**
 * StudentNavigationContent - Dynamic content component for student-specific navigation
 * @param _props - StudentNavigationContentProps
 * @returns StudentNavigationContent component
 */
export function StudentNavigationContent(
  _props: StudentNavigationContentProps
) {
  const currentStudent = useAtomValue(currentStudentAtom);

  if (currentStudent.isLoading) {
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

  if (!currentStudent.data) return null;

  const { data: currentStudentData } = currentStudent;

  return (
    <>
      {/* Student name as a sub-link */}
      {/* <NavbarSubLink
        label={selectedStudent.name}
        link={`/guider/${selectedStudent.id}`}
        parentRoute={parentRoute}
      /> */}

      <Title order={4}>
        {currentStudentData.firstName} {currentStudentData.lastName}
      </Title>

      {/* Student-specific sub-links */}
      <NavbarSubLink
        label="Perustiedot | Tilanne"
        link={`/guider/${currentStudentData.id}/`}
        //parentRoute={parentRoute}
      />
      <NavbarSubLink
        label="Aktiivisuus"
        link={`/guider/${currentStudentData.id}/activity`}
        //parentRoute={parentRoute}
      />
      <NavbarSubLink
        label="Opiskelusuunnitelma (HOPS)"
        link={`/guider/${currentStudentData.id}/hops`}
        //parentRoute={parentRoute}
      />
      <NavbarSubLink
        label="Oppimisen tuki"
        link={`/guider/${currentStudentData.id}/pedagogy-support`}
        //parentRoute={parentRoute}
      />
      <NavbarSubLink
        label="Ohjaussuhde"
        link={`/guider/${currentStudentData.id}/guidance-relationship`}
        //parentRoute={parentRoute}
      />
      <NavbarSubLink
        label="Opintohistoria"
        link={`/guider/${currentStudentData.id}/study-history`}
        //parentRoute={parentRoute}
      />
      <NavbarSubLink
        label="Tiedostot"
        link={`/guider/${currentStudentData.id}/files`}
        //parentRoute={parentRoute}
      />
    </>
  );
}
