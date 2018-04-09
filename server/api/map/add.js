const Joi = require('joi');
const { handleError } = require('../helpers');

const addMapSchema = Joi.object().keys({
  lockers: Joi.object().required().error(() => ({ message: 'Musíte odeslat objekt se skříňkami.' })),
  name: Joi.string().required().error(() => ({ message: 'Musíte zadat název mapy.' })),
});
module.exports = function addMap({ connectToMongo }) {
  return (req, res) =>
    Joi.validate(req.body, addMapSchema)
      .then(({ lockers, name }) =>
        connectToMongo()
          .then((db) =>
             db.collection('maps').insert({
               lastUpdate: new Date(),
               lockers,
               name,
             })
             .then(() => res.json({
               code: 201,
               message: 'Mapa byla úspěšně vytvořena.',
             }))
          )
        )
        .catch(handleError(res));
};
