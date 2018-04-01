const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { fromJS } = require('immutable');
const { handleError } = require('./helpers');

class LayoutNotFoundError extends Error {}

const schoolYearCreateSchema = Joi.object().keys({
  layoutId: Joi.string().required().error(() => ({ message: 'Musíte ID mateřského layoutu.' })),
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
                    )
                    .toJS()
                )
                .then((boxes) =>
                  db.collection('schoolYears').insert({
                    lastUpdate: new Date(),
                    lockers: boxes,
                    name,
                  })
                  .then(() => res.json({
                    code: 200,
                    message: 'Rozložení bylo úspěšně vytvořeno.',
                  }))
                )
          )
          .catch((error) => {
            if (error instanceof LayoutNotFoundError) {
              res.json({
                code: 404,
                message: 'Mateřské rozložení nenalezeno.',
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
