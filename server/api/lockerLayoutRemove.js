const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { handleError } = require('./helpers');

const addLayoutSchema = Joi.object().keys({
  ids: Joi.array().items(Joi.string().required()).error(() => ({ message: 'Musíte odeslat pole s id layoutů.' })),
});
module.exports = function lockerLayoutAdd({ connectToMongo }) {
  return (req, res) =>
    Joi.validate(req.body, addLayoutSchema)
      .then(({ ids }) =>
        connectToMongo()
          .then((db) =>
             db.collection('layouts').remove({
               _id: { $in: ids.map((id) => ObjectId(id)) },
             })
             .then((data) => res.json({
               code: 200,
               message: 'Rozložení byla úspěšně smazána.',
               response: {
                 requestedCount: ids.length,
                 removedCount: data.result.n,
               },
             }))
          )
        )
        .catch(handleError(res));
};
