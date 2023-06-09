import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { caregiverValidationSchema } from 'validationSchema/caregivers';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.caregiver
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getCaregiverById();
    case 'PUT':
      return updateCaregiverById();
    case 'DELETE':
      return deleteCaregiverById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCaregiverById() {
    const data = await prisma.caregiver.findFirst(convertQueryToPrismaUtil(req.query, 'caregiver'));
    return res.status(200).json(data);
  }

  async function updateCaregiverById() {
    await caregiverValidationSchema.validate(req.body);
    const data = await prisma.caregiver.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteCaregiverById() {
    const data = await prisma.caregiver.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
