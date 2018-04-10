const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { handleError } = require('../helpers');

const removeUserSchema = Joi.object().keys({
  ids: Joi.array().items(Joi.string().required()).error(() => ({ message: 'Musíte odeslat pole s id uživatelů.' })),
});
module.exports = function removeUser({ connectToMongo }) {
  return (req, res) =>
    Joi.validate(req.body, removeUserSchema)
      .then(({ ids }) =>
        connectToMongo()
          .then((db) =>
             db.collection('users').remove({
               _id: { $in: ids.map((id) => ObjectId(id)) },
             })
             .then((data) => res.json({
               code: 200,
               message: 'Uživatelé byli úspěšně smazáni.',
               response: {
                 requestedCount: ids.length,
                 removedCount: data.result.n,
               },
             }))
          )
        )
        .catch(handleError(res));
};
