import { eq, sql } from "drizzle-orm";
import { db } from "../../db";
import { devices } from "../../db/schemas";
import { FastifyImp } from "../../types";
import { DEVICES_PUBLIC_OBJECT } from "../../utils/publicObjects";
import { Device } from "@imperial/commons";

export const getMeDevices: FastifyImp<{}, Device[], true> = async (
  request,
  reply,
) => {
  const sqlForThisDevice = sql<boolean>`CASE WHEN ${devices.auth_token} = ${request.authentication_token} THEN TRUE ELSE FALSE END AS this_device`;
  const usersDevices = await db
    .select({
      ...DEVICES_PUBLIC_OBJECT,
      this_device: sqlForThisDevice,
    })
    .from(devices)
    .where(eq(devices.user, request.user.id));

  reply.send({
    success: true,
    data: usersDevices,
  });
};
