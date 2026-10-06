/**
 * JSON Schema for the successful login response from
 *   POST /auth/VT/login
 *
 * Top-level shape:
 *   { loginDetails: { status: 200, message: { data: { response: { data: { ... } } } } } }
 */
export const loginSuccessSchema = {
  type: "object",
  required: ["loginDetails"],
  properties: {
    loginDetails: {
      type: "object",
      required: ["status", "message"],
      properties: {
        status: { type: "integer", const: 200 },
        message: {
          type: "object",
          required: ["data"],
          properties: {
            data: {
              type: "object",
              required: ["response"],
              properties: {
                response: {
                  type: "object",
                  required: ["data"],
                  properties: {
                    data: {
                      type: "object",
                      required: [
                        "customerid",
                        "cartDetails",
                        "email",
                        "firstname",
                        "lastname",
                        "mobile",
                        "totalLineItemQuantity",
                        "userType",
                        "impersonate",
                        "orgId",
                        "costCenterId",
                      ],
                      properties: {
                        customerid: {
                          type: "string",
                          format: "uuid",
                        },
                        cartDetails: {
                          type: "object",
                          required: ["id", "cartItems", "locale", "type", "version"],
                          properties: {
                            id: { type: "string", minLength: 1 },
                            cartItems: { type: "array" },
                            locale: { type: "string" },
                            type: { type: "string", const: "CART" },
                            version: { type: "string" },
                          },
                        },
                        email: { type: "string", format: "email" },
                        firstname: { type: "string" },
                        lastname: { type: "string" },
                        mobile: { type: "string" },
                        totalLineItemQuantity: { type: "integer", minimum: 0 },
                        userType: { type: "string" },
                        impersonate: { type: "boolean" },
                        orgId: { type: ["string", "null"] },
                        costCenterId: { type: ["string", "null"] },
                      },
                      // extra properties are allowed (no additionalProperties: false)
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
