const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const { handleError } = require('../helpers');

const userLoginSchema = Joi.object().keys({
  email: Joi.string().email().required().error(() => ({ message: 'Musíte zadat email v platném tvaru např. jmeno@domena.com' })),
  password: Joi.string().required().error(() => ({ message: 'Musíte zadat heslo' })),
});
class AuthError extends Error {}
module.exports = function userLogin({ connectToMongo }) {
  return (req, res) =>
    Joi.validate(req.body, userLoginSchema)
      .then(({ email, password }) =>
        connectToMongo().then((db) =>
          db.collection('users')
            .findOne({ email: email.toLowerCase() })
              .then((data) => {
                if (data === null) {
                  throw new AuthError('User not found');
                }
                return data;
              })
              .then(({ _id, password: hashedPassword }) =>
                bcrypt.compare(password, hashedPassword)
                  .then((isMatching) => {
                    if (!isMatching) throw new AuthError('Passwords are not matching');
                  })
                  .then(() =>
                    db.collection('users').updateOne(
                      { _id: ObjectId(_id) },
                      { $set: { lastLogin: new Date() } }
                    )
                  )
                  .then(() =>
                    res.json({
                      code: 200,
                      message: 'Přihlášení proběhlo úspěšně',
                      response: {
                        token: jwt.sign(
                          {
                            verified: true,
                          },
                          process.env.API_KEY,
                          {
                            expiresIn: '1d',
                          }
                        ),
                      },
                    })
                  )
              )
          )
      )
      .catch((err) => {
        if (err instanceof AuthError) {
          res.json({
            code: 401,
            error: 'Zadali jste špatný email nebo heslo. Překontrolujte údaje.',
          });
          return;
        }
        throw err;
      })
      .catch(handleError(res));
};
