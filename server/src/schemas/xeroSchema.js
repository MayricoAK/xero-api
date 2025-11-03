const { z } = require("zod");

const PaginationQuerySchema = z.object({
  where: z.string().optional(),
  order: z.string().optional(),
  page: z
    .string()
    .regex(/^\d+$/, "Page must be a positive integer")
    .transform(Number)
    .optional(),
  pageSize: z
    .string()
    .regex(/^\d+$/, "Page size must be a positive integer")
    .transform(Number)
    .optional(),
  searchTerm: z.string().optional(),
  contact_name: z.string().optional(),
});

const XeroCallbackSchema = z.object({
  code: z.string({ required_error: "Authorization code is required" })
});

module.exports = {
  PaginationQuerySchema,
  XeroCallbackSchema,
};