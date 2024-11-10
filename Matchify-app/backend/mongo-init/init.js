// backend/mongo-init/init.js
db.auth('test', 'test')
db = db.getSiblingDB('Matchify')

// Create user for the specific database
db.createUser({
    user: 'test',
    pwd: 'test',
    roles: [
        {
            role: 'readWrite',
            db: 'Matchify'
        }
    ]
})