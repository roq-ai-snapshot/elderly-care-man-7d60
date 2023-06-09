import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import {
  Text,
  Box,
  Spinner,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Link,
  IconButton,
  Flex,
  Center,
  Stack,
} from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { FiTrash, FiEdit2 } from 'react-icons/fi';
import { getResidentById } from 'apiSdk/residents';
import { Error } from 'components/error';
import { ResidentInterface } from 'interfaces/resident';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deleteAllergyById } from 'apiSdk/allergies';
import { deleteAppointmentById } from 'apiSdk/appointments';
import { deleteCarePlanById } from 'apiSdk/care-plans';
import { deleteCaregiverById } from 'apiSdk/caregivers';
import { deleteMedicationById } from 'apiSdk/medications';

function ResidentViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ResidentInterface>(
    () => (id ? `/residents/${id}` : null),
    () =>
      getResidentById(id, {
        relations: ['care_home', 'allergy', 'appointment', 'care_plan', 'caregiver', 'medication'],
      }),
  );

  const allergyHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteAllergyById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const appointmentHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteAppointmentById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const care_planHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteCarePlanById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const caregiverHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteCaregiverById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const medicationHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteMedicationById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Flex justifyContent="space-between" mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Resident Detail View
          </Text>
          {hasAccess('resident', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
            <NextLink href={`/residents/edit/${data?.id}`} passHref legacyBehavior>
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
        </Flex>
        {error && (
          <Box mb={4}>
            {' '}
            <Error error={error} />{' '}
          </Box>
        )}
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <>
            <Stack direction="column" spacing={2} mb={4}>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  First Name:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.first_name}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Last Name:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.last_name}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Date Of Birth:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.date_of_birth as unknown as string}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Created At:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.created_at as unknown as string}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Updated At:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.updated_at as unknown as string}
                </Text>
              </Flex>
            </Stack>
            <Box>
              {hasAccess('care_home', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Flex alignItems="center" mb={4}>
                  <Text fontSize="lg" fontWeight="bold" as="span">
                    Care Home:
                  </Text>
                  <Text fontSize="md" as="span" ml={3}>
                    <Link as={NextLink} href={`/care-homes/view/${data?.care_home?.id}`}>
                      {data?.care_home?.name}
                    </Link>
                  </Text>
                </Flex>
              )}
              {hasAccess('allergy', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Stack spacing={2} mb={8}>
                  <Flex justifyContent="space-between">
                    <Text fontSize="lg" fontWeight="bold">
                      Allergies
                    </Text>
                    <NextLink passHref href={`/allergies/create?resident_id=${data?.id}`}>
                      <Button colorScheme="blue" mr="4" as="a">
                        Create
                      </Button>
                    </NextLink>
                  </Flex>
                  <TableContainer mb={4}>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>name</Th>
                          <Th>severity</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {data?.allergy?.map((record) => (
                          <Tr
                            cursor="pointer"
                            onClick={() => router.push(`/allergies/view/${record.id}`)}
                            key={record.id}
                          >
                            <Td>{record.name}</Td>
                            <Td>{record.severity}</Td>
                            <Td>
                              {hasAccess('allergy', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                                <NextLink passHref href={`/allergies/edit/${record.id}`}>
                                  <Button mr={2} as="a" variant="outline" colorScheme="blue" leftIcon={<FiEdit2 />}>
                                    Edit
                                  </Button>
                                </NextLink>
                              )}
                              {hasAccess('allergy', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                                <IconButton
                                  onClick={() => allergyHandleDelete(record.id)}
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
                </Stack>
              )}

              {hasAccess('appointment', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Stack spacing={2} mb={8}>
                  <Flex justifyContent="space-between">
                    <Text fontSize="lg" fontWeight="bold">
                      Appointments
                    </Text>
                    <NextLink passHref href={`/appointments/create?resident_id=${data?.id}`}>
                      <Button colorScheme="blue" mr="4" as="a">
                        Create
                      </Button>
                    </NextLink>
                  </Flex>
                  <TableContainer mb={4}>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>date</Th>
                          <Th>time</Th>
                          <Th>doctor_name</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {data?.appointment?.map((record) => (
                          <Tr
                            cursor="pointer"
                            onClick={() => router.push(`/appointments/view/${record.id}`)}
                            key={record.id}
                          >
                            <Td>{record.date as unknown as string}</Td>
                            <Td>{record.time as unknown as string}</Td>
                            <Td>{record.doctor_name}</Td>
                            <Td>
                              {hasAccess('appointment', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                                <NextLink passHref href={`/appointments/edit/${record.id}`}>
                                  <Button mr={2} as="a" variant="outline" colorScheme="blue" leftIcon={<FiEdit2 />}>
                                    Edit
                                  </Button>
                                </NextLink>
                              )}
                              {hasAccess('appointment', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                                <IconButton
                                  onClick={() => appointmentHandleDelete(record.id)}
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
                </Stack>
              )}

              {hasAccess('care_plan', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Stack spacing={2} mb={8}>
                  <Flex justifyContent="space-between">
                    <Text fontSize="lg" fontWeight="bold">
                      Care Plans
                    </Text>
                    <NextLink passHref href={`/care-plans/create?resident_id=${data?.id}`}>
                      <Button colorScheme="blue" mr="4" as="a">
                        Create
                      </Button>
                    </NextLink>
                  </Flex>
                  <TableContainer mb={4}>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>title</Th>
                          <Th>description</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {data?.care_plan?.map((record) => (
                          <Tr
                            cursor="pointer"
                            onClick={() => router.push(`/care-plans/view/${record.id}`)}
                            key={record.id}
                          >
                            <Td>{record.title}</Td>
                            <Td>{record.description}</Td>
                            <Td>
                              {hasAccess('care_plan', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                                <NextLink passHref href={`/care-plans/edit/${record.id}`}>
                                  <Button mr={2} as="a" variant="outline" colorScheme="blue" leftIcon={<FiEdit2 />}>
                                    Edit
                                  </Button>
                                </NextLink>
                              )}
                              {hasAccess('care_plan', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                                <IconButton
                                  onClick={() => care_planHandleDelete(record.id)}
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
                </Stack>
              )}

              {hasAccess('caregiver', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Stack spacing={2} mb={8}>
                  <Flex justifyContent="space-between">
                    <Text fontSize="lg" fontWeight="bold">
                      Caregivers
                    </Text>
                    <NextLink passHref href={`/caregivers/create?resident_id=${data?.id}`}>
                      <Button colorScheme="blue" mr="4" as="a">
                        Create
                      </Button>
                    </NextLink>
                  </Flex>
                  <TableContainer mb={4}>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {data?.caregiver?.map((record) => (
                          <Tr
                            cursor="pointer"
                            onClick={() => router.push(`/caregivers/view/${record.id}`)}
                            key={record.id}
                          >
                            <Td>
                              {hasAccess('caregiver', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                                <NextLink passHref href={`/caregivers/edit/${record.id}`}>
                                  <Button mr={2} as="a" variant="outline" colorScheme="blue" leftIcon={<FiEdit2 />}>
                                    Edit
                                  </Button>
                                </NextLink>
                              )}
                              {hasAccess('caregiver', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                                <IconButton
                                  onClick={() => caregiverHandleDelete(record.id)}
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
                </Stack>
              )}

              {hasAccess('medication', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Stack spacing={2} mb={8}>
                  <Flex justifyContent="space-between">
                    <Text fontSize="lg" fontWeight="bold">
                      Medications
                    </Text>
                    <NextLink passHref href={`/medications/create?resident_id=${data?.id}`}>
                      <Button colorScheme="blue" mr="4" as="a">
                        Create
                      </Button>
                    </NextLink>
                  </Flex>
                  <TableContainer mb={4}>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>name</Th>
                          <Th>dosage</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {data?.medication?.map((record) => (
                          <Tr
                            cursor="pointer"
                            onClick={() => router.push(`/medications/view/${record.id}`)}
                            key={record.id}
                          >
                            <Td>{record.name}</Td>
                            <Td>{record.dosage}</Td>
                            <Td>
                              {hasAccess('medication', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                                <NextLink passHref href={`/medications/edit/${record.id}`}>
                                  <Button mr={2} as="a" variant="outline" colorScheme="blue" leftIcon={<FiEdit2 />}>
                                    Edit
                                  </Button>
                                </NextLink>
                              )}
                              {hasAccess('medication', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                                <IconButton
                                  onClick={() => medicationHandleDelete(record.id)}
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
                </Stack>
              )}
            </Box>
            <Box></Box>
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'resident',
  operation: AccessOperationEnum.READ,
})(ResidentViewPage);
