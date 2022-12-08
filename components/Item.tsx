/* eslint-disable @next/next/no-img-element */
import moment from 'moment';
import type {NextPage} from 'next';
import { Room } from '../types/Room';

type ItemProps = {
    room: Room,
    selectRoom(room:Room) :void
}

export const Item : NextPage<ItemProps> = ({room, selectRoom}) =>{
    return (
        <div className='container-item'>            
            <div>
                <p>Nome: {room.name}</p>
                <p>Descrição: {room.description}</p>
                <p>Endereço: {room.address} - CEP: {room.cep}</p>
            </div>
        </div>
    );
}