const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { handleError } = require('../helpers');

const duplicateSchoolYearSchema = Joi.object().keys({
  ids: Joi.array().items(Joi.string().required()).error(() => ({ message: 'Musíte odeslat pole s id školních roků.' })),
});
module.exports = function duplicateSchoolYear({ connectToMongo }) {
  return (req, res) =>
    Joi.validate(req.body, duplicateSchoolYearSchema)
      .then(({ ids }) =>
        connectToMongo()
          .then((db) =>
            db.collection('schoolYears')
              .find({
                _id: { $in: ids.map((id) => ObjectId(id)) },
              })
              .toArray()
              .then((schoolYears) =>
                schoolYears
                  .map((schoolYear) => {
                    const newSchoolYears = Object.assign(schoolYear);
                    delete newSchoolYears._id;
                    return newSchoolYears;
                  })
                  .map((schoolYear) =>
                    Object.assign(
                      schoolYear,
                      {
                        name: `Kopie - ${schoolYear.name}`,
                        lastUpdate: new Date(),
                      }
                    )
                  )
              )
              .then((schoolYears) => db.collection('schoolYears').insertMany(schoolYears))
              .then(({ insertedIds }) => res.json({
                code: 200,
                message: 'Školní roky byly úspěšně duplikovány.',
                result: {
                  newIdsIds: insertedIds,
                },
              }))
          )
        )
        .catch(handleError(res));
};
