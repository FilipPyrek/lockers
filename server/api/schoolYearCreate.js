const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { fromJS } = require('immutable');
const { handleError } = require('./helpers');

class LayoutNotFoundError extends Error {}

const schoolYearCreateSchema = Joi.object().keys({
  layoutId: Joi.string().required().error(() => ({ message: 'Musíte ID mateřské mapy.' })),
  name: Joi.string().required().error(() => ({ message: 'Musíte zadat školní rok.' })),
});
module.exports = function schoolYearCreate({ connectToMongo }) {
  return (req, res) =>
    Joi.validate(req.body, schoolYearCreateSchema)
      .then(({ layoutId, name }) =>
        connectToMongo()
          .then((db) =>
            db.collection('layouts')
              .findOne({ _id: ObjectId(layoutId) })
                .then((layout) => {
                  if (layout === null) {
                    throw new LayoutNotFoundError('Layout not found');
                  }
                  return layout;
                })
                .then((layout) =>
                  fromJS(layout.boxes)
                    .map((box) =>
                      box.set('occupation', '')
                        .set('note', '')
                        .set('classes', {})
                    )
                    .toJS()
                )
                .then((boxes) =>
                  db.collection('schoolYears').insert({
                    lastUpdate: new Date(),
                    lockers: boxes,
                    name,
                  })
                  .then((data) => res.json({
                    code: 200,
                    message: 'Školní rok úspěšně vytvořen.',
                    response: data.ops[0],
                  }))
                )
          )
          .catch((error) => {
            if (error instanceof LayoutNotFoundError) {
              res.json({
                code: 404,
                message: 'Mateřská mapa nenalezena.',
                error: {
                  layoutId,
                },
              });
              return;
            }
            throw error;
          })
        )
        .catch(handleError(res));
};
