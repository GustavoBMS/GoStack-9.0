import React from 'react';

class TechList extends React.Component{
    
    //State fica as variaveis que podem mudar
    state = {
        newTech: '',
        techs: [
            'Node.js',
            'ReactJS',
            'React Native'
        ]
    }

    //funcoes no react e bom usar arrow func pra poder acessar o this.
    handleInputChange = e => {
        //para mudar o estado da aplicacao utiliza o setState
        this.setState({newTech: e.target.value});
    }

    handleSubmit = e => {
        
    }
    
    render(){
        console.log(this.state);
        return (
            <>
                <h1>{this.state.newTech}</h1>
                <ul>
                    {this.state.techs.map(tech => <li key={tech}>{tech}</li>)}
                </ul>
                <input type='text' onChange={this.handleInputChange} value={this.state.newTech}/>
            </>
        );
    }
}

export default TechList;