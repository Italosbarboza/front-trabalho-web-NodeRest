import React, { useState, useEffect } from 'react';
import { Col, Row, Button, Form, FormGroup, Label, Input, CustomInput, Table } from 'reactstrap';
import './index.css';
import api from "../../services/api";

export default function Main () {

    const [matricula, setMatricula] = useState();
    const [nome, setNome] = useState();
    const [dataNascimento, setDataNascimento] = useState();
    const [email, setEmail] = useState();
    const [ddd, setDdd] = useState();
    const [telefone, setTelefone] = useState();
    const [operadora, setOperadora] = useState();
    const [campi, setCampi] = useState([]);
    const [idCampus, setIdCampus] = useState();
    const [idCurso, setIdCurso] = useState();
    const [cursoSelecionado, setCursoSelecionado] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
         api
        .get(`/api/campi`)
        .then(response => {
          setCampi(response.data);
        });
        api
        .get(`/api/alunos`)
        .then(response => {
            setUsers(response.data);
        }); 

    }, []);

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

    /*
    function handleChangeOperadora(event) {
        setOperadora(event.target.value);
    }*/

    function addNewCard() {

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
          <div id="area">
        <Form id="formulario">
        <Row form>
          <Col md={5}>
            <FormGroup>
              <Label className="matricula">matricula</Label>
              <Input type="matricula" onChange={handleChangeMatricula} name="matricula" id="examplematricula" placeholder="Adicione a matrícula do aluno" />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label className="nome" for="examplenome">nome</Label>
              <Input type="nome" onChange={handleChangeNome} name="nome" id="examplenome" placeholder="Adicione o nome do aluno" />
            </FormGroup>
          </Col>
        </Row>
        
        <Row form>
          <Col md={5}>
            <FormGroup>
              <Label className="dataNascimento" for="exampledataNascimento">data de Nascimento</Label>
              <Input 
                onChange={handleChangeNascimento}
                type="date"
                name="date"
                id="exampleDate"
                placeholder="date placeholder"
        />
            </FormGroup>
          </Col>
          <Col md={6}>
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
              <Label for="exampleZip">Operadora</Label>
                <CustomInput type="select" id="exampleCustomSelect" name="customSelect">
                    <option value="">Oi</option>
                    <option>Tim</option>
                    <option>Claro</option>
                    <option>Vivo</option>
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


        <div className="butoes">
            <Button onClick={addNewCard}>Inserir</Button>
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
                         <td><Button>Remover</Button></td>
                       </tr>
            )) : <tr>
                    <th>Sem registro de alunos</th>
                </tr>}
      </tbody>
    </Table>
      </div>
    );
}

