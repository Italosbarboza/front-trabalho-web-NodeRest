import * as Yup from 'yup';

export default Yup.object().shape({
    matricula: Yup.string().min(6).required(),
    nome : Yup.string().min(3).required(),
    dataNascimento : Yup.date().required(),
    email : Yup.string().email().required(),
    ddd: Yup.number().max(99).required(),
    telefone : Yup.number().required(),
    operadora : Yup.string().required(),
    //campus : '',
    //curso : '',
})