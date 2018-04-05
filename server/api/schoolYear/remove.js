const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { handleError } = require('../helpers');

const removeSchoolYearSchema = Joi.object().keys({
  ids: Joi.array().items(Joi.string().required()).error(() => ({ message: 'Musíte odeslat pole s id školních roků.' })),
});
module.exports = function removeSchoolYear({ connectToMongo }) {
  return (req, res) =>
    Joi.validate(req.body, removeSchoolYearSchema)
      .then(({ ids }) =>
        connectToMongo()
          .then((db) =>
             db.collection('schoolYears').remove({
               _id: { $in: ids.map((id) => ObjectId(id)) },
             })
             .then((data) => res.json({
               code: 200,
               message: 'Školní roky byly úspěšně smazány.',
               response: {
                 requestedCount: ids.length,
                 removedCount: data.result.n,
               },
             }))
          )
        )
        .catch(handleError(res));
};
