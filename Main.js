/*
Copyright 2019 Joyce Emanuele, Wellington Cesar

This file is part of Tradutor de Determinismo (TdAP).

TdAP is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

TdAP is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with TdAP. If not, see <https://www.gnu.org/licenses/>.
*/

let entrada, saida, sel;
let AFN;

function setup() {
	entrada = document.getElementById('nde');
	saida = document.getElementById('det');
	sel = createSelect()
		.class("seletor");
	sel.option('Aceitação por Pilha Vazia');
	sel.option('Aceitação por Estado Final');
	sel.changed(
		() => {
			if (sel.value() == 'Aceitação por Pilha Vazia') document.getElementById("resultado").innerText = "Aceitação por Estado Final";
			else document.getElementById("resultado").innerText = "Aceitação por Pilha vazia";
		});
}

function traduzir() {
	AFN = JSON.parse(entrada.value);
	if (sel.value() == 'Aceitação por Pilha Vazia' && AFN.estadosFinais == "") PilhaVazia_EstadoFinal(AFN);
	else if (sel.value() == 'Aceitação por Estado Final' && AFN.estadosFinais != "") EstadoFinal_PilhaVazia(AFN);
}

function EstadoFinal_PilhaVazia(AFN) {
	AFN.estados.push("p0");
	AFN.estados.push("pf");
	AFN.empilhaveis.push("χ");

	AFN.delta["p0"] = {};
	AFN.delta["pf"] = {};
	for (let j of AFN.alfabeto) {
		AFN.delta["p0"][j] = {};
		AFN.delta["pf"][j] = {};
		for (let k of AFN.empilhaveis) {
			AFN.delta["p0"][j][k] = [];
			AFN.delta["pf"][j][k] = [];
		}
	}

	for (let i of AFN.estados) {
		for (let j of AFN.alfabeto) {
			AFN.delta[i][j]["χ"] = [];
		}
	}

	AFN.delta.p0.ε.χ = [{ "estado": AFN.estadoInicial, "pilha": AFN.pilhaInicial + 'χ' }];
	AFN.estadoInicial = "p0";
	AFN.pilhaInicial = "χ";

	for (let i of AFN.estadosFinais) {
		for (let j of AFN.empilhaveis) {
			AFN.delta[i].ε[j] = [{ "estado": "pf", "pilha": "" }];
		}
	}

	AFN.estadosFinais = [];

	for (let i of AFN.empilhaveis) {
		AFN.delta.pf.ε[i] = [{ "estado": "pf", "pilha": "" }];
	}

	saida.value = JSON.stringify(AFN, null, "\t");
}

function PilhaVazia_EstadoFinal(AFN) {
	AFN.estados.push("p0");
	AFN.estados.push("pf");
	AFN.estadosFinais.push("pf");
	AFN.empilhaveis.push("χ");

	AFN.delta["p0"] = {};
	AFN.delta["pf"] = {};
	for (let j of AFN.alfabeto) {
		AFN.delta["p0"][j] = {};
		AFN.delta["pf"][j] = {};
		for (let k of AFN.empilhaveis) {
			AFN.delta["p0"][j][k] = [];
			AFN.delta["pf"][j][k] = [];
		}
	}

	for (let i of AFN.estados) {
		for (let j of AFN.alfabeto) {
			AFN.delta[i][j]["χ"] = [];
		}
	}

	AFN.delta.p0.ε.χ = [{ "estado": AFN.estadoInicial, "pilha": AFN.pilhaInicial + 'χ' }];
	AFN.estadoInicial = "p0";
	AFN.pilhaInicial = "χ";

	for (let i of AFN.estados) {
		if (i == "p0" || i == "pf") continue;
		AFN.delta[i].ε.χ = [{ "estado": "pf", "pilha": "" }];
	}

	saida.value = JSON.stringify(AFN, null, "\t");
}