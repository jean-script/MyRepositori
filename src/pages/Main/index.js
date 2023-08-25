import { useState, useCallback } from 'react'
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa';
import { Container, Form, SubmitButton, List, DeleteButton } from './styles';

import api from '../../services/api';
import { Link } from 'react-router-dom';

function Main(){

    const [newRepo, setNewRepo] = useState('');
    const [repositorios, setRepositorios] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleDelete = useCallback((repo)=> {
        const find = repositorios.filter(r => r.name !== repo);

        setRepositorios(find);
    }, [])

    const handleSubmit = useCallback((e)=>{
        e.preventDefault();
        
            async function submit(){
                setLoading(true);
                try {  
                    
                    if(newRepo == ''){
                        alert('Você precisa indicar um repositorio');
                        throw new Error('Você precisa indicar um repositorio')
                    }
                    const hasRepo = repositorios.find(repo => repo.name === newRepo);

                    if(hasRepo){
                        alert('Repositorio duplicado');
                        throw new Error('Repositorio duplicado');
                    }
                    
                    const response = await api.get(`repos/${newRepo}`);


                    const data = {
                        name: response.data.full_name
                    }
                    
                    setRepositorios([...repositorios, data]);
                    setNewRepo('');

                } catch (error) {
                    console.log(error);
                } finally {
                    setLoading(false);
                }

            }

        submit();
    }, [repositorios, newRepo])   

    return(
        <div>
            <Container>
                <h1>  
                    <FaGithub size={25} />
                    Meus Repositorios
                </h1>

                <Form onSubmit={handleSubmit}>
                    <input 
                        type='text' 
                        placeholder='Adicionar repositorio'
                        value={newRepo}
                        onChange={(e)=> setNewRepo(e.target.value)}
                    />

                    <SubmitButton Loading={ loading ? 1 : 0}>
                        {loading ? (
                            <FaSpinner size={14} color='#fff'/>
                        ) : (
                            <FaPlus size={14} color='#fff' />
                        )}
                    </SubmitButton>
                </Form>

                <List>
                    {repositorios.map(repo => (
                        <li key={repo.name}>
                            <span>
                                <DeleteButton onClick={()=> handleDelete(repo.name)}>
                                    <FaTrash size={14} />
                                </DeleteButton>
                                {repo.name}
                            </span>
                            <a >
                                <FaBars size={14}  />
                            </a>
                        </li>
                    ))}
                </List>

            </Container>
        </div>
    );
}

export default Main;
