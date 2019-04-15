import React, { Component } from 'react'
import { connect } from 'react-redux'

const createStudent = 'http://localhost:3000/students'
const allStudent = 'http://localhost:3000/students'

class NewStudent extends Component {
  constructor(props) {
    super(props);
    //information required to submit/create a student record
    this.state = { firstname: '', surname: '', email: '', age: '', grade: '' };
  }

  //allows only numbers on fields
  handleChange(event) {
    if (event.target.name === 'age' || event.target.name === 'grade') {
      this.setState({ [event.target.name]: Number(event.target.value) })
    }
    else (this.setState({ [event.target.name]: event.target.value }))
  }

  //creating student records on db using POST method
  handleSubmit(event) {
    event.preventDefault();
    fetch(createStudent, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.state)
    })
      .then(res => {
        if (res.status === 200) {
          return res.json()
        }
      })
      //confirmation of student record sucessfully added to db
      .then(parse => alert(`Student ${parse.firstname} ${parse.surname} has beeen successfully created.`))
  }

  //deleting student records from the list
  deleteStudent() {
    console.log("entro");
    var id = 1;
    console.log("id " + id);
    var url = createStudent + "/" + id;
    fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    }).then(res => {
      if (res.status === 200) {
        return res.json()
      }
    })
  };


  //pulling student records using the GET method
  getStudents() {
    fetch(allStudent, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        if (res.status === 200) {
          return res.json()
        }
      })
      .then(function (myJson) {
        //creating table and appending values to each row
        $(".table").find('tbody').empty();
        $.each(myJson, function (key, val) {
          var row = "<tr><th>" + val.firstname + "</th><th>" + val.surname + "</th><th>" + val.email + "</th><th>" + val.age + "</th><th>" + val.grade + "</th><th><button className='btn' data-delete=" + val._id + " onClick={this.deleteStudent}>Delete</button></th></tr>"
          $(".table").find('tbody').append(row);
        })
      });
  }

  //rendering page 
  render() {
    return (
      <div className="container">
        <div className="panel">
          <div className="panel-body">
            <form onSubmit={this.handleSubmit.bind(this)}>
              <legend>Create a Student Record</legend>
              <div className="form-group">
                <label htmlFor="firstname">First Name</label>
                <input type="text" name="firstname" id="firstname" placeholder="Jane" className="form-control" required autoFocus value={this.state.firstname} onChange={this.handleChange.bind(this)} />
              </div>
              <div className="form-group">
                <label htmlFor="surname">Last Name</label>
                <input type="text" name="surname" id="surname" placeholder="Doe" className="form-control" required value={this.state.lastname} onChange={this.handleChange.bind(this)} />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="text" name="email" id="email" placeholder="jane.doe@email.com" className="form-control" value={this.state.email} onChange={this.handleChange.bind(this)} />
              </div>
              <div className="form-group">
                <label htmlFor="age">Age</label>
                {/* allows values between X and X */}
                <input type="number" name="age" id="age" className="form-control" value={this.state.age} min="1" max="99" onChange={this.handleChange.bind(this)} />
              </div>
              <div className="form-group">
                <label htmlFor="grade">Grade</label>
                {/* allows values between X and X */}
                <input type="number" name="grade" id="grade" className="form-control" value={this.state.grade} min="1" max="12" onChange={this.handleChange.bind(this)} />
              </div>
              <div className="form-group">
                <button type="submit" className="btn btn-success">Create Student</button>
              </div>
              <div className="form-group">
                <button type="reset" className="btn btn-danger">Cancel</button>
              </div>
            </form>
          </div>
        </div>
        <div className="panel">
          <button className="btn" onClick={this.getStudents}>Get Students</button>
        </div>
        <div className="container-fluid table-responsive" id="tableResult">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Grade</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
        </div>

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(NewStudent);