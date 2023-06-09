import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { careHomeValidationSchema } from 'validationSchema/care-homes';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getCareHomes();
    case 'POST':
      return createCareHome();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCareHomes() {
    const data = await prisma.care_home
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'care_home'));
    return res.status(200).json(data);
  }

  async function createCareHome() {
    await careHomeValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.resident?.length > 0) {
      const create_resident = body.resident;
      body.resident = {
        create: create_resident,
      };
    } else {
      delete body.resident;
    }
    const data = await prisma.care_home.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
