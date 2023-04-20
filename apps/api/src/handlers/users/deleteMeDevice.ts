import bcrypt from "bcrypt";
import { z } from "zod";
import { FastifyImp } from "../../types";
import { AuthSessions } from "../../utils/authSessions";
import { Id } from "@imperial/commons";
import { fromZodError } from "zod-validation-error";

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
        code: "bad_request",
        message: fromZodError(body.error).toString(),
        errors: body.error.errors,
      },
    });
  }

  if (!(await bcrypt.compare(body.data.password, request.user.password))) {
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
