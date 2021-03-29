import React, { useState, useEffect } from 'react';
import { Col, Row, Button, FormGroup, Label, Input, CustomInput, Table } from 'reactstrap';
import { makeStyles } from '@material-ui/core/styles';

import schema from './schema';

import { Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Formik, Field } from 'formik';
 
import './index.css';
import api from "../../services/api";
import InfoIcon from '@material-ui/icons/Info';
import Modal from '@material-ui/core/Modal';

import About from '../about';


function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function Main () {

    const classes = useStyles();
    const [nome, setNome] = useState();
    const [dataNascimento, setDataNascimento] = useState();
    const [email, setEmail] = useState();
    const [ddd, setDdd] = useState();
    const [telefone, setTelefone] = useState();
    const [operadora, setOperadora] = useState('Oi');
    const [campi, setCampi] = useState([]);
    const [idCampus, setIdCampus] = useState();
    const [idCurso, setIdCurso] = useState();
    const [cursoSelecionado, setCursoSelecionado] = useState([]);
    const [users, setUsers] = useState([]);
    const [show, setShow] = useState(false);
    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openMatricula, setOpenMatricula] = useState(false);
    const [matriculaDelete, setMatriculaDelete] = useState();

    
    useEffect(() => {
         api
        .get(`/api/campi`)
        .then(response => {
          setCampi(response.data);
          response.data.map(campus => {
                setCursoSelecionado(campus.cursos);
            })
        });
        api
        .get(`/api/alunos`)
        .then(response => {
            setUsers(response.data);
        }); 

    }, []);

    const handleOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const handleOpenDelete = () => {
      setOpenDelete(true);
    };

    const handleCloseDelete  = () => {
      setOpenDelete(false);
    };

    const handleOpenMatricula = () => {
      setOpenMatricula(true);
    };

    const handleCloseMatricula = () => {
      setOpenMatricula(false);
    };


    const handleDeleteMatriculaAndClose = () => {
      const usersTemp = [];
      api
          .delete(`/api/alunos/${matriculaDelete}`)
          .then(response => {
            users.map(user => {
              if(user.matricula !== response.data.matricula) {
                usersTemp.push(user);
              }
            })
            setUsers(usersTemp);
        });

      setOpenDelete(false);
    };

   

    const body = (
      <div style={modalStyle} className={classes.paper}>
        <h4 id="simple-modal-title">autor</h4>
        <hr/>
        <About/>
        <hr/>
        <Button style={{'margin-left': '80%'}} onClick={() => {handleClose() }}>Fechar</Button>
      </div>
    );

    const bodyMatricula = (
      <div style={modalStyle} className={classes.paper}>
        <h4 id="simple-modal-title">Atenção</h4>
        <hr/>
        <h2>Matrícula já existente. Insira uma nova matrícula</h2>
        <hr/>
        <Button style={{'margin-left': '80%'}} onClick={() => {handleCloseMatricula() }}>Fechar</Button>
      </div>
    );

    const deleteBody = (
      <div style={modalStyle} className={classes.paper}>
        <p id="simple-modal-title">Solicitação de Confirmação</p>
        <hr/>
        <h2>Confirmar exclusão?! </h2>
        <hr/>
        <div style={{'display': 'flex'}}>
          <Button style={{'margin-left': '65%'}} onClick={() => {handleDeleteMatriculaAndClose() }}>Ok</Button>
          <Button style={{'margin-left': '1%', 'backgroundColor': '#a9a9a9'}} onClick={() => {handleCloseDelete() }}>Cancelar</Button>
        </div>
      </div>
    );

    function handleChangeNome(event) {
        setNome(event.target.value);
    }

    function handleChangeNascimento(event) {
        setDataNascimento(event.target.value);
    }

    function handleChangeEmail(event) {
      console.log(event.target.value);
        setEmail(event.target.value);
    }

    function handleChangeDdd(event) {
        setDdd(event.target.value);
    }

    function handleChangeTelefone(event) {
        setTelefone(event.target.value);
    }

    function handleChangeOperadora(event) {
        setOperadora(event.target.value);
        console.log(event.target.value);
    }

    const removeAluno = (matricula) => {
      setMatriculaDelete(matricula);
      handleOpenDelete();
      /*
      api
          .delete(`/api/alunos/${matricula}`)
          .then(response => {
            users.map(user => {
              if(user.matricula !== response.data.matricula) {
                usersTemp.push(user);
              }
            })
            setUsers(usersTemp);
        });
    
        */
      }

    function handleChangeCampus(e) {
        setIdCampus(e.target.value);
        campi.map(campus => {
            if(campus.id_campus == e.target.value) {
                setCursoSelecionado(campus.cursos);
            }
        })
    }

    function handleChangeCurso(e) {
        setIdCurso(e.target.value);
    }

    function handleReset (values) {
        console.log(values)
        values.matricula= '';
        values.nome = '';
        values.dataNascimento = '';
        values.email = '';
        values.ddd= '';
        values.telefone = '';
        values.operadora = 'Oi';
        values.campus = '';
        values.curso = '';
    };

    function onSubmit (values, { resetForm }) {
      const alunoNovo = { 
                      "matricula": values.matricula, 
	                    "nome": values.nome, 
	                    "data_nascimento": values.dataNascimento,
	                    "id_campus": values.campus,
	                    "id_curso": values.curso,
	                    "telefone":
		                  {
			                  "operadora": values.operadora,
			                  "ddd": values.ddd,
			                  "numero": values.telefone
		                  }
                    }
        
        const usersTemp = [];
        api
          .post(`/api/alunos`, alunoNovo)
          .then(response => {
            users.map(user => {
                usersTemp.push(user);
                resetForm({});
            })
            usersTemp.push(response.data);
            setUsers(usersTemp);
            
        }).catch(function (error) {
          handleOpenMatricula();
        })
    }

    function validate(values) {
        const errors = {};
        if(!values.matricula) {
          errors.matricula = 'Matricula é obrigatória';
        }
        if(!values.nome) {
          errors.nome = 'nome é obrigatória';
        }
        if(!values.email) {
          errors.email = 'Email é obrigatória';
        }
        if(!values.ddd) {
          errors.ddd = 'ddd é obrigatória';
        }
        if(!values.telefone) {
          errors.telefone = 'telefone é obrigatória';
        }
        if(!values.operadora) {
          errors.operadora = 'operadora é obrigatória';
        }

        return errors;

    }

    return(
        <div class='formCenter'>
          
          <header className='header'>
            <InfoIcon onClick={handleOpen}></InfoIcon>

              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
              >
                  {body}
              </Modal>
          </header>
        <div className='area'>
          <Formik
            onSubmit = {onSubmit}
            onReset={handleReset}
            validationSchema = {schema}
            validateOnMount
            initialValues= {{
              matricula: '',
              nome : '',
              dataNascimento : '',
              email : '',
              ddd: '',
              telefone : '',
              operadora : 'Oi',
              campus : '1',
              curso : '1',
            }}
            render= {({ values, handleChange, handleSubmit, errors, resetForm }) => (
              <Form className="formulario" onSubmit={handleSubmit}>
              <h3 className="titulo">Formulário de Cadastro de Aluno</h3>
              <Row form>
                <Col md={5}>
                  
  
                <FormGroup>
                  <Label className="matricula">matricula</Label>
                  <Input name="matricula" value={values.matricula} onChange={handleChange} id="examplematricula" placeholder="Adicione a matrícula do aluno" />
                  {errors.matricula && (
                    <span>{errors.matricula}</span>
                  )}
                </FormGroup>
  
  
  
                </Col>
          <Col md={7}>
            <FormGroup>
              <Label className="nome" for="examplenome">nome</Label>
              <Input type="nome" name="nome" value={values.nome} onChange={handleChange} name="nome" id="examplenome" placeholder="Adicione o nome do aluno" />
              {errors.nome && (
                    <span>{errors.nome}</span>
                  )}
            </FormGroup>
          </Col>
          </Row>
          
          <Row form>
            <Col md={5}>
              <FormGroup>
                <Label className="dataNascimento">Nascimento</Label>
                <Input 
                 name="dataNascimento" 
                 value={values.dataNascimento} 
                 onChange={handleChange}
                  type="date"
                  id="exampleDate"
                  placeholder="date placeholder"
          />
          {errors.dataNascimento && (
                    <span>{errors.dataNascimento}</span>
                  )}
              </FormGroup>
            </Col>
            <Col md={7}>
              
            <FormGroup>
              <Label className="email" for="exampleemail">email</Label>
              <Input onChange={handleChange} type="email" name="email" value={values.email} id="exampleemail" placeholder="Adicione o email do aluno" />
              {errors.email && (
                    <span>{errors.email}</span>
                  )}
            </FormGroup>
  
  
            </Col>
          </Row>
          
          <Row form>
            <Col md={2}>
              <FormGroup>
                <Label className="ddd" for="exampleCity">DDD</Label>
                <Input onChange={handleChange} type="text" name="ddd" value={values.ddd} id="ddd" placeholder="DDD"/>
                {errors.ddd && (
                    <span>{errors.ddd}</span>
                  )}
              </FormGroup>
            </Col>
            <Col md={5}>
              <FormGroup>
                <Label className="telefone" for="exampleState">Telefone</Label>
                <Input onChange={handleChange} type="text" name="telefone" value={values.telefone} id="exampleState" placeholder="Telefone"/>
                {errors.telefone && (
                    <span>{errors.telefone}</span>
                  )}
              </FormGroup>
            </Col>
            <Col md={2}>
              <FormGroup>
                <Label  for="exampleZip">Operadora</Label>
                  <CustomInput onChange={handleChange} name="operadora" value={values.operadora} type="select">
                      <option value="Oi">Oi</option>
                      <option value="Tim">Tim</option>
                      <option value="Claro">Claro</option>
                      <option value="Vivo">Vivo</option>
                  </CustomInput>
              </FormGroup>  
            </Col>
          </Row>
  
  
  
          <Row form>
            <Col md={5}>
              <FormGroup>
              <Label className="campus" for="campus">Campus</Label>
              <CustomInput onChange={handleChange} name="campus" value={values.campus} type="select" id="exampleCustomSelect">
                  {campi.map((campus) => (
                           <option value={campus.id_campus}>{campus.nome}</option>
                  ))}
                  </CustomInput>
              </FormGroup>
            </Col>
            <Col md={5}>
              <FormGroup>
                <Label className="curso" for="curso">Curso</Label>
                  <CustomInput onChange={handleChange} name="curso" value={values.curso} type="select" id="exampleCustomSelect">
                      {cursoSelecionado.map((curso) => (
                           <option value={curso.id_curso}>{curso.nome}</option>
                          ))}
                  </CustomInput>
              </FormGroup>  
            </Col>
          </Row>
          <hr/>
  
          <div className="butoes">
            
              <Button 
              type="button" onClick={resetForm} type="reset">Limpar</Button>
              <Button variant="primary" type="submit" className="butaoInserir">Inserir</Button>
          </div>
        </Form>
          )}
          />
      
      </div>
     
     <Table striped className="tableUsers">
      <thead>
        <tr>
          <th>Matrícula</th>
          <th>Nome</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
            {users !== null ? users.map((aluno) => (
                         <tr>
                         <th>{aluno.matricula}</th>
                         <td>{aluno.nome}</td>
                         <td><Button onClick={() => removeAluno(aluno.matricula)}>Remover</Button></td>
                       </tr>
            )) : <tr>
                    <th></th>
                    <th>Sem registro de alunos</th>
                    <th></th>
                </tr>}

                <Modal
                open={openDelete}
                onClose={handleCloseDelete}
              >
                  {deleteBody}
              </Modal>

              <Modal
                open={openMatricula}
                onClose={handleCloseMatricula}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
              >
                  {bodyMatricula}
              </Modal>

      </tbody>
    </Table>
      </div>

      
    );
}

