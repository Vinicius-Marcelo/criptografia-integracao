const conexao = require(`../conexao`);
const jwt = require(`jsonwebtoken`);
const jwtSecrety = require(`../jwt-secrety`);

const cadastrarPokemon = async (req, res) => {
    const { nome, habilidades, imagem, apelido, token } = req.body;

    try {
        const usuario = jwt.verify(token, jwtSecrety);
        const query = `insert into pokemons (usuario_id, nome, habilidades, imagem, apelido) values ($1, $2, $3, $4, $5)`;
        const pokemon = await conexao.query(query, [usuario.id, nome, habilidades, imagem, apelido]);
        if (!pokemon.rowCount) return res.status(400).json(`Pokemon não cadastrado.`);
        return res.status(200).json(`Pokemon cadastrado com sucesso.`);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const atualizarApelido = async (req, res) => {
    const { params: { id }, body: { apelido } } = req;
    try {
        const query = `update pokemons set apelido = $1 where id = $2`;
        const pokemon = await conexao.query(query, [apelido, id]);
        if (!pokemon.rowCount) return res.status(400).json(`O apelido não foi atualizado.`);
        return res.status(200).json(`Apelido atualizado com sucesso`);
    } catch (error) {
        return res.status(400).json(error.message);
    }

};

const listarPokemons = async (req, res) => {
    try {
        const query = `select * from pokemons`;
        const pokemon = await conexao.query(query);
        if (!pokemon.rowCount) return res.status(400).json(`Nenhum pokemon foi cadastrado.`);
        return res.status(200).json(pokemon.rows);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const obterPokemon = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `select * from pokemons where id = $1 `;
        const pokemons = await conexao.query(query, [id]);
        if (!pokemons.rowCount) return res.status(400).json(`Nenhum pokemon encontrado.`);
        return res.status(200).json(pokemons.rows);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const excluirPokemon = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `delete from pokemons where id = $1`;
        const pokemon = await conexao.query(query, [id]);
        if (!pokemon.rowCount) return res.status(400).json(`Nenhum pokemon encontrado.`);
        return res.status(200).json(`O pokemon foi excluido.`);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = { cadastrarPokemon, atualizarApelido, listarPokemons, obterPokemon, excluirPokemon };