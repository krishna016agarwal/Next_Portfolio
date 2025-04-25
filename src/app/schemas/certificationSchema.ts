import { z } from "zod";

export const certificationSchema = z.object({
    name: z.string().toUpperCase().trim(),
    image: z.string(),

})
