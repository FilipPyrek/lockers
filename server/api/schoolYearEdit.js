const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { handleError } = require('./helpers');

const addLayoutSchema = Joi.object().keys({
  lockers: Joi.object().error(() => ({ message: 'Tato položka musí být objekt. Klíč je ID skříňky a hodnota je objekt skříňky.' })),
  classes: Joi.object().error(() => ({ message: 'Tato položka musí být object. Klíč je název třídy a hodnota je počet žáků.' })),
});
module.exports = function schoolYearEdit({ connectToMongo }) {
  return (req, res) =>
    Joi.validate(req.body, addLayoutSchema)
      .then(({ lockers, classes }) =>
        connectToMongo()
          .then((db) =>
            db.collection('schoolYears')
              .updateOne(
              { _id: ObjectId(req.params.id) },
              {
                $set: Object.assign(
                  {
                    lastUpdate: new Date(),
                  },
                  lockers ? { lockers } : {},
                  classes ? { classes } : {}
                ),
              }
              )
              .then(() => res.json({
                code: 200,
                message: 'Změny ve školním roce byly úspěšně uloženy.',
              }))
        )
    )
    .catch(handleError(res));
};
