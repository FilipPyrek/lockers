use lockers;
if (db.getUser('lockers') === null) {
  db.createUser({
    user: 'lockers',
    pwd: 'heslo123',
    roles: ['readWrite']
  });
}
if (db.getCollection('users').count({ isApi: false }) === 0) {
  db.getCollection('users').insertOne({
    email: 'admin@sspbrno.cz',
    isApi: false,
    lastUpdate: new Date(),
    password: '$2a$12$6sROvr5ZRDTRWIu/sb5syub.BpmQbbGldZ1wcURSb6dAqno3I9PEm',
  });
}
