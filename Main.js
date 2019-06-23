/*
Copyright 2019 Joyce Emanuele, Wellington Cesar

This file is part of Tradutor de Determinismo (TdD).

TdD is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

TdD is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with TdD. If not, see <https://www.gnu.org/licenses/>.
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
}

function traduzir() {
	AFN = JSON.parse(entrada.value);
	if (sel.value() == 'Aceitação por Pilha Vazia' && AFN.estadosFinais == "") sel.changed(PilhaVazia_EstadoFinal(AFN));
	else if (sel.value() == 'Aceitação por Estado Final' && AFN.estadosFinais != "") sel.changed(EstadoFinal_PilhaVazia(AFN));
};

function EstadoFinal_PilhaVazia(AFN) {
	AFN.estados.push("p0");
	AFN.estados.push("pf");
	AFN.pilhaInicial = "χ";
	AFN.estadoInicial = "p0"
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

	AFN.empilhaveis.push("χ");

	for (let i of AFN.estados) {
		for (let j of AFN.alfabeto) {
			for (let k of AFN.empilhaveis) {
				AFN.delta[i][j]["χ"] = [];
			}
		}
	}

	AFN.delta.p0.ε.χ = [{ "estado": "q0", "pilha": "ζχ" }];

	for (let i of AFN.estadosFinais) {
		for (let j of AFN.empilhaveis) {
			AFN.delta[i].ε[j] = [{ "estado": "pf", "pilha": "" }];
		}
	}

	AFN.estadosFinais = [];

	for (let i of AFN.empilhaveis) {
		AFN.delta.pf.ε[i] = [{ "estado": "pf", "pilha": "" }]
	}

	saida = document.getElementById('det');
	saida.value = JSON.stringify(AFN, null, "\t");

}

function PilhaVazia_EstadoFinal(AFN) {

	AFN.estados.push("p0");
	AFN.estados.push("pf");
	AFN.pilhaInicial = "χ";
	AFN.estadoInicial = "p0"
	AFN.estadosFinais.push("pf");

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

	AFN.empilhaveis.push("χ");

	for (let i of AFN.estados) {
		for (let j of AFN.alfabeto) {
			for (let k of AFN.empilhaveis) {
				AFN.delta[i][j]["χ"] = [];
			}
		}
	}

	AFN.delta.p0.ε.χ = [{ "estado": "q0", "pilha": "ζχ" }];

	for (let i of AFN.estados) {
		if (i == "p0" || i == "pf") continue;
		AFN.delta[i].ε.χ = [{ "estado": "pf", "pilha": "" }];
	}

	console.log(AFN.empilhaveis);
	console.log(AFN.delta);

	saida = document.getElementById('det');
	saida.value = JSON.stringify(AFN, null, "\t");

}