import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

/**
 * Validate data against a JSON schema using Ajv.
 * @param {object} schema - A JSON Schema object.
 * @param {unknown} data  - The data to validate.
 * @returns {{ valid: boolean, errors: string }} 
 *   `valid` is true when validation passes; `errors` is a human-readable
 *   multi-line string (empty string when valid).
 */
export function validateSchema(schema, data) {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  const errors = valid
    ? ""
    : (validate.errors || [])
        .map(
          (e) =>
            `  • ${e.instancePath || "(root)"} ${e.message}` +
            (e.params ? ` (${JSON.stringify(e.params)})` : "")
        )
        .join("\n");
  return { valid, errors };
}
