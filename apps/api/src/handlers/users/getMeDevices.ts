import { eq } from "drizzle-orm/expressions";
import { db } from "../../db";
import { devices } from "../../db/schemas";
import { FastifyImp } from "../../types";

export const getMeDevices: FastifyImp = async (request, reply) => {
  if (!request.user) {
    return;
  }

  const usersDevices = await db
    .select()
    .from(devices)
    .where(eq(devices.user, request.user.id));

  reply.send({
    success: true,
    data: usersDevices,
  });
};
