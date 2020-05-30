import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.scss']
})
export class MenuLateralComponent implements OnInit {

  perfilUser = "paciente";

  //array de objetos para criar itens de menu do psicologo
    //perfilUsuario, descricao, link, icone
  menu = [
    //itens de menu para ambos perfis de usuário
    {
      perfilUsuario: 'ambos',
      tituloItemMenu: 'Home',
      link: '/home',
      icone: 'home'
    },
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
    link: '/enviarRelato',
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
