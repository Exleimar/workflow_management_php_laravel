import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Multiselect } from 'multiselect-react-dropdown';
import { compose } from 'redux';
import { connect } from 'react-redux';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import GroupTable from '../components/GroupTable';

class EditGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      name: this.props.groupInfo.name,
      description: null,
      leader_id: null,
      startDate: new Date(),
      endtDate: new Date(),
      start: null,
      end: null,
      groupMember: null,

      viceLeader_id: [],
      viceLeader_task: '',

      staff_id: [],
      staff_task: ''
    };

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);

    this.onSelect = this.onSelect.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.handleChange_startDate = this.handleChange_startDate.bind(this);
    this.handleChange_endDate = this.handleChange_endDate.bind(this);
    this.editGroup = this.editGroup.bind(this);

    this.onSelectViceLeader = this.onSelectViceLeader.bind(this);
    this.onRemoveViceLeader = this.onRemoveViceLeader.bind(this);
    this.addViceLeader = this.addViceLeader.bind(this);

    this.onSelectStaff = this.onSelectStaff.bind(this);
    this.onRemoveStaff = this.onRemoveStaff.bind(this);
    this.addStaff = this.addStaff.bind(this);
  }

  componentDidMount() {
    this.fetchUserData();
  }

  fetchUserData() {
    var token = this.props.LoginStatus.token;
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

    axios.get(`http://localhost:8181/api/groups/${this.props.groupId}/users`).then(response => {
      // handle success
      console.log(response.data);
      this.setState({
        groupMember: response.data
      });
    });
  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  handleChange_startDate(date) {
    this.setState({
      startDate: date,
      start: this.formatDate(date)
    });
  }

  handleChange_endDate(date) {
    this.setState({
      endtDate: date,
      end: this.formatDate(date)
    });
  }

  editGroup() {
    var token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

    axios
      .post('http://localhost:8181/api/groups', {
        name: this.state.name,
        description: this.state.description,
        founding_date: this.state.start,
        expiration_date: this.state.end,
        leader_id: this.state.leader_id
      })
      .then(response => {
        console.log(response);
        this.notifyA();
      });
  }

  addViceLeader() {
    var token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    var data = {
      group_id: this.props.groupId,
      user_ids: this.state.viceLeader_id,
      role: 'Vice leader',
      task: this.state.viceLeader_task
    };
    axios.post('http://localhost:8181/api/groups/group/user/create', data).then(response => {
      console.log(response);
      this.notifyA();
    });
  }

  addStaff() {
    var token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    var data = {
      group_id: this.props.groupId,
      user_ids: this.state.staff_id,
      role: 'Staff',
      task: this.state.staff_task
    };
    console.log(data);
    axios.post('http://localhost:8181/api/groups/group/user/create', data).then(response => {
      console.log(response);
      this.notifyA();
    });
  }

  onSelect(optionsList, selectedItem) {
    this.setState({
      leader_id: selectedItem.id
    });
  }
  onRemove(optionList, removedItem) {}

  onSelectViceLeader(optionsList, selectedItem) {
    this.setState({
      viceLeader_id: [...this.state.viceLeader_id, selectedItem.id]
    });
  }
  onRemoveViceLeader(optionList, removedItem) {}

  onSelectStaff(optionsList, selectedItem) {
    this.setState({
      staff_id: [...this.state.staff_id, selectedItem.id]
    });
  }
  onRemoveStaff(optionList, removedItem) {}

  notifyA() {
    toast.success('Successfully !', {
      position: toast.POSITION.TOP_RIGHT
    });
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  render() {
    return (
      <>
        <Button variant='btn btn-outline-success btn-edit mr-2' onClick={this.open}>
          Edit
        </Button>

        <Modal size='lg' show={this.state.showModal} onHide={this.close} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>Edit group {this.props.groupInfo.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='form text_align_form'>
              <ToastContainer enableMultiContainer position={toast.POSITION.TOP_RIGHT} />
              <div className='form-group'>
                <p>Name :</p>
                <input
                  type='text'
                  className='form-control col-6'
                  id='usr'
                  onChange={e => {
                    this.setState({ name: e.target.value });
                  }}
                  value={this.props.groupInfo.name}
                />
              </div>
              <div className='form-group'>
                <p>Description :</p>
                <textarea
                  type='text'
                  className='form-control col-6'
                  id='usr'
                  onChange={e => {
                    this.setState({ description: e.target.value });
                  }}
                  value={this.props.groupInfo.description}
                />
              </div>
              <div className='form-group'>
                <p>Manager :</p>
                <div className='non-padding col-6'>
                  <Multiselect
                    options={this.props.LoginStatus.users} // Options to display in the dropdown
                    onSelect={this.onSelect} // Function will trigger on select event
                    onRemove={this.onRemove} // Function will trigger on remove event
                    displayValue='name' // Property name to display in the dropdown options
                  />
                </div>
              </div>
            </div>
            <div className='form-group'>
              <p>Vice leader :</p>
              <div className='mini-form-area'>
                <div className='form-group row'>
                  <p className='col-3'>Select Vice leader :</p>
                  <div className='non-padding col-6 select_backgroud'>
                    <Multiselect
                      options={this.props.LoginStatus.users} // Options to display in the dropdown
                      onSelect={this.onSelectViceLeader} // Function will trigger on select event
                      onRemove={this.onRemoveViceLeader} // Function will trigger on remove event
                      displayValue='name' // Property name to display in the dropdown options
                    />
                  </div>
                  <div className='col-3'></div>
                </div>
                <div className='form-group row'>
                  <p className='col-3'>Mission :</p>
                  <textarea
                    type='text'
                    className='form-control col-6'
                    id='usr'
                    onChange={e => this.setState({ viceLeader_task: e.target.value })}
                  />
                  <div className='col-3'>
                    <button
                      className='btn'
                      onClick={() => {
                        this.props.fetchData();
                        this.addViceLeader();
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
                <div className='form-group'>
                  <GroupTable
                    tableName='Vice leader'
                    data={this.state.groupMember}
                    groupId={this.props.groupId}
                  />
                </div>
              </div>
            </div>
            <div className='form-group'>
              <p>Staff :</p>
              <div className='mini-form-area'>
                <div className='form-group row'>
                  <p className='col-3'>Select Staff :</p>
                  <div className='non-padding col-6 select_backgroud'>
                    <Multiselect
                      options={this.props.LoginStatus.users} // Options to display in the dropdown
                      onSelect={this.onSelectStaff} // Function will trigger on select event
                      onRemove={this.onRemoveStaff} // Function will trigger on remove event
                      displayValue='name' // Property name to display in the dropdown options
                    />
                  </div>
                  <div className='col-3'></div>
                </div>
                <div className='form-group row'>
                  <p className='col-3'>Mission :</p>
                  <textarea
                    type='text'
                    className='form-control col-6'
                    id='usr'
                    onChange={e => this.setState({ staff_task: e.target.value })}
                  />
                  <div className='col-3'>
                    <button
                      className='btn'
                      onClick={() => {
                        this.props.fetchData();
                        this.addStaff();
                      }}
                    >
                      Save
                    </button>
                  </div>
                </div>
                <div className='form-group'>
                  <GroupTable
                    tableName='Staff'
                    data={this.state.groupMember}
                    groupId={this.props.groupId}
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className='row'>
            <div className='col-6'></div>
            <div className='col-2'>
              <Button variant='secondary' onClick={this.close}>
                Close
              </Button>
            </div>

            <div className='col-3'>
              <Button variant='primary' onClick={this.close}>
                Save Changes
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

const mapStatetoProps = state => {
  return {
    LoginStatus: state.LoginStatus
  };
};

export default compose(connect(mapStatetoProps))(EditGroup);
