import React, {Component} from 'react';
import axios from 'axios';


export default class UnSubscribe extends Component{

    constructor(props){
        super(props);

        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state ={
            email: ''
        }
    }

    onChangeEmail(e){
        this.setState({
            email: e.target.value
        })
    }

    onSubmit(e){
        e.preventDefault();

        axios.delete('https://cowin21-notify.herokuapp.com/users/unsubscribe/' + this.state.email)
            .then( res => {
                console.log(res.data);
                alert("You have unsubscribed successfully");
            });

    }

    render(){
        return(
            <div className="container">
                <div className="col-md-12 mt-5 formDiv">
                    <form onSubmit={this.onSubmit} className="col-md-6 form-div">
                        <div className="form-group">
                            <label>Email: </label>
                            <input type="email" className="form-control"
                            value={this.state.email} onChange={this.onChangeEmail} placeholder="Email">
                            </input>
                        </div>
                        <div className="form-group">
                            <input type="submit" value="Unsubscribe from Notifications" className="btn btn-warning"></input>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}