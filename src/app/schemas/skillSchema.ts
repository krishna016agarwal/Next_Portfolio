import {z} from "zod";

export const skillSchema=z.object({
    name:z.array(z.string().transform(str => str.toUpperCase().trim()))
  
})
