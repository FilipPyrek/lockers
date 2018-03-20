const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { handleError } = require('./helpers');

const addLayoutSchema = Joi.object().keys({
  id: Joi.string().required().error(() => ({ message: 'Musíte odeslat id layoutu.' })),
});
module.exports = function lockerLayoutAdd({ connectToMongo }) {
  return (req, res) =>
    Joi.validate(req.body, addLayoutSchema)
      .then(({ id }) =>
        connectToMongo()
          .then((db) =>
             db.collection('layouts').remove({
               _id: ObjectId(id),
             })
             .then(() => res.json({
               code: 200,
               message: 'Rozložení bylo úspěšně smazáno.',
             }))
          )
        )
        .catch(handleError(res));
};
