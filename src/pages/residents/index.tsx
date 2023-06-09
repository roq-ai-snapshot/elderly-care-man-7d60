import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Text,
  Button,
  Link,
  IconButton,
  Flex,
  Center,
} from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getResidents, deleteResidentById } from 'apiSdk/residents';
import { ResidentInterface } from 'interfaces/resident';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { useRouter } from 'next/router';
import { FiTrash, FiEdit2 } from 'react-icons/fi';

function ResidentListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<ResidentInterface[]>(
    () => '/residents',
    () =>
      getResidents({
        relations: [
          'care_home',
          'allergy.count',
          'appointment.count',
          'care_plan.count',
          'caregiver.count',
          'medication.count',
        ],
      }),
  );
  const router = useRouter();
  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteResidentById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const handleView = (id: string) => {
    if (hasAccess('resident', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)) {
      router.push(`/residents/view/${id}`);
    }
  };

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('resident', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Flex justifyContent="space-between" mb={4}>
            <Text as="h1" fontSize="2xl" fontWeight="bold">
              Resident
            </Text>
            <NextLink href={`/residents/create`} passHref legacyBehavior>
              <Button onClick={(e) => e.stopPropagation()} colorScheme="blue" mr="4" as="a">
                Create
              </Button>
            </NextLink>
          </Flex>
        )}
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {deleteError && (
          <Box mb={4}>
            <Error error={deleteError} />{' '}
          </Box>
        )}
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>first_name</Th>
                  <Th>last_name</Th>
                  <Th>date_of_birth</Th>
                  {hasAccess('care_home', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>care_home</Th>}
                  {hasAccess('allergy', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>allergy</Th>}
                  {hasAccess('appointment', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>appointment</Th>
                  )}
                  {hasAccess('care_plan', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>care_plan</Th>}
                  {hasAccess('caregiver', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>caregiver</Th>}
                  {hasAccess('medication', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>medication</Th>}
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr cursor="pointer" onClick={() => handleView(record.id)} key={record.id}>
                    <Td>{record.first_name}</Td>
                    <Td>{record.last_name}</Td>
                    <Td>{record.date_of_birth as unknown as string}</Td>
                    {hasAccess('care_home', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/care-homes/view/${record.care_home?.id}`}>
                          {record.care_home?.name}
                        </Link>
                      </Td>
                    )}
                    {hasAccess('allergy', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.allergy}</Td>
                    )}
                    {hasAccess('appointment', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.appointment}</Td>
                    )}
                    {hasAccess('care_plan', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.care_plan}</Td>
                    )}
                    {hasAccess('caregiver', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.caregiver}</Td>
                    )}
                    {hasAccess('medication', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.medication}</Td>
                    )}
                    <Td>
                      {hasAccess('resident', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                        <NextLink href={`/residents/edit/${record.id}`} passHref legacyBehavior>
                          <Button
                            onClick={(e) => e.stopPropagation()}
                            mr={2}
                            as="a"
                            variant="outline"
                            colorScheme="blue"
                            leftIcon={<FiEdit2 />}
                          >
                            Edit
                          </Button>
                        </NextLink>
                      )}
                      {hasAccess('resident', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(record.id);
                          }}
                          colorScheme="red"
                          variant="outline"
                          aria-label="edit"
                          icon={<FiTrash />}
                        />
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </AppLayout>
  );
}
export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'resident',
  operation: AccessOperationEnum.READ,
})(ResidentListPage);
