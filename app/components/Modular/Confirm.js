import React from 'react';

class Confirm extends React.Component {
  constructor(props) {
    super(props);

   this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: true,
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  render() {
    const style = {display : 'block'};
    return (
    
      <div>
  
  <div className="modal fade in" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style={style}>
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exanompleModalLabel">Are you sure you want to remove {this.props.student.firstname} {this.props.student.surname}</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close"  onClick={this.props.cancelDelete}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-footer"> 
          <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.props.cancelDelete}>No</button>
          <button type="button" className="btn btn-primary"  data-id={this.props.student._id}  onClick={this.props.deleteStudent}>Yes</button>
        </div>
      </div>
    </div>
  </div>
  </div>
    );
  }
}


export default Confirm;

