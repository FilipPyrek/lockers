const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { handleError } = require('./helpers');

const removeLayoutSchema = Joi.object().keys({
  ids: Joi.array().items(Joi.string().required()).error(() => ({ message: 'Musíte odeslat pole s id map.' })),
});
module.exports = function lockerLayoutRemove({ connectToMongo }) {
  return (req, res) =>
    Joi.validate(req.body, removeLayoutSchema)
      .then(({ ids }) =>
        connectToMongo()
          .then((db) =>
             db.collection('layouts').remove({
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
