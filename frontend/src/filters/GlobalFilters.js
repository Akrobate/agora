import Vue from 'vue'
import moment from 'moment'

moment.locale('fr')

Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('DD/MM/YYYY')
  }
})

Vue.filter('humanizeDate', function(value) {
  if (value) {
    if (moment().diff(moment(value), 'days') > 8) {
      return `le ${moment(value).format('Do MMMM YYYY')}`
    }
    return `il y a ${moment(value).fromNow(true)}`
  }
})
