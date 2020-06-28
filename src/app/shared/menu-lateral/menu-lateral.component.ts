import { AuthService } from 'src/app/services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit, HostListener } from '@angular/core';
import { User } from 'src/app/model/user';

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
      tituloItemMenu: 'Convidar Paciente',
      link: '/convidar',
      icone: 'contact_mail'
    },
    {
      perfilUsuario: 'psicologo',
      tituloItemMenu: 'Listar Convites',
      link: '/listarConvites',
      icone: 'recent_actors'
    },

    {
      perfilUsuario: 'psicologo',
      tituloItemMenu: 'Lista de Pacientes',
      link: '/listarPacientes',
      icone: 'list'
    },

    {
      perfilUsuario: 'psicologo',
      tituloItemMenu: 'Registrar Consulta',
      link: '/registrarConsulta',
      icone: 'description'
    },


    {
      perfilUsuario: 'psicologo',
      tituloItemMenu: 'Prontuário',
      link: '/prontuario',
      icone: 'assignment'
    },
    // itens de menu do paciente
    {
      perfilUsuario: 'paciente',
      tituloItemMenu: 'Enviar relato',
      link: '/enviarRelato',
      icone: 'send'
    },

    {
      perfilUsuario: 'paciente',
      tituloItemMenu: 'Ver relatos',
      link: '/verRelatos',
      icone: 'article'
    },

    // psicologo
    {
      perfilUsuario: 'psicologo',
      tituloItemMenu: 'Relatórios',
      link: '/relatorios',
      icone: 'source'
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
  user: User;


  constructor(private router: Router, private auth: AuthService) {
    this.auth.user$.subscribe(user => {
      this.user = user;
    });
    router.events.subscribe((val: NavigationEnd) => {
      if (val instanceof NavigationEnd) {
        let str = val.urlAfterRedirects.substring(
          val.urlAfterRedirects.indexOf('/', 0) + 1,
        );
        if (str.indexOf('/', 0) !== -1) {
          console.log('redoing');
          str = str.substring(0,
            str.indexOf('/', 0)
          );
        }

        switch (str) {

          case 'login':
            this.showHeaders = false; // esconde sidebar e header se for a page de login
            this.background = this.tree; // mudar o background para a imagem'
            break;
          case 'convite':
            this.showHeaders = false;
            break;
          default:
            this.showHeaders = true; // mostra sidebar e header em qualquer outra page
            this.background = this.greysh; // muda o background para a cor
            break;
        }
      }
      this.checkWindow(); // verifica se está rodando em mobile ou desktop
    });
  }

  @HostListener('window:resize', ['event']) // se o usuário mudar o tamanho de tela
  onResize(event) {
    this.checkWindow(); // verifica se está rodando em mobile ou desktop
  }

  hasAccess(type) {
    if (this.user) {
      switch (type) {
        case 'psicologo':
          return this.user.isPsicologo;
          break;
        case 'paciente':
          return this.user.isPaciente;
          break;

        default:
          return true;
          break;
      }
    } else {
      return false;
    }
  }

  checkWindow() {
    this.isMobile = (window.innerWidth < 769); // o tamanho da tela é menor que 769? Se sim é mobile
    this.sideMenuOpened = !this.isMobile; // side menu começa fechado se for mobile, ou aberto se for desktop.
  }

  ngOnInit(): void {
  }

}
