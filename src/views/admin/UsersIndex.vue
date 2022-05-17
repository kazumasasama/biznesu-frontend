<template>
  <nav class="navbar navbar-light" style="background-color: #f5f6fe;">
    <div class="col-12 users-btn-container">
      <button class="btn btn-outline-success btn-sm" @click="openNewUserDialog()">New user</button>
      <div class="control-navbar-item">
        <small>Sort by</small>
        <button class="btn btn-outline-primary btn-sm" @click="sortById()">User ID</button>
        <button class="btn btn-outline-primary btn-sm" @click="sortByFirstName()">First name</button>
        <button class="btn btn-outline-primary btn-sm" @click="sortByLastName()">Last name</button>
      </div>
    </div>
  </nav>

  <div class="container">

    <div class="modal fade" id="new-user-dialog">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">New User</h5>
          </div>
          <div class="modal-body event-detail-modal-body">
            <form v-on:submit.prevent="createUser()">
              <div class="row">
                <div class="col-sm-6">
                  <p><strong>Required</strong></p>
                  <small>First name</small>
                  <input type="text" v-model="newUser.first_name" class="form-control" autocomplete="given-name">
                  <small>Last name</small>
                  <input type="text" v-model="newUser.last_name" class="form-control" autocomplete="family-name">
                  <small>Email</small>
                  <input type="text" v-model="newUser.email" class="form-control" autocomplete="email">
                  <small>Phone</small>
                  <input type="text" v-model="newUser.phone" class="form-control" autocomplete="tel-national">
                  <small>Gender</small>
                  <select v-model="newUser.gender" class="form-select" autocomplete="sex">
                    <option
                      v-for="gender in genders"
                      :key="gender"
                      :value="gender"
                    >
                      {{ gender }}
                    </option>
                  </select>
                </div>
                <div class="col-sm-6">
                  <p><strong>Optional</strong></p>
                  <small>State</small>
                  <select v-model="newUser.state" class="form-select" autocomplete="address-level1">
                    <option
                      v-for="state in states"
                      :key="state"
                      :value="state"
                    >
                      {{ state }}
                    </option>
                  </select>
                  <small>City</small>
                  <input type="text" v-model="newUser.city" class="form-control" autocomplete="address-level2">
                  <small>Address</small>
                  <input autocomplete="street-address" type="text" v-model="newUser.address" class="form-control">
                  <small>Zip</small>
                  <input type="text" v-model="newUser.zip" class="form-control" autocomplete="postal-code">
                  <small>Note (customer can see)</small>
                  <textarea v-model="newUser.note" col-sm-6s="30" rows="3" class="user-note form-control"></textarea>
                  <small>Birthday</small>
                  <input type="date" v-model="newUser.birthday" class="form-control" autocomplete="bday">
                  <small>Status</small>
                  <input type="text" v-model="newUser.status" class="form-control">
                </div>
                <div class="modal-footer btn-container col-sm-12">
                  <!-- <button class="btn btn-primary">Update</button> -->
                  <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button class="btn btn-primary" type="submit">Submit</button>
                  <small>Password will be generated automatically and the user will be notified immediately by email</small>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <small>Click to see more detail</small>
      <div class="col-md-4" v-for="user in users" :key="user.id">
        <div class="list-group" id="list-tab" @click="this.$router.push(`/admin/users/${user.id}`)">
          <a
            class="list-group-item list-group-item-action"
            @click="showUser(user)"
            role="tab"
          >
            <div class="d-flex w-100 justify-content-between">
              <small>No.{{ user.id }}</small>
              <small>{{ user.status }}</small>
            </div>
            <h6 class="mb-1">{{ user.full_name }}</h6>
            <small class="mb-1">{{ user.email }}</small>
          </a>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import * as bootstrap from 'bootstrap'
  export default {
    data() {
      return {
        users: [],
        user: {},
        sort: "id",
        newUser: {},
        genders: [
          "Male",
          "Female",
          "N/A",
          "Rather not to say"
        ],
        states: [
          "AL", "AK", "AZ", "AR", "CA",
          "CO", "CT", "DE", "FL", "GA",
          "HI", "ID", "IL", "IN", "IA",
          "KS", "KY", "LA", "ME", "MD",
          "MA", "MI", "MN", "MS", "MO",
          "MT", "NE", "NV", "NH", "NJ",
          "NM", "NY", "NC", "ND", "OH",
          "OK", "OR", "PA", "RI", "SC",
          "SD", "TN", "TX", "UT", "VT",
          "VA", "WA", "WV", "WI", "WY"
        ],
        newUserDialog: null,
      }
    },
    created() {
      this.indexUsers();
    },
    mounted() {
      this.newUserDialog = new bootstrap.Modal(document.getElementById('new-user-dialog'))
    },
    methods: {
      indexUsers() {
        axios.get('/users.json')
        .then((res)=> {
          let users = res.data.sort((a, b)=> {
            let idA = a.id;
            let idB = b.id;
            if (idA < idB) {
              return -1;
            }
            if (idA > idB) {
              return 1;
            }
          });
          this.users = users;
        })
      },
      showUser(user) {
        this.user = user;
      },
      sortById() {
        let users = this.users.sort((a, b)=> {
            let idA = a.id;
            let idB = b.id;
            if (idA < idB) {
              return -1;
            }
            if (idA > idB) {
              return 1;
            }
          });
          this.users = users;
      },
      sortByFirstName() {
        let sorted = [];
        let unsorted = this.users
        sorted = unsorted.sort((a, b)=> {
          let nameA = a.first_name.toUpperCase();
          let nameB = b.first_name.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          // names must be equal
          return 0;
        });
        this.sortedByFirstName = sorted;
      },
      sortByLastName() {
        let sorted = [];
        let unsorted = this.users
        sorted = unsorted.sort((a, b)=> {
          let nameA = a.last_name.toUpperCase();
          let nameB = b.last_name.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          // names must be equal
          return 0;
        });
        this.sortedByFirstName = sorted;
      },
      createUser() {
        let password_base = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        function genPassword(length = 10)
        {
          let password = '';
          for (let i = 0; i < length; i++) {
            password += password_base.charAt(Math.floor(Math.random() * password_base.length));
          }
          return password
        }
        let pw = genPassword()
        console.log(pw);
        this.newUser.password = pw
        axios
        .post('/users', this.newUser)
        .then((res)=> {
          this.users.push(res.data);
        })
        .then(()=> {
          this.users = this.users.sort((a, b)=> {
            let idA = a.id;
            let idB = b.id;
            if (idA < idB) {
              return -1;
            }
            if (idA > idB) {
              return 1;
            }
          });
        })
        .then(()=> {
          this.closeNewUserDialog()
        })
      },
      openNewUserDialog() {
        this.newUserDialog.show();
      },
      closeNewUserDialog() {
        this.newUserDialog.hide();
      }
    },
  }
</script>

<style scoped>
  #list-home {
    text-align: left;
  }
  .list-group-item {
    text-align: left;
  }
  .users-btn-container {
    text-align: left;
    overflow: hidden;
  }
  .control-navbar-item {
    float: right;
  }
</style>