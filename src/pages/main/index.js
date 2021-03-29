import React, { useState, useEffect } from 'react';
import { Col, Row, Button, Form, FormGroup, Label, Input, CustomInput, Table } from 'reactstrap';
import { makeStyles } from '@material-ui/core/styles';

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
    const [matricula, setMatricula] = useState();
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

    const handleDeleteMatriculaAndClose = () => {
      const usersTemp = [];
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

    function handleChangeMatricula(event) {
        setMatricula(event.target.value);
    }

    function handleChangeNome(event) {
        setNome(event.target.value);
    }

    function handleChangeNascimento(event) {
        setDataNascimento(event.target.value);
    }

    function handleChangeEmail(event) {
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

    const addNewCard = () => {
      const alunoNovo = { 
                      "matricula": matricula, 
	                    "nome": nome, 
	                    "data_nascimento": dataNascimento,
	                    "id_campus": idCampus,
	                    "id_curso": idCurso,
	                    "telefone":
		                  {
			                  "operadora": operadora,
			                  "ddd": ddd,
			                  "numero": telefone
		                  }
                    }
        const usersTemp = [];
        api
          .post(`/api/alunos`, alunoNovo)
          .then(response => {
            users.map(user => {
                usersTemp.push(user);
            })
            usersTemp.push(response.data);
            setUsers(usersTemp);
            
        });
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
          <Form className="formulario">
            <h3 className="titulo">Formulário de Cadastro de Aluno</h3>
            <Row form>
              <Col md={5}>
                <FormGroup>
                  <Label className="matricula">matricula</Label>
                  <Input type="matricula" onChange={handleChangeMatricula} id="examplematricula" placeholder="Adicione a matrícula do aluno" />
                </FormGroup>
              </Col>
        <Col md={7}>
          <FormGroup>
            <Label className="nome" for="examplenome">nome</Label>
            <Input type="nome" onChange={handleChangeNome} name="nome" id="examplenome" placeholder="Adicione o nome do aluno" />
          </FormGroup>
        </Col>
        </Row>
        
        <Row form>
          <Col md={5}>
            <FormGroup>
              <Label className="dataNascimento" for="exampledataNascimento">Nascimento</Label>
              <Input 
                onChange={handleChangeNascimento}
                type="date"
                name="date"
                id="exampleDate"
                placeholder="date placeholder"
        />
            </FormGroup>
          </Col>
          <Col md={7}>
            <FormGroup>
              <Label className="email" for="exampleemail">email</Label>
              <Input onChange={handleChangeEmail} type="email" name="email" id="exampleemail" placeholder="Adicione o email do aluno" />
            </FormGroup>
          </Col>
        </Row>
        
        <Row form>
          <Col md={2}>
            <FormGroup>
              <Label className="ddd" for="exampleCity">DDD</Label>
              <Input onChange={handleChangeDdd} type="text" name="city" id="ddd" placeholder="DDD"/>
            </FormGroup>
          </Col>
          <Col md={5}>
            <FormGroup>
              <Label className="telefone" for="exampleState">Telefone</Label>
              <Input onChange={handleChangeTelefone} type="text" name="state" id="exampleState" placeholder="Telefone"/>
            </FormGroup>
          </Col>
          <Col md={2}>
            <FormGroup>
              <Label  for="exampleZip">Operadora</Label>
                <CustomInput onChange={handleChangeOperadora} type="select" id="exampleCustomSelect" name="customSelect">
                    <option value="">Opções</option>
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
            <CustomInput onChange={handleChangeCampus} type="select" id="exampleCustomSelect" name="customSelect">
                {campi.map((campus) => (
                         <option value={campus.id_campus}>{campus.nome}</option>
                ))}
                </CustomInput>
            </FormGroup>
          </Col>
          <Col md={5}>
            <FormGroup>
              <Label className="curso" for="curso">Curso</Label>
                <CustomInput onChange={handleChangeCurso} type="select" id="exampleCustomSelect" name="customSelect">
                    {cursoSelecionado.map((curso) => (
                         <option value={curso.id_curso}>{curso.nome}</option>
                        ))}
                </CustomInput>
            </FormGroup>  
          </Col>
        </Row>
        <hr/>

        <div className="butoes">
          
            <Button onClick={addNewCard} className="butaoLimpar">Limpar</Button>
            <Button onClick={() => addNewCard()} className="butaoInserir">Inserir</Button>
        </div>
      </Form>
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

      </tbody>
    </Table>
      </div>

      
    );
}

