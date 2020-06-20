import { ErrorHandlerService } from './../../services/error-handler.service';
import { environment } from './../../../environments/environment';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { matchingPasswords } from 'src/assets/utils/app-validators';
// model para usuario
import { DadosUsuario } from './../../model/dadosUsuario';
import { NgxViacepService, ErroCep, Endereco } from '@brunoc/ngx-viacep'; // Importando o serviço
import { debounce, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-form-cadastro',
  templateUrl: './form-cadastro.component.html',
  styleUrls: ['./form-cadastro.component.scss']
})

//Adicionar campos no formulário
//https://www.it-swarm.dev/pt/forms/como-adicionar-mais-campos-de-entrada-usando-um-botao-angular-2-formas-dinamicas/829045400/

export class FormCadastroComponent implements OnInit {

  // variavel para travar campo(seu status é alterado por que utilizar o componente)
  @Input()
  flagTravarCampo: boolean;

  @Input()
  includeCrp: boolean;
  // Form Group controla N Form Controls
  // Form Control controla UM campo.
  @Input()
  form: FormGroup; // É um grupo de Form Controls, permite controle de estado de validade de tudo que tem dentro, e
  // comandos utilitários tambem, permite que se nescessário, o componente de cima possa interferir no form
  @Input()
  bootstrap; // se quizer inicialisar o form

  @Output()
  formChange = new EventEmitter(); // evento de mudança no form

  cepAnterior;

  @Input()
  formEndereco: FormGroup; // É um grupo de Form Controls, permite controle de estado de validade de tudo que tem dentro, e
  // comandos utilitários tambem, permite que se nescessário, o componente de cima possa interferir no form
  @Input()
  bootstrapEndereco; // se quizer inicialisar o form endereco

  @Output()
  formEnderecoChange = new EventEmitter(); // evento de mudança no form

  @Output()
  submited = new EventEmitter(); // evento de envio no form
  cepHasErrors: boolean;
  loadingCep: boolean;
  constructor(
    private fb: FormBuilder, // importa o formbuilder para poder usar
    private viacep: NgxViacepService,
    private eh: ErrorHandlerService,
  ) {
  }

  maskPhoneNumber

  ngOnInit(): void {

    // ------------------------ CAMPOS -------------
    this.form = this.fb.group({
      dadosUsuario: this.fb.group({
        // formName: ['valorInicial', Validator]
        email: [this.bootstrap?.email || '', Validators.required],
        nomeCompleto: [this.bootstrap?.nomeCompleto || '', Validators.required],
        cpf: [this.bootstrap?.cpf || '', Validators.required],
        sexo: [this.bootstrap?.sexo || '', Validators.required],
        crp: [this.bootstrap?.crp || '', this.includeCrp ? Validators.required : undefined],
        dataNascimento: [this.bootstrap?.dataNascimento || '', Validators.required],
        telefone: this.fb.array([this.initTelefone(this.bootstrap?.telefone[0]?.telefone)]),
        senha: [this.bootstrap?.senha || '', this.flagTravarCampo ? undefined : Validators.required],
        confirmaSenha: [this.bootstrap?.confirmaSenha || '', this.flagTravarCampo ? undefined : Validators.required],
      }, { validator: this.flagTravarCampo ? undefined : matchingPasswords('senha', 'confirmaSenha') }),
      // ------------------------ FIM CAMPOS -------------

      // ------------------------ CAMPOS ENDEREÇO -------------
      endereco: this.fb.group({
        // formName: ['valorInicial', Validator]
        cep: [this.bootstrap?.endereco?.cep || '', Validators.required],
        uf: [this.bootstrap?.endereco?.uf || '', Validators.required],
        bairro: [this.bootstrap?.endereco?.bairro || '', Validators.required],
        logradouro: [this.bootstrap?.endereco?.logradouro || '', Validators.required],
        cidade: [this.bootstrap?.endereco?.cidade || '', Validators.required],
        numero: [this.bootstrap?.endereco?.numero || '', Validators.required],
      })

    });
    // ------------------------ FIM CAMPOS ENDEREÇO -------------

    this.bootstrap?.telefone?.forEach(telefone => {
      this.addTelefone(telefone.telefone)
    });

    this.formChange.emit(this.form); // emite o form construido para cima
    this.form.valueChanges.subscribe(c => { // sempre que houver uma mudança no form
      // console.log('value change', c);
      this.formChange.emit(this.form); // emite o form para cima
    });

    this.form.get('endereco').get('cep').valueChanges.pipe(debounceTime(500)).subscribe(cep => {
      if (cep !== this.cepAnterior) {
        this.cepAnterior = cep;
        this.loadingCep = true;
        this.viacep.buscarPorCep(this.cepAnterior).then((endereco: Endereco) => {
          this.form.patchValue({
            endereco: {
              cep: endereco.cep,
              uf: endereco.uf,
              bairro: endereco.bairro,
              cidade: endereco.localidade,
              logradouro: endereco.logradouro,
            }
          });
          this.loadingCep = false;
          this.form.get('endereco').get('cep').setErrors(null);
        }).catch((error: ErroCep) => {
          this.form.get('endereco').get('cep').setErrors({
            invalidCep: true
          });
          this.loadingCep = false;
          console.error(error.message);
          // this.eh.handle(error.message);
        });
      }
    });
  }

  initTelefone(telefone?) {

    return this.fb.group({
        telefone: [telefone || '', Validators.required]
    });
  }

  get formCadastroControl () {
    return this.form.get('dadosUsuario') as FormGroup;
  }

  get telefoneControl () {
    return this.formCadastroControl.get('telefone') as FormArray;
}

addTelefone(telefone?) {
  this.telefoneControl.push(this.initTelefone(telefone))
}

removeTelefone(i: number) {
  this.telefoneControl.removeAt(i);
}

  onSubmit() {

    this.form.markAllAsTouched(); // Marcar que o usuário tentou interagir com todos os campos, para mostrar erros caso existam
    if (this.form.valid) { // se o formulário estiver válido
      this.submited.emit(this.form.value); // avisar o componente de cima que o form foi enviado e mandar os valores
    } else {
      console.log('form invalido!', this.form.value);
    }
  }

  setValidTestValues() {
    const id = this.rand();
    this.form.patchValue({
      dadosUsuario: {
        email: 'email' + id + '@teste.com',
        nomeCompleto: 'Nome de Teste ' + id,
        cpf: '11111111111',
        sexo: 'm',
        crp: '11111111111',
        dataNascimento: '01/01/1990',
        telefone: '99999999999',
        senha: '123456',
        confirmaSenha: '123456',
      },
      // endereco: {
      //   cep: '37500292',
      //   uf: 'MG Teste',
      //   bairro: 'BPS Teste',
      //   cidade: 'Itajubá',
      //   logradouro: 'BPS Teste',
      //   numero: '11',
      // }
    });
  }

  rand() {
    return Math.floor((Math.random() * 9999) + 1);
  }

  public switchPhoneMask(phone: number) {

    console.log("phone")
    console.log("phone ", phone)

    if (phone.toString().length > 10) {
      this.maskPhoneNumber = '(00) 0 0000-0000';
    }
    else {
      this.maskPhoneNumber = '(00) 0000-00009';
    }
  }

}
