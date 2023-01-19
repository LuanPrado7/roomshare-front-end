/* eslint-disable @next/next/no-img-element */
import type {NextPage} from 'next';
import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Filter } from '../components/Filter';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { List } from '../components/List';
import { executeRequest } from '../services/api';

type PrincipalProps = {
    setAccessToken(s:string) : void
}

export const Principal : NextPage<PrincipalProps> = ({setAccessToken}) =>{

    // LISTA & FILTER
    const [list, setList] = useState([]);
    const [previsionDateStart, setPrevisionDateStart] = useState('');
    const [previsionDateEnd, setPrevisionDateEnd] = useState('');
    const [status, setStatus] = useState(0);

    // FORM
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [cep, setCEP] = useState('');

    const sair = () =>{
        localStorage.clear();
        setAccessToken('');
    }

    const getFilteredList = async() => {
        try{            
            const result = await executeRequest('room', 'GET');
            if(result && result.data){
               setList(result.data);
            }
        }catch(e : any){
            console.log('Ocorreu erro ao buscar salas:', e);
        }
    }

    useEffect(() => {
        getFilteredList();
    }, [previsionDateStart, previsionDateEnd, status]);

    const closeModal = () => {
        setShowModal(false);
        setLoading(false);
        setError('');
        setName('');
        setDescription('');
        setAddress('');
        setCEP('');
    }

    const insertRoom = async() => {
        try{
            if(!name){
                return setError('Favor preencher os campos.');
            }

            setLoading(true);

            const body = {
                name,
                description,
                address,
                cep
            };

            await executeRequest('room', 'POST', body);
            await getFilteredList();
            closeModal();
        }catch(e : any){
            console.log('Ocorreu erro ao cadastrar sala:', e);
            if(e?.response?.data?.error){
                setError(e?.response?.data?.error);
            }else{
                setError('Ocorreu erro ao cadastrar sala, tente novamente.');
            }
        }

        setLoading(false);
    }

    return (
        <>
            <Header sair={sair} showModal={() => setShowModal(true)}/>
            <Filter />
            <List list={list} getFilteredList={getFilteredList}/>
            <Footer showModal={() => setShowModal(true)}/>
            <Modal
                show={showModal}
                onHide={closeModal}
                className="container-modal">
                <Modal.Body>
                        <p>Adicionar uma sala</p>
                        {error && <p className='error'>{error}</p>}
                        <input type="text" placeholder='Nome da sala'
                            value={name} onChange={e => setName(e.target.value)}/>
                        <input type="text" placeholder='Descrição da sala'
                            value={description} onChange={e => setDescription(e.target.value)}/>
                        <input type="text" placeholder='Endereço'
                            value={address} onChange={e => setAddress(e.target.value)}/>
                        <input type="text" placeholder='CEP'
                            value={cep} onChange={e => setCEP(e.target.value)}/>
                </Modal.Body>
                <Modal.Footer>
                    <div className='button col-12'>
                        <button
                            disabled={loading}
                            onClick={insertRoom}
                        >   {loading? "..Carregando" : "Salvar"}</button>
                        <span onClick={closeModal}>Cancelar</span>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}