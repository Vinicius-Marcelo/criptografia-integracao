const conexao = require(`../conexao`);
const jwt = require(`jsonwebtoken`);
const jwtSecrety = require(`../jwt-secrety`);


const nameVerify = (req, res, next) => {
    const { nome } = req.body;
    try {
        if (!nome) return res.status(400).json(`O nome é obrigatório.`);
    } catch (error) {
        return res.status(400).json(error.message);
    }
    next();
};
const emailVerify = async (req, res, next) => {
    const { email } = req.body;
    if (!email) return res.status(400).json(`O email é obrigatório.`);
    try {
        const query = `select * from usuarios where email = $1`;
        const usuario = await conexao.query(query, [email]);
        if (usuario.rowCount) return res.status(400).json(`Esse email já foi cadastrado.`);
    } catch (error) {
        return res.status(400).json(error.message);
    }
    next()
};
const passwordVerify = (req, res, next) => {
    const { senha } = req.body;
    if (!senha) return res.status(400).json(`A senha é obrigatório.`);
    next()
};
const habilidadeVerify = async (req, res, next) => {
    const { habilidades } = req.body;
    try {
        if (!habilidades) return res.status(400).json(`A habilidade do pokemon não foi informado.`);
    } catch (error) {
        return res.status(400).json(error.message);
    }
    next();
};
const tokenVerify = async (req, res, next) => {
    const { token } = req.body;
    if (!token) return res.status(400).json(`O token não foi informado.`);
    try {
        jwt.verify(token, jwtSecrety);
    } catch (error) {
        return res.status(400).json(`Token invalido.`);
    }
    next();
};
const apelidoVerify = async (req, res, next) => {
    const { params: { id }, body: { apelido } } = req;
    try {
        if (!apelido) return res.status(400).json(`O apelido não foi informado`);
        const query = `select * from pokemons where id = $1`;
        const pokemon = await conexao.query(query, [id]);
        if (!pokemon.rowCount) return res.status(400).json(`Pokemon não encontrado`);
    } catch (error) {
        return res.status(400).json(error.message);
    }
    next();
}

module.exports = {
    nameVerify,
    emailVerify,
    passwordVerify,
    habilidadeVerify,
    tokenVerify,
    apelidoVerify
};