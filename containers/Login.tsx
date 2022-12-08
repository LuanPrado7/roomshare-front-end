/* eslint-disable @next/next/no-img-element */
import type {NextPage} from 'next';
import { useState } from 'react';
import { executeRequest } from '../services/api';

type LoginProps = {
    setAccessToken(s:string) : void
}

export const Login : NextPage<LoginProps> = ({setAccessToken}) =>{

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    const [nameSignUp, setNameSignUp] = useState('');
    const [emailSignUp, setEmailSignUp] = useState('');
    const [passwordSignUp, setPasswordSignUp] = useState('');
    const [loadingSignUp, setLoadingSignUp] = useState(false);
    const [errorSignUp, setErrorSignUp] = useState('');

    const doLogin = async() => {
        try{
            if(!email || !password){
                return setError('Favor preencher os campos.');
            }

            setLoading(true);

            const body = {
                login: email,
                password
            };

            const result = await executeRequest('login', 'POST', body);
            if(result && result.data){
               localStorage.setItem('accessToken', result.data.token);
               localStorage.setItem('name', result.data.name);
               localStorage.setItem('email', result.data.email);
               setAccessToken(result.data.token);
            }
        }catch(e : any){
            console.log('Ocorreu erro ao efetuar login:', e);
            if(e?.response?.data?.error){
                setError(e?.response?.data?.error);
            }else{
                setError('Ocorreu erro ao efetuar login, tente novamente.');
            }
        }

        setLoading(false);
    }

    const doSignUp = async() => {
        try{
            if(!emailSignUp || !passwordSignUp || !nameSignUp){
                return setErrorSignUp('Favor preencher os campos.');
            }

            setLoadingSignUp(true);

            const body = {
                name: nameSignUp,
                email: emailSignUp,
                password: passwordSignUp
            };

            const result = await executeRequest('user', 'POST', body);
            if(result && result.data){
               
                const body = {
                    login: emailSignUp,
                    password: passwordSignUp
                };
    
                const result = await executeRequest('login', 'POST', body);
                if(result && result.data){
                   localStorage.setItem('accessToken', result.data.token);
                   localStorage.setItem('name', result.data.name);
                   localStorage.setItem('email', result.data.email);
                   setAccessToken(result.data.token);
                }
            }
        }catch(e : any){
            console.log('Ocorreu erro ao efetuar o cadastro:', e);
            if(e?.response?.data?.error){
                setErrorSignUp(e?.response?.data?.error);
            }else{
                setErrorSignUp('Ocorreu erro ao efetuar o cadastro, tente novamente.');
            }
        }

        setLoadingSignUp(false);
    }

    return (
        <>        
            <div className='container-login'>            
                <img src='/roomshare.png' alt='Logo' className='logo'/>
                <div className="form">
                    {!isSignUp ? 
                        <div className='form-login'>
                            {error && <p>{error}</p>}
                            <div>
                                <img src='/mail.svg' alt='Login'/> 
                                <input type="text" placeholder="Login" 
                                    value={email} onChange={e => setEmail(e.target.value)}/>
                            </div>
                            <div>
                                <img src='/lock.svg' alt='Senha'/> 
                                <input type="password" placeholder="Senha" 
                                    value={password} onChange={e => setPassword(e.target.value)}/>
                            </div>
                            <button type='button' onClick={doLogin} disabled={loading}>{loading ? '...Carregando' : 'Login'}</button>
                            <button className='button-cadastrar' type='button' onClick={_ => setIsSignUp(true)}>Cadastrar</button>
                        </div>                                
                        : 
                        <div>
                            {errorSignUp && <p>{errorSignUp}</p>}
                            <div>
                                <img src='/user.svg' alt='Nome'/> 
                                <input type="text" placeholder="Nome" 
                                    value={nameSignUp} onChange={e => setNameSignUp(e.target.value)}/>
                            </div>
                            <div>
                                <img src='/mail.svg' alt='Email'/> 
                                <input type="text" placeholder="E-mail" 
                                    value={emailSignUp} onChange={e => setEmailSignUp(e.target.value)}/>
                            </div>
                            <div>
                                <img src='/lock.svg' alt='Senha'/> 
                                <input type="password" placeholder="Senha" 
                                    value={passwordSignUp} onChange={e => setPasswordSignUp(e.target.value)}/>
                            </div>
                            <button type='button' onClick={doSignUp} disabled={loadingSignUp}>{loadingSignUp ? '...Carregando' : 'Cadastrar'}</button>
                            <button className='button-cancelar' type='button' onClick={_ => setIsSignUp(false)}>Cancelar</button>
                        </div>
                    }           
                </div>       
            </div>        
        </>
    );
}