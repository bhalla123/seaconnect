const joi = require('joi');

module.exports = {

	validateBody: (schema) => {
		return (req, res, next) => {
			const result = joi.validate(req.body, schema, (err, value) => {
				if (err) {
					return res.status(422).json({
						success: false,
						message: err.details[0].message.replace(/[^a-zA-Z ]/g, ""),
					});
				} else {
					req.data = value;
					next();
				}
			});
		}
	},
	validateQuery: (schema) => {
		return (req, res, next) => {
			const result = joi.validate(req.query, schema, (err, value) => {
				if (err) {
					return res.status(422).json({
						success: false,
						message: err.details[0].message.replace(/[^a-zA-Z ]/g, ""),
					});
				} else {
					req.data = value;
					next();
				}
			});
		}
	},
	validateFile: (schema) => {
		return (req, res, next) => {
			const result = joi.validate(req.file, schema, (err, value) => {
				if (err) {
					return res.status(422).json({
						success: false,
						message: err.details[0].message.replace(/[^a-zA-Z ]/g, ""),
					});
				} else {
					req.data = value;
					next();
				}
			});
		}
	},

	schemas: {
	
		createUserSchema: joi.object().keys({
			user_name: joi.string().empty(''),
			first_name: joi.string().required(),
			email: joi.string().email().required(),
			password: joi.string().required(),
			gender:joi.string().required(),
			interested_in:joi.string().required(),
			age_range:joi.string().required(),
			mobile_number:joi.string().empty(''),
			looking_for:joi.string().empty(''),
			dob:joi.string().empty(''),
			bio:joi.string().empty(''),
			confirm_password: joi.string().valid(joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' } } }),
		}),

		updateProfileSchema: joi.object().keys({
			user_name: joi.string().empty(''),
			first_name: joi.string().required(),
			email: joi.string().email().required(),
			password: joi.string().required(),
			gender:joi.string().required(),
			interested_in:joi.string().required(),
			age_range:joi.string().required(),
			mobile_number:joi.string().empty(''),
			looking_for:joi.string().empty(''),
			dob:joi.string().empty(''),
			bio:joi.string().empty(''),
			id:joi.string().required(),
		}),

		/*filterInteractionSchema :joi.array().items(joi.object({
		    interactions:joi.string().required()
		})),*/

		filterInteractionSchema :joi.object().keys({
		    interactions:joi.array().required()
		}),

		connectionStatusSchema :joi.object().keys({
		    status:joi.string().required(),
		    connection_id:joi.string().required()
		}),

		connectionListSchema :joi.object().keys({
		    status:joi.string().required()
		}),

		ratingSchema :joi.object().keys({
		    rating:joi.number().required(),
		    to_user_id:joi.string().required()
		}),

		requestStatusSchema :joi.object().keys({
		    status:joi.string().required(),
		}),

	}
}
