import logger from "../utils/logger.js";

/**
 * @param {Joi.ObjectSchema} schema - Joi schema to validate against
 * @param {string} source - "body" or "query" (default "body")
 */
const validate = (schema, source = "body") => (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
        abortEarly: false,
        stripUnknown: true,
    });

    if (error) {
        const errorMessage = error.details.map((detail) => detail.message).join(", ");
        logger.warn(`Validation failure on ${req.originalUrl}: ${errorMessage}`);

        return res.status(400).json({
            status: "error",
            message: errorMessage
        });
    }

    
    //  bypasses the "only has a getter" error.
    if (source === 'query' || source === 'params') {
        // clear existing properties to respect 'stripUnknown: true'
        Object.keys(req[source]).forEach(key => delete req[source][key]);
        Object.assign(req[source], value);
    } else {
        // for 'body', direct reassignment usually works, 
        // but Object.assign is safer across all versions.
        req[source] = value;
    }

    next();
};

export default validate;