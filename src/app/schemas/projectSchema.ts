import {z} from "zod";

export const projectSchema=z.object({
    name:z.string().toUpperCase().trim(),
    github:z.string().url(),
    projectLink:z.string().url(),
    image:z.string(),
    technologiesUsed:z.array(z.string().transform(str => str.toUpperCase()))
})

//zod check whether name is string or not 