const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { handleError } = require('../helpers');

const editMapSchema = Joi.object().keys({
  lockers: Joi.object().required().error(() => ({ message: 'Musíte odeslat objekt se skříňkami.' })),
});
module.exports = function editMap({ connectToMongo }) {
  return (req, res) =>
    Joi.validate(req.body, editMapSchema)
      .then(({ lockers }) =>
        connectToMongo()
          .then((db) =>
            db.collection('maps')
              .updateOne(
                { _id: ObjectId(req.params.id) },
                { $set: { lockers, lastUpdate: new Date() } }
              )
              .then(() => res.json({
                code: 200,
                message: 'Změny v mapách byly úspěšně uloženy.',
              }))
        )
    )
    .catch(handleError(res));
};
