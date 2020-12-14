import React, { Component, Fragment } from 'react'
import { UpTriangle, DownTriangle } from '../Icons'


const BASE_URL = "https://localhost:44363/api/";

export class ChatMessage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAuthenticated: false,
    }
  }

  componentDidMount(){
    this.checkAuthentication();
  }

  componentDidUpdate(prevProps){
    if(prevProps.authToggle !== this.props.authToggle){
      this.checkAuthentication();
    }
  }

  deleteMessage = (id) => {
    fetch(`${BASE_URL}Chat/mydelete?Id=${id}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('bearer-token')}`
      }
    })
      .then((res) => res.json())
      .then((json) => {
        this.props.fetchMessages()
      })
      .catch((err) => { })
  };

  handleLogout = () => {
    this.setState({ isAuthenticated: false, userName: '', messageText: '' }, () => {
      sessionStorage.clear()
    })
  }

  checkAuthentication(){
    const userToken = sessionStorage.getItem('bearer-token')
    const userName = sessionStorage.getItem('authUserName')
    if( userToken && userName){
      this.setState({isAuthenticated: true, userName: userName})
    }else{
      this.handleLogout()
    }
  }


  render() {
    const { createdOn, messageText, userName, id } = this.props.message
    const { isAuthenticated } = this.state
    const deleteButton = (
      <Fragment>
        •&nbsp;
        <button
        onClick={() => { this.deleteMessage(id) }}
        style={{ color: "#E52646" }}
        >
          Delete
        </button>
      </Fragment>
    )
    return (
      <li>
        <div className="chat__container">
          <div className="chat__col left">
              <div className="img-container">
                <img src="https://pfteza-chatapp.s3-us-west-1.amazonaws.com/iconmonstr-user-20.svg" alt="profile" />
              </div>
              <div className="rating">
                  <span className="rating__container">
                      <button><UpTriangle/></button>
                      <span className="rating__int">+1</span>
                      <button><DownTriangle/></button>
                  </span>
              </div>
          </div>
          <div className="chat__col right">
            <div className="messageBody">
              <span className="username">{userName}</span>
              <span className="message">{messageText}</span>
            </div>
            <div className="messageMeta">
              {createdOn} &nbsp;
              { isAuthenticated ? deleteButton : null}
            </div>
          </div>
        </div>
      </li>
    )
  }
}

export default ChatMessage
