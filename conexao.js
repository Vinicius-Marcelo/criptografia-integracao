const { Pool } = require(`pg`);

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'sua bibliotaca',
    password: 'sua senha',
    port: 0000
});

const query = (text, params) => {
    return pool.query(text, params);
};

module.exports = { query };