import { z } from 'zod';

export const IpAddressSchema = z
  .string()
  .regex(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, { message: 'IP address should be xxx.xxx.xxx.xxx' });

export type IpAddressSchemaType = z.infer<typeof IpAddressSchema>;

/* 
FormSchema looks like this:
{
    "devices": [
        {
            "ip": "as",
            "username": "asdf",
            "password": "asf"
        }
    ],
    "commands": ""
}
*/

export const FormSchema = z.object({
  devices: z.array(
    z.object({
      hostname: IpAddressSchema,
      username: z.string().min(1, { message: 'Username should not be empty' }),
      password: z.string().min(1, { message: 'Password should not be empty' }),
    })
  ),
  // if commands is empty, it will show an error message
  // if commands contain {{}}, it will show an error message: Please replace all {{INPUT}} with a valid command
  commands: z
    .string()
    .min(1, { message: 'Commands should not be empty' })
    .refine((value) => !value.includes('{{'), { message: 'Please replace all {{INPUT}} with a valid command' }),
});

export type FormSchemaType = z.infer<typeof FormSchema>;
