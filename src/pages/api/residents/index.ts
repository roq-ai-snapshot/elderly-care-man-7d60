import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { residentValidationSchema } from 'validationSchema/residents';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getResidents();
    case 'POST':
      return createResident();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getResidents() {
    const data = await prisma.resident
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'resident'));
    return res.status(200).json(data);
  }

  async function createResident() {
    await residentValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.allergy?.length > 0) {
      const create_allergy = body.allergy;
      body.allergy = {
        create: create_allergy,
      };
    } else {
      delete body.allergy;
    }
    if (body?.appointment?.length > 0) {
      const create_appointment = body.appointment;
      body.appointment = {
        create: create_appointment,
      };
    } else {
      delete body.appointment;
    }
    if (body?.care_plan?.length > 0) {
      const create_care_plan = body.care_plan;
      body.care_plan = {
        create: create_care_plan,
      };
    } else {
      delete body.care_plan;
    }
    if (body?.caregiver?.length > 0) {
      const create_caregiver = body.caregiver;
      body.caregiver = {
        create: create_caregiver,
      };
    } else {
      delete body.caregiver;
    }
    if (body?.medication?.length > 0) {
      const create_medication = body.medication;
      body.medication = {
        create: create_medication,
      };
    } else {
      delete body.medication;
    }
    const data = await prisma.resident.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
