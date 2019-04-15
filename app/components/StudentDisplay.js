import React from 'react';
import { connect } from 'react-redux'
import Confirm from './Modular/Confirm'

const basePath = 'http://localhost:3000/students/'

class StudentDisplay extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      students: [],
      filter: "",
      filtered: [],
      selected: {},
      updated: {},
      tbd: "",
      confirming: false
    };
    this.selectStudent = this.selectStudent.bind(this)
    this.updateStudent = this.updateStudent.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleFilter = this.handleFilter.bind(this)
    this.deleteStudent = this.deleteStudent.bind(this)
    this.showConfirm = this.showConfirm.bind(this)
    this.cancelDelete = this.cancelDelete.bind(this)
    this.filterByString = this.filterByString.bind(this)
  }

  componentDidMount() {
    fetch(basePath)
      .then(res => res.json())
      .then(results => {
        this.setState({ students: results })
      })
  }

  addSuffix(grade) {
    switch (grade) {
      case "1":
        return "1st"
      case "2":
        return "2nd"
      case "3":
        return "3rd"
      default:
        return `${grade}th`
    }
  }

  selectStudent(event) {
    let selectedStudent = this.state.students.find(student => student._id === event.target.dataset.id)
    this.setState({ selected: selectedStudent, updated: selectedStudent })
  }

  // Since the values for updated are nested in state, it's necessary to
  // utilize Object.assign in order to properly update the the state
  // when staging student record changes.
  handleChange(event) {
    let key = event.target.name
    let val = event.target.value
    let change = { [key]: val }
    this.setState(currentState => {
      let newUpdate = Object.assign(currentState.updated, change)
      return Object.assign(currentState, { updated: newUpdate })
    })
  }

  handleFilter(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  // Since there is validation on student updates, this is a pessimistic render.
  updateStudent() {
    fetch(`${basePath + this.state.updated._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.state.updated)
    })
      .then(res => res.json())
      .then(parsed => {
        this.setState({ selected: {} })
        alert(`${parsed.firstname} ${parsed.surname} has been updated.`)
      })
  }

  // Send the delete to the appropriate student record and optimistically render
  deleteStudent(event) {
    let id = event.target.dataset.id
    fetch(`${basePath + id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(() => {
        let newlist = this.state.students.filter(s => s._id !== id)
        this.setState({ confirming: false, students: newlist })
      })
  }

  cancelDelete() {
    this.setState({ confirming: false })
  }

  showConfirm(event) {
    let id = event.target.dataset.id
    console.log(id);
    this.setState({ tbd: id, confirming: true })
  }

  // Search criteria are matched against all student fields visible to the user.
  filterByString(students) {
    let filter = this.state.filter.toLowerCase()
    return students.filter(s => {
      return s.firstname.toLowerCase().includes(filter) || s.surname.toLowerCase().includes(filter) || s.email.toLowerCase().includes(filter) || s.age.toString().includes(filter) || s.grade.toString().includes(filter)
    })
  }

  render() {
    let modal = "";
    let modal2 = "";

    if (this.state.confirming) {
      let student = this.state.students.find(s => s._id === this.state.tbd)
      modal = (<Confirm student={student} deleteStudent={this.deleteStudent} cancelDelete={this.cancelDelete} />);
      modal2 = (<div class="modal-backdrop fade in"></div>);
      //modal = <Confirm />
    }

    return (
      <div>
        {modal}
        <div className="container">
          <div className="panel">
            <center>
              <input type="text" name="filter" placeholder="Search Student Records" onChange={this.handleFilter} />
            </center>
          </div>
          <div className="panel">
            <table className="table table-striped table-responsive table-bordered">
              <thead>
                <tr>
                  <th scope="col">First Name</th>
                  <th scope="col">Last Name</th>
                  <th scope="col">Age</th>
                  <th scope="col">Grade</th>
                  <th scope="col">Email</th>
                  <th scope="col">Edit Student Records</th>
                </tr>
              </thead>
              <tbody>
                {this.filterByString(this.state.students).map(student => {
                  if (this.state.selected !== student) {
                    return (
                      <tr key={student._id}>
                        <td>{student.firstname}</td>
                        <td>{student.surname}</td>
                        <td>{student.age}</td>
                        <td>{this.addSuffix(student.grade)}</td>
                        <td>{student.email}</td>
                        <td>
                          <button className="btn btn-primary" data-id={student._id} onClick={this.selectStudent}>Edit</button>
                          <button className="btn btn-danger" data-toggle="modal" data-id={student._id} onClick={this.showConfirm}>Delete</button>
                        </td>
                      </tr>
                    )
                  }
                  else {
                    return (
                      <tr key={student._id}>
                        <td><input type="text" name="firstname" onChange={this.handleChange} value={this.state.updated.firstname} /></td>
                        <td><input type="text" name="surname" onChange={this.handleChange} value={this.state.updated.surname} /></td>
                        <td><input type="number" name="age" onChange={this.handleChange} value={this.state.updated.age} /></td>
                        <td><input type="number" name="grade" onChange={this.handleChange} value={this.state.updated.grade} /></td>
                        <td><input type="text" name="email" onChange={this.handleChange} value={this.state.updated.email} /></td>
                        <td>
                          <button className="btn btn-info" onClick={this.updateStudent}>Update</button>
                        </td>
                      </tr>
                    )
                  }
                })}
              </tbody>
            </table>
          </div>
        </div>
        {modal2}
      </div>
    );
  }

}


const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(StudentDisplay);
