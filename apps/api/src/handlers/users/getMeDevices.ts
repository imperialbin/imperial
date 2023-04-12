import { eq } from "drizzle-orm/expressions";
import { db } from "../../db";
import { devices } from "../../db/schemas";
import { FastifyImp } from "../../types";
import { DEVICES_PUBLIC_OBJECT } from "../../utils/publicObjects";

export const getMeDevices: FastifyImp<{}, unknown, true> = async (
  request,
  reply,
) => {
  const usersDevices = await db
    .select(DEVICES_PUBLIC_OBJECT)
    .from(devices)
    .where(eq(devices.user, request.user.id));

  reply.send({
    success: true,
    data: usersDevices,
  });
};
