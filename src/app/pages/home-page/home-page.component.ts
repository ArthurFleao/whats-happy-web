import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  perfilUser = "psicologo";

  //array de objetos para criar itens de menu do psicologo
    //perfilUsuario, descricao, link, icone
  menu = [
    //itens de menu do psicologo
  {
    perfilUsuario: 'psicologo',
    tituloItemMenu: 'Cadastrar Paciente',
    link: '/cadastro',
    icone: 'person_add'
  },

  {
    perfilUsuario: 'psicologo',
    tituloItemMenu: 'Lista de Pacientes',
    link: '/login',
    icone: 'list'
  },

  {
    perfilUsuario: 'psicologo',
    tituloItemMenu: 'Relatórios',
    link: '/login',
    icone: 'source'
  },
  //itens de menu do paciente
  {
    perfilUsuario: 'paciente',
    tituloItemMenu: 'Enviar relato',
    link: '/login',
    icone: 'send'
  },
  //itens de menu para ambos perfis de usuário
  {
    perfilUsuario: 'ambos',
    tituloItemMenu: 'Meus Dados',
    link: '/login',
    icone: 'person'
  },
]

  constructor() { }

  ngOnInit(): void {
  }

}
