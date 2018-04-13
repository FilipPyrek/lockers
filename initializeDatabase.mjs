use lockers;
db.createUser({
  user: 'lockers',
  pwd: 'heslo123',
  roles: ['readWrite']
});
db.getCollection('users').insertOne({
  email: 'admin@sspbrno.cz',
  isApi: false,
  lastUpdate: new Date(),
  password: '$2a$12$6sROvr5ZRDTRWIu/sb5syub.BpmQbbGldZ1wcURSb6dAqno3I9PEm',
});
use admin;
db.shutdownServer();
