const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { handleError } = require('../helpers');

const removeMapSchema = Joi.object().keys({
  ids: Joi.array().items(Joi.string().required()).error(() => ({ message: 'Musíte odeslat pole s id map.' })),
});
module.exports = function removeMap({ connectToMongo }) {
  return (req, res) =>
    Joi.validate(req.body, removeMapSchema)
      .then(({ ids }) =>
        connectToMongo()
          .then((db) =>
             db.collection('maps').remove({
               _id: { $in: ids.map((id) => ObjectId(id)) },
             })
             .then((data) => res.json({
               code: 200,
               message: 'Mapy byly úspěšně smazány.',
               response: {
                 requestedCount: ids.length,
                 removedCount: data.result.n,
               },
             }))
          )
        )
        .catch(handleError(res));
};
