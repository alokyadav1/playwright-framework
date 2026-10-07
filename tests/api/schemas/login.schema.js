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

/**
 * JSON Schema for the error login response from
 *   POST /auth/VT/login
 *
 * Shape:
 *   {
 *     "errors": [
 *       {
 *         "errors": ["Invalid UserName or Password"],
 *         "message": "Service Error",
 *         "statusCode": 401
 *       }
 *     ],
 *     "path": "/auth/VT/login",
 *     "timestamp": "2026-10-07T11:42:38.786Z"
 *   }
 */
export const loginErrorSchema = {
  type: "object",
  required: ["errors", "path", "timestamp"],
  properties: {
    errors: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["errors", "message", "statusCode"],
        properties: {
          errors: {
            type: "array",
            items: { type: "string" },
          },
          message: { type: "string" },
          statusCode: { type: "integer" },
        },
      },
    },
    path: { type: "string" },
    timestamp: { type: "string" },
  },
};
