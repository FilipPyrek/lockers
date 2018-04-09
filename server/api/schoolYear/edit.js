const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { handleError } = require('../helpers');

const editSchoolYearSchema = Joi.object().keys({
  lockers: Joi.object().error(() => ({ message: 'Tato položka musí být objekt. Klíč je ID skříňky a hodnota je objekt skříňky.' })),
  classes: Joi.array().items(
    Joi.object().keys({
      name: Joi.string().required().error(() => ({ message: 'Tato položka je povinná.' })),
      size: Joi.string().required().error(() => ({ message: 'Tato položka je povinná.' })),
    })
  ).error(() => ({ message: 'Tato položka musí být objekt. Klíč je název třídy a hodnota je počet žáků.' })),
});
module.exports = function editSchoolYear({ connectToMongo }) {
  return (req, res) =>
    Joi.validate(req.body, editSchoolYearSchema)
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
