import { Id } from "@imperial/commons";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { FastifyImp } from "../../types";
import { AuthSessions } from "../../utils/authSessions";
import { bCrypt } from "../../utils/bcrypt";
import { db } from "../../db";
import { devices, devices } from "@imperial/internal";
import { eq } from "drizzle-orm";

const deviceSchema = z.custom<Id<"device">>(
  (value) => typeof value === "string" && value.startsWith("device_"),
);

const deleteDeviceBody = z.object({
  device_id: deviceSchema,
  password: z.string().min(8),
});

export const deleteMeDevices: FastifyImp<
  { Body: z.infer<typeof deleteDeviceBody> },
  unknown,
  true
> = async (request, reply) => {
  const body = deleteDeviceBody.safeParse(request.body);
  if (!body.success) {
    return reply.status(400).send({
      success: false,
      error: {
        code: "bad_request",
        message: fromZodError(body.error).toString(),
        errors: body.error.errors,
      },
    });
  }

  const userDevices = await db
    .select()
    .from(devices)
    .where(eq(devices.user, request.user.id));

  const requestedDevice = userDevices.find(
    (device) => device.id === body.data.device_id,
  );

  if (!requestedDevice) {
    return reply.status(404).send({
      success: false,
      error: {
        code: "not_found",
        message: "Device not found",
      },
    });
  }

  if (!(await bCrypt.compare(body.data.password, request.user.password))) {
    return reply.status(401).send({
      success: false,
      error: {
        code: "bad_request",
        message: "Incorrect password",
      },
    });
  }

  const success = await AuthSessions.deleteDeviceById(body.data.device_id);
  if (!success) {
    return reply.status(404).send({
      success: false,
      error: {
        code: "not_found",
        message: "Device not found",
      },
    });
  }

  reply.status(204).send();
};
