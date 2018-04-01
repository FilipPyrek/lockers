const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { handleError } = require('./helpers');

const addLayoutSchema = Joi.object().keys({
  lockers: Joi.object().required().error(() => ({ message: 'Musíte odeslat objekt se skříňkami.' })),
});
module.exports = function schoolYearEdit({ connectToMongo }) {
  return (req, res) =>
    Joi.validate(req.body, addLayoutSchema)
      .then(({ lockers }) =>
        connectToMongo()
          .then((db) =>
            db.collection('schoolYears')
              .updateOne(
                { _id: ObjectId(req.params.id) },
                { $set: { lockers, lastUpdate: new Date() } }
              )
              .then(() => res.json({
                code: 200,
                message: 'Změny ve školním roce byly úspěšně uloženy.',
              }))
        )
    )
    .catch(handleError(res));
};
