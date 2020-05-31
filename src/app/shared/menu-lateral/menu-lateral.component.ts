import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.scss']
})
export class MenuLateralComponent implements OnInit {
  sideMenuOpened = true; // estado atual do side menu (aberto/fechado)
  showHeaders = false; // mostrar o menu?
  perfilUser = 'paciente';

  // -------------------------- BACKGROUNDS ----------------------------
  tree = {
    'background-image': 'url(\'../../../assets/img/backs/background.jpg\')'
};
  white = {
    background: 'white'
  };

  bluish = {
    background: '#edf2f6'
  };
  greysh = {
    background: '#fafafa'
  };
  background: any = this.tree;
  // -------------------------- BACKGROUNDS ----------------------------


  // array de objetos para criar itens de menu do psicologo
  // perfilUsuario, descricao, link, icone
  menu = [
    // itens de menu para ambos perfis de usuário
    {
      perfilUsuario: 'ambos',
      tituloItemMenu: 'Home',
      link: '/home',
      icone: 'home'
    },
    // itens de menu do psicologo
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
    // itens de menu do paciente
    {
      perfilUsuario: 'paciente',
      tituloItemMenu: 'Enviar relato',
      link: '/enviarRelato',
      icone: 'send'
    },
    // itens de menu para ambos perfis de usuário
    {
      perfilUsuario: 'ambos',
      tituloItemMenu: 'Meus Dados',
      link: '/perfil',
      icone: 'person'
    },
  ];
  isMobile: boolean;


  constructor(private router: Router) {
    router.events.subscribe((val: NavigationEnd) => {
      if (val instanceof NavigationEnd) {
        console.log(val);
        if (val.url === '/login') {
          this.showHeaders = false; // esconde sidebar e header se for a page de login
          this.background = this.tree; // mudar o background para a imagem
        } else {
          this.showHeaders = true; // mostra sidebar e header em qualquer outra page
          this.background = this.greysh; // muda o background para a cor
        }
      }
      this.checkWindow(); // verifica se está rodando em mobile ou desktop
    });
  }

  @HostListener('window:resize', ['event']) // se o usuário mudar o tamanho de tela
  onResize(event) {
    this.checkWindow(); // verifica se está rodando em mobile ou desktop
  }

  checkWindow() {
    this.isMobile =  (window.innerWidth < 769); // o tamanho da tela é menor que 769? Se sim é mobile
    this.sideMenuOpened = !this.isMobile; // side menu começa fechado se for mobile, ou aberto se for desktop.
  }

  ngOnInit(): void {
  }

}
