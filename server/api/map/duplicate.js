const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { handleError } = require('../helpers');

const duplicateMapSchema = Joi.object().keys({
  ids: Joi.array().items(Joi.string().required()).error(() => ({ message: 'Musíte odeslat pole s id map.' })),
});
module.exports = function duplicateMap({ connectToMongo }) {
  return (req, res) =>
    Joi.validate(req.body, duplicateMapSchema)
      .then(({ ids }) =>
        connectToMongo()
          .then((db) =>
            db.collection('maps')
              .find({
                _id: { $in: ids.map((id) => ObjectId(id)) },
              })
              .toArray()
              .then((maps) =>
                maps
                  .map((map) => {
                    const newMap = Object.assign(map);
                    delete newMap._id;
                    return newMap;
                  })
                  .map((map) =>
                    Object.assign(
                      map,
                      {
                        name: `Kopie - ${map.name}`,
                        lastUpdate: new Date(),
                      }
                    )
                  )
              )
              .then((maps) => db.collection('maps').insertMany(maps))
              .then(({ insertedIds }) => res.json({
                code: 200,
                message: 'Mapy byly úspěšně duplikovány.',
                result: {
                  newIdsIds: insertedIds,
                },
              }))
          )
        )
        .catch(handleError(res));
};
