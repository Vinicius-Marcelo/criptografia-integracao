const conexao = require(`../conexao`);
const securePassword = require(`secure-password`);
const pwd = securePassword();
const jwt = require(`jsonwebtoken`);
const jwtSecrety = require(`../jwt-secrety`);

const cadastrarUsuarios = async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
        const hash = (await pwd.hash(Buffer.from(senha))).toString(`hex`);
        const query = `insert into usuarios (nome, email, senha) values ($1, $2, $3)`;
        const usuario = await conexao.query(query, [nome, email, hash]);
        if (!usuario.rowCount) return res.status(400).json(`Usuario não foi cadastrado`);
        return res.status(200).json(`Usuário cadastrado com sucesso`);
    } catch (error) {
        res.status(400).json(error.message);
    }
};

const login = async (req, res) => {
    const { email, senha } = req.body;
    if (!email) return res.status(400).json(`O email é obrigatório.`);
    try {
        const query = `select * from usuarios where email = $1`;
        const usuarios = await conexao.query(query, [email]);
        if (!usuarios.rowCount) return res.status(400).json(`Email ou senha incorretos.`);
        const usuario = usuarios.rows[0];

        const result = await pwd.verify(Buffer.from(senha), Buffer.from(usuario.senha, `hex`));
        switch (result) {
            case securePassword.INVALID_UNRECOGNIZED_HASH:
            case securePassword.INVALID:
                return res.status(400).json(`Email ou senha incorretos.`);
            case securePassword.VALID:
                break;
            case securePassword.VALID_NEEDS_REHASH:
                try {
                    const hash = (await pwd.hash(Buffer.from(senha))).toString(`hex`);
                    const query = `update usuarios set senha = $1 where email = $2`;
                    await conexao.query(query, [hash, email]);
                } catch {
                }
                break;
        }

        const token = jwt.sign({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        }, jwtSecrety);
        return res.send(token);
    } catch (error) {
        res.status(400).json(error.message);
    }
}

module.exports = { cadastrarUsuarios, login };