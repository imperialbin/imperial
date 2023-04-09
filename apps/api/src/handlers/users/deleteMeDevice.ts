import bcrypt from "bcrypt";
import { z } from "zod";
import { FastifyImp } from "../../types";
import { AuthSessions } from "../../utils/authSessions";
import { Id } from "@imperial/commons";

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
  if (!request.user) {
    return;
  }

  const body = deleteDeviceBody.safeParse(request.body);
  if (!body.success) {
    return reply.status(400).send({
      success: false,
      error: {
        message: body.error.message,
      },
    });
  }

  if (!(await bcrypt.compare(body.data.password, request.user.password))) {
    return reply.status(401).send({
      success: false,
      error: {
        message: "Incorrect password",
      },
    });
  }

  await AuthSessions.deleteDeviceById(body.data.device_id);

  reply.status(204).send();
};
