const express = require(`express`);
const usuarios = require(`./controladores/usuarios`);
const pokemons = require(`./controladores/pokemons`);
const inter = require(`./intermediarios/intermediario`);
const rotas = express();

rotas.post(`/usuarios`, inter.nameVerify, inter.emailVerify, inter.passwordVerify, usuarios.cadastrarUsuarios);
rotas.post(`/login`, inter.passwordVerify, usuarios.login);

rotas.post(`/pokemons`, inter.nameVerify, inter.habilidadeVerify, inter.tokenVerify, pokemons.cadastrarPokemon);
rotas.put(`/pokemons/:id`, inter.apelidoVerify, inter.tokenVerify, pokemons.atualizarApelido);
rotas.get(`/pokemons`, inter.tokenVerify, pokemons.listarPokemons);
rotas.get(`/pokemons/:id`, inter.tokenVerify, pokemons.obterPokemon);
rotas.delete(`/pokemons/:id`, inter.tokenVerify, pokemons.excluirPokemon);

module.exports = rotas;