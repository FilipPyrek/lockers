const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { handleError } = require('./helpers');

const addLayoutSchema = Joi.object().keys({
  ids: Joi.array().items(Joi.string().required()).error(() => ({ message: 'Musíte odeslat pole s id layoutů.' })),
});
module.exports = function lockerLayoutDuplicate({ connectToMongo }) {
  return (req, res) =>
    Joi.validate(req.body, addLayoutSchema)
      .then(({ ids }) =>
        connectToMongo()
          .then((db) =>
            db.collection('layouts')
              .find({
                _id: { $in: ids.map((id) => ObjectId(id)) },
              })
              .toArray()
              .then((layouts) =>
                layouts
                  .map((layout) => {
                    const newLayout = Object.assign(layout);
                    delete newLayout._id;
                    return newLayout;
                  })
                  .map((layout) =>
                    Object.assign(
                      layout,
                      {
                        name: `Kopie - ${layout.name}`,
                        creationDate: new Date(),
                      }
                    )
                  )
              )
              .then((layouts) => db.collection('layouts').insertMany(layouts))
              .then(({ insertedIds }) => res.json({
                code: 200,
                message: 'Rozložení byla úspěšně duplikována.',
                result: {
                  newIdsIds: insertedIds,
                },
              }))
          )
        )
        .catch(handleError(res));
};
