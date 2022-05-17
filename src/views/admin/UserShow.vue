<template>

  <nav class="navbar navbar-light" style="background-color: #f5f6fe;">
    <div class="col-12 user-btn-container">
      <button
        class="btn btn-sm btn-outline-success"
        v-if="showHistory"
        @click="showHistory = false"
      >
        User Detail
      </button>
      <button
        class="btn btn-sm btn-outline-success"
        v-if="!showHistory"
        @click="showHistory = true"
      >
        History
      </button>
      <div class="control-navbar-item">
        <button class="btn btn-sm btn-outline-secondary" @click="$router.push('/admin/users')">User Index</button>
      </div>
    </div>
  </nav>

  <div class="container">
    <form v-if="!showHistory">
      <div class="row">
        <div class="col-12">
          <h4>User Detail</h4>
          <span class="notification">{{ message }}</span>
        </div>

        <div class="col-sm-6">
          <small>First name</small>
          <input type="text" v-model="user.first_name" class="form-control">
          <small>Last name</small>
          <input type="text" v-model="user.last_name" class="form-control">
          <small>Gender</small>
          <select v-model="user.gender" class="form-select">
            <option
              v-for="gender in genders"
              :key="gender"
              :value="gender"
            >
              {{ gender }}
            </option>
          </select>
          <small>Email</small>
          <input type="text" v-model="user.email" class="form-control">
          <small>Phone</small>
          <input type="text" v-model="user.phone" class="form-control">
          <small>Birthday</small>
          <input class="form-control" type="text" v-model="user.birthday">
          <small>Status</small>
          <input class="form-control" type="text" v-model="user.status">
        </div>

        <div class="col-sm-6">
          <small>Address</small>
          <input class="form-control" type="text" v-model="user.address">
          <small>State</small>
          <select v-model="user.state" class="form-select" autocomplete="address-level1">
            <option
              v-for="state in states"
              :key="state"
              :value="state"
            >
              {{ state }}
            </option>
          </select>
          <small>City</small>
          <input class="form-control" type="text" v-model="user.city">
          <small>Zip</small>
          <input class="form-control" type="text" v-model="user.zip">
          <small>Note</small>
          <textarea rows="3" class="form-control" v-model="user.note"></textarea>
          <div class="control-navbar-item">
            <button class="btn btn-sm btn-outline-primary" @click.prevent="updateUser()">Update</button>
            <button class="btn btn-sm btn-outline-danger">Delete</button>
          </div>
        </div>

      </div>
    </form>

    <div class="row" v-if="showHistory">
      <div class="col-12">
        <h4>History</h4>
        <small>Total visit: {{ events.length }} | </small>
        <small>Total spent: ${{ totalSpent }} | </small>
        <small>Last visit: {{ lastVisit }}</small>
      </div>
      <hr>
      <div
        class="col-sm-2 history-event-container card"
        v-for="event in events"
        :key="event.id"
      >
        <div class="card-body">
          <small class="card-subtitle">{{ event.status }}</small>
          <h6 class="card-title">{{ event.date }}</h6>
          <ul class="list-group list-group-flush">
            <li
              class="list-group-item"
              v-for="menu in event.menus"
              :key="menu.id"
            >
              {{ menu.title }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>  
</template>

<script>
import axios from 'axios'
  export default {
    data() {
      return {
        user: {
          events: [],
        },
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
        showHistory: false,
        message: null,
      }
    },
    created() {
      this.showUser();
    },
    computed: {
      events() {
        let events = this.user.events;
        let sortedEvents = events.sort((a, b)=> {
          let idA = a.date_and_start;
          let idB = b.date_and_start;
          if (idA < idB) {
            return -1;
          }
          if (idA > idB) {
            return 1;
          }
          return 0
        });
        return sortedEvents;
      },
      totalSpent() {
        if (this.events.length === 0) {
          return 0
        }
        let booked = this.events.filter((event)=> event.status === "booked")
        console.log(booked);
        return booked.map((event)=> event.total_spent).reduce((sum, price)=> sum + price, 0)
      },
      lastVisit() {
        if (this.events.length === 0) {
          return "N/A"
        }
        let events = this.user.events;
        let sortedEvents = events.sort((a, b)=> {
          let idA = a.date_and_start;
          let idB = b.date_and_start;
          if (idA < idB) {
            return -1;
          }
          if (idA > idB) {
            return 1;
          }
          return 0
        });
        return sortedEvents[sortedEvents.length -1].date;
      },
    },
    methods: {
      showUser() {
        let id = this.$route.params.id
        axios.get(`/users/${id}.json`)
        .then((res)=> {
          this.user = res.data;
        })
      },
      updateUser() {
        let id = this.user.id;
        let user = {}
        user = {
          first_name: this.user.first_name,
          last_name: this.user.last_name,
          gender: this.user.gender,
          email: this.user.email,
          phone: this.user.phone,
          birthday: this.user.birthday,
          address: this.user.address,
          state: this.user.state,
          city: this.user.city,
          zip: this.user.zip,
          status: this.user.status,
          note: this.user.note
        }
        axios.patch(`/users/${id}.json`, user)
        .then((res)=> {
          this.user = res.data
        })
        this.message = "User updated";
        setTimeout(()=> {this.message = null}, 3000);
      },
    },
  }
</script>

<style scoped>
  .row {
    text-align: left;
  }
  .btn-container {
    margin-top: 15px;
  }
  .user-btn-container {
    text-align: left;
    overflow: hidden;
  }
  .control-navbar-item {
    float: right;
  }
  .history-event-container {
    text-align: left;
  }
  .notification {
    color: red;
  }
</style>