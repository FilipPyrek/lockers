const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { fromJS } = require('immutable');
const { handleError } = require('../helpers');

class MapNotFoundError extends Error {}

const addSchoolYearSchema = Joi.object().keys({
  mapId: Joi.string().required().error(() => ({ message: 'Musíte ID mateřské mapy.' })),
  name: Joi.string().required().error(() => ({ message: 'Musíte zadat školní rok.' })),
});
module.exports = function addSchoolYear({ connectToMongo }) {
  return (req, res) =>
    Joi.validate(req.body, addSchoolYearSchema)
      .then(({ mapId, name }) =>
        connectToMongo()
          .then((db) =>
            db.collection('maps')
              .findOne({ _id: ObjectId(mapId) })
                .then((map) => {
                  if (map === null) {
                    throw new MapNotFoundError('Map not found');
                  }
                  return map;
                })
                .then((map) =>
                  fromJS(map.lockers)
                    .map((locker) =>
                      locker.set('occupation', '')
                        .set('note', '')
                        .set('classes', {})
                    )
                    .toJS()
                )
                .then((lockers) =>
                  db.collection('schoolYears').insert({
                    lastUpdate: new Date(),
                    lockers,
                    name,
                    classes: [],
                  })
                  .then((data) => res.json({
                    code: 200,
                    message: 'Školní rok úspěšně vytvořen.',
                    response: data.ops[0],
                  }))
                )
          )
          .catch((error) => {
            if (error instanceof MapNotFoundError) {
              res.json({
                code: 404,
                message: 'Mateřská mapa nenalezena.',
                error: {
                  mapId,
                },
              });
              return;
            }
            throw error;
          })
        )
        .catch(handleError(res));
};
