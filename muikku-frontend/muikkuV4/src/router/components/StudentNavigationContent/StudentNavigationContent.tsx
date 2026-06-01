import { Group, Text, Loader, Title } from "@mantine/core";
import { currentStudentAtom } from "src/atoms/guider";
import { useAtomValue } from "jotai";
import { NavbarLink } from "src/components/NavbarLink/NavbarLink";

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
      <Title order={4}>
        {currentStudentData.firstName} {currentStudentData.lastName}
      </Title>

      {/* Student-specific sub-links */}
      <NavbarLink
        label="Perustiedot | Tilanne"
        link={`/guider/${currentStudentData.id}/`}
        exactMatch
      />
      <NavbarLink
        label="Aktiivisuus"
        link={`/guider/${currentStudentData.id}/activity`}
        exactMatch
      />
      <NavbarLink
        label="Opiskelusuunnitelma (HOPS)"
        link={`/guider/${currentStudentData.id}/hops`}
        exactMatch
      />
      <NavbarLink
        label="Oppimisen tuki"
        link={`/guider/${currentStudentData.id}/pedagogy-support`}
        exactMatch
      />
      <NavbarLink
        label="Ohjaussuhde"
        link={`/guider/${currentStudentData.id}/guidance-relationship`}
        exactMatch
      />
      <NavbarLink
        label="Opintohistoria"
        link={`/guider/${currentStudentData.id}/study-history`}
        exactMatch
      />
      <NavbarLink
        label="Tiedostot"
        link={`/guider/${currentStudentData.id}/files`}
        exactMatch
      />
    </>
  );
}
