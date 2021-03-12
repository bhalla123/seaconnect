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
			confirm_password: joi.string().valid(joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' } } }),
		}),

		createOrderSchema: joi.object().keys({
			quantity: joi.number().required(),
			offer_id: joi.number().required(),
		}),

		createOfferSchema: joi.object().keys({
			title: joi.string().required(),
			opening_hours: joi.string().empty(''),
			closing_hours: joi.string().empty(''),
			quantity: joi.number().required(),
			important_information: joi.string().empty(''),
			magic_bag: joi.string().empty(''),
			category_id: joi.number().required(),
			opening_days: joi.string().empty(''),
			closing_days: joi.string().empty(''),
			price: joi.number().required(),
			ingredients: joi.string().required(),
			cover_image: joi.string().empty(''),
			contact_number: joi.number().empty(''),
		}),

		createStoreSchema: joi.object().keys({
			name: joi.string().required(),
			latitude: joi.string().empty(''),
			longitude: joi.string().empty(''),
			address: joi.string().required(),
			contact_detail: joi.string().empty(''),
			about: joi.string().empty(''),
			id: joi.string().empty(''),
		}),

		createBookingSchema: joi.object().keys({
			fuel_pump_id: joi.number().required(),
			booking_slot: joi.array().items({
				from_time: joi.string().required(),
				to_time: joi.string().required(),
				fuel_in_liter: joi.string().required(),
				vehicle_type: joi.string().empty(''),
				booking_id:joi.string().empty(''),
			}),
		})
	}
}
