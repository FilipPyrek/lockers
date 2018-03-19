const Joi = require('joi');
const { handleError } = require('./helpers');

const addLayoutSchema = Joi.object().keys({
  boxes: Joi.object().required().error(() => ({ message: 'Musíte odeslat objekt s boxy.' })),
  name: Joi.string().required().error(() => ({ message: 'Musíte zadat název layoutu.' })),
});
module.exports = function lockerLayoutAdd({ connectToMongo }) {
  return (req, res) =>
    Joi.validate(req.body, addLayoutSchema)
      .then(({ boxes, name }) =>
        connectToMongo()
          .then((db) =>
             db.collection('layouts').insert({
               creationDate: new Date(),
               boxes,
               name,
             })
             .then((data) => res.json({ body: req.body, data }))
          )
        )
        .catch(handleError(res));
};
