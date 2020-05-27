import { environment } from './../../../environments/environment';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { matchingPasswords } from 'src/assets/utils/app-validators';

@Component({
  selector: 'app-form-cadastro',
  templateUrl: './form-cadastro.component.html',
  styleUrls: ['./form-cadastro.component.scss']
})
export class FormCadastroComponent implements OnInit {

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

  @Input()
  formEndereco: FormGroup; // É um grupo de Form Controls, permite controle de estado de validade de tudo que tem dentro, e
  // comandos utilitários tambem, permite que se nescessário, o componente de cima possa interferir no form
  @Input()
  bootstrapEndereco; // se quizer inicialisar o form endereco

  @Output()
  formEnderecoChange = new EventEmitter(); // evento de mudança no form

  showTest = environment.enableTests;

  @Output()
  submited = new EventEmitter(); // evento de envio no form
  constructor(
    private fb: FormBuilder// importa o formbuilder para poder usar
  ) {
  }

  ngOnInit(): void {

    // ------------------------ CAMPOS -------------
    this.form = this.fb.group({
      dadosUsuario: this.fb.group({
        // formName: ['valorInicial', Validator]
        email: [this.bootstrap?.email || '', Validators.required],
        nomeCompleto: [this.bootstrap?.nomeCompleto || '', Validators.required],
        cpf: [this.bootstrap?.cpf || '', Validators.required],
        sexo: [this.bootstrap?.sexo || '', Validators.required],
        crp: [this.bootstrap?.sexo || '', this.includeCrp ? Validators.required : null],
        data: [this.bootstrap?.data || '', Validators.required],
        telefone: [this.bootstrap?.telefone || '', Validators.required],
        senha: [this.bootstrap?.senha || '', Validators.required],
        confirmaSenha: [this.bootstrap?.confirmaSenha || '', Validators.required],
      }, { validator: matchingPasswords('senha', 'confirmaSenha') }),
      // ------------------------ FIM CAMPOS -------------

      // ------------------------ CAMPOS ENDEREÇO -------------
      endereco: this.fb.group({
        // formName: ['valorInicial', Validator]
        cep: [this.bootstrap?.cep || '', Validators.required],
        uf: [this.bootstrap?.uf || '', Validators.required],
        bairro: [this.bootstrap?.bairro || '', Validators.required],
        logradouro: [this.bootstrap?.logradouro || '', Validators.required],
        numero: [this.bootstrap?.numero || '', Validators.required],
      })
    });
    // ------------------------ FIM CAMPOS ENDEREÇO -------------

    this.formChange.emit(this.form); // emite o form construido para cima
    this.form.valueChanges.subscribe(c => { // sempre que houver uma mudança no form
      this.formChange.emit(this.form); // emite o form para cima
    });
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
        email: 'email' +   id + '@teste.com',
        nomeCompleto: 'Nome de Teste ' + id,
        cpf: '11111111111',
        sexo: 'm',
        crp: '11111111111',
        data: '01/01/1990',
        telefone: '99999999999',
        senha: '123456',
        confirmaSenha: '123456',
      },
      endereco: {
        cep: '37500292',
        uf: 'MG Teste',
        bairro: 'BPS Teste',
        logradouro: 'BPS Teste',
        numero: '11',
      }
    });
  }

  rand() {
    return Math.floor((Math.random() * 9999) + 1);
  }

}
