/* eslint-disable @next/next/no-img-element */
import moment from 'moment';
import type {NextPage} from 'next';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { executeRequest } from '../services/api';
import { Room } from '../types/Room';
import { Item } from './Item';

type ListProps = {
    list: Array<any>,
    getFilteredList() : void
}

export const List : NextPage<ListProps> = ({list, getFilteredList}) =>{

    // FORM
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [_id, setId] = useState('');
    const [name, setName] = useState('');
    const [previsionDate, setPrevisionDate] = useState('');
    const [finishDate, setFinishDate] = useState('');
    const [previsionDateInputType, setPrevisionDateInputType] = useState('text');
    const [finishDateInputType, setFinishDateInputType] = useState('text');

    const closeModal = () => {
        setShowModal(false);
        setLoading(false);
        setError('');
        setName('');
        setPrevisionDate('');
    }

    const selectRoom = (room:Room) => {
        setShowModal(true);
        setName(room.name);
        setId(room.id || '');
    }

    const updateRoom = async() => {
        try{
            if(!_id || !name || !previsionDate){
                return setError('Favor preencher os campos.');
            }

            setLoading(true);

            const body = {
                name,
                finishPrevisionDate:previsionDate
            } as any;

            if(finishDate){
                body.finishDate = finishDate;
            }

            await executeRequest('room?id='+_id, 'PUT', body);
            await getFilteredList();
            closeModal();
        }catch(e : any){
            console.log('Ocorreu erro ao alterar sala:', e);
            if(e?.response?.data?.error){
                setError(e?.response?.data?.error);
            }else{
                setError('Ocorreu erro ao alterar sala, tente novamente.');
            }
        }

        setLoading(false);
    }

    const deleteRoom = async() => {
        try{
            if(!_id){
                return setError('Favor preencher os campos.');
            }

            setLoading(true);

            await executeRequest('room?id='+_id, 'DELETE');
            await getFilteredList();
            closeModal();
        }catch(e : any){
            console.log('Ocorreu erro ao excluir sala:', e);
            if(e?.response?.data?.error){
                setError(e?.response?.data?.error);
            }else{
                setError('Ocorreu erro ao excluir sala, tente novamente.');
            }
        }

        setLoading(false);
    }

    return (
        <>
        <div className={'container-list' + (list && list.length > 0 ? ' not-empty' : '')}>
            {
                list && list.length > 0 
                ? list.map(i => <Item key={i._id} room={i} selectRoom={selectRoom}/>) 
                :
                    <>
                        <img src="/empty.svg" alt='Nenhum registro encontrado'/>
                        <p>Você ainda não possui salas cadastradas!</p>
                    </>
            }
        </div>
        
        <Modal
                show={showModal}
                onHide={closeModal}
                className="container-modal">
                <Modal.Body>
                        <p>Alterar sala</p>
                        {error && <p className='error'>{error}</p>}
                        <input type="text" placeholder='Nome da sala'
                            value={name} onChange={e => setName(e.target.value)}/>
                        <input type={previsionDateInputType} placeholder='Data de previsão da sala'
                            onFocus={e => setPrevisionDateInputType('date')} onBlur={e => !e.target.value ? setPrevisionDateInputType('text') : false}
                            value={previsionDate} onChange={e => setPrevisionDate(e.target.value)}/>
                        <input type={finishDateInputType} placeholder='Data de conclusão'
                            onFocus={e => setFinishDateInputType('date')} onBlur={e => !e.target.value ? setFinishDateInputType('text') : false}
                            value={finishDate} onChange={e => setFinishDate(e.target.value)}/>
                </Modal.Body>
                <Modal.Footer>
                    <div className='button col-12'>
                        <button
                            disabled={loading}
                            onClick={updateRoom}
                        >   {loading? "..Carregando" : "Atualizar"}</button>
                        <span onClick={deleteRoom}>Excluir sala</span>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
        
    );
}